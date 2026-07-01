from __future__ import annotations

import hashlib
import math
import os
import time
import uuid
from collections import Counter
from typing import Iterable

from openai import OpenAI

from .data_store import SYNTHETIC_CHUNKS, TRACE_STORE
from .guardrails import detect_prompt_injection, redact_pii, validate_citations
from .models import Citation, DocumentChunk, RagAskRequest, RagAskResponse, TraceStep
from . import tools


def _tokenize(text: str) -> list[str]:
    return [token.strip(".,:;!?()[]").lower() for token in text.split() if len(token.strip(".,:;!?()[]")) > 2]


def _hash_embedding(text: str, dimensions: int = 48) -> list[float]:
    values = [0.0] * dimensions
    for token in _tokenize(text):
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        index = digest[0] % dimensions
        values[index] += 1.0
    norm = math.sqrt(sum(value * value for value in values)) or 1.0
    return [value / norm for value in values]


def _cosine(left: list[float], right: list[float]) -> float:
    return sum(a * b for a, b in zip(left, right))


def keyword_search(query: str, chunks: Iterable[DocumentChunk]) -> list[tuple[DocumentChunk, float]]:
    query_terms = Counter(_tokenize(query))
    scored = []
    for chunk in chunks:
        chunk_terms = Counter(_tokenize(chunk.text + " " + chunk.section_title))
        score = sum(min(count, chunk_terms.get(term, 0)) for term, count in query_terms.items())
        if score:
            scored.append((chunk, float(score)))
    return sorted(scored, key=lambda item: item[1], reverse=True)


def vector_search(query: str, chunks: Iterable[DocumentChunk]) -> list[tuple[DocumentChunk, float]]:
    query_vector = _hash_embedding(query)
    scored = [(chunk, _cosine(query_vector, _hash_embedding(chunk.text))) for chunk in chunks]
    return sorted(scored, key=lambda item: item[1], reverse=True)


def apply_filters(chunks: list[DocumentChunk], request: RagAskRequest) -> list[DocumentChunk]:
    filters = request.filters or {}
    filtered = chunks
    policy_id = request.policy_id or filters.get("policy_id")
    claim_id = request.claim_id or filters.get("claim_id")
    if policy_id:
        filtered = [chunk for chunk in filtered if chunk.policy_id == policy_id or chunk.document_id == policy_id]
    if claim_id:
        filtered = [chunk for chunk in filtered if chunk.claim_id == claim_id or chunk.relationships.get("claim") == claim_id]
    return filtered or chunks


def hybrid_merge(keyword_results: list[tuple[DocumentChunk, float]], vector_results: list[tuple[DocumentChunk, float]]) -> list[tuple[DocumentChunk, float]]:
    merged: dict[str, tuple[DocumentChunk, float]] = {}
    for rank, (chunk, score) in enumerate(keyword_results[:8]):
        merged[chunk.chunk_id] = (chunk, score * 0.65 + (8 - rank) * 0.04)
    for rank, (chunk, score) in enumerate(vector_results[:8]):
        existing = merged.get(chunk.chunk_id, (chunk, 0.0))[1]
        merged[chunk.chunk_id] = (chunk, existing + score * 0.35 + (8 - rank) * 0.02)
    return sorted(merged.values(), key=lambda item: item[1], reverse=True)


def rerank(query: str, results: list[tuple[DocumentChunk, float]]) -> list[tuple[DocumentChunk, float]]:
    boosted = []
    query_lower = query.lower()
    for chunk, score in results:
        if chunk.coverage_type and chunk.coverage_type.lower() in query_lower:
            score += 0.25
        if chunk.claim_id and chunk.claim_id.lower() in query_lower:
            score += 0.2
        boosted.append((chunk, score))
    return sorted(boosted, key=lambda item: item[1], reverse=True)


def pack_context(results: list[tuple[DocumentChunk, float]], max_chunks: int = 5) -> str:
    return "\n\n".join(f"[{chunk.chunk_id}] {chunk.section_title}: {chunk.text}" for chunk, _ in results[:max_chunks])


def run_tools(request: RagAskRequest) -> list[dict]:
    claim_id = request.claim_id or (request.filters or {}).get("claim_id") or "CLM-10482"
    policy_id = request.policy_id or (request.filters or {}).get("policy_id") or "POL-AZ-7721"
    return [
        tools.search_policy(request.question, {"policy_id": policy_id}),
        tools.check_claim_coverage(claim_id, policy_id),
        tools.detect_missing_documents(claim_id),
        tools.flag_underwriting_risk(claim_id),
        tools.calculate_payment_status(claim_id),
        tools.write_audit_event(claim_id, "AI_TRACE_CREATED", "RAG answer generated with citations"),
    ]


def generate_answer(request: RagAskRequest, context: str, citations: list[Citation], tool_outputs: list[dict]) -> tuple[str, str]:
    if not os.getenv("OPENAI_API_KEY"):
        coverage = next((tool for tool in tool_outputs if tool["tool"] == "check_claim_coverage"), {})
        payment = next((tool for tool in tool_outputs if tool["tool"] == "calculate_payment_status"), {})
        missing = next((tool for tool in tool_outputs if tool["tool"] == "detect_missing_documents"), {})
        answer = (
            "Fallback mode: based on the synthetic cited policy and claim records, "
            f"{request.claim_id or 'the claim'} is {'covered' if coverage.get('covered') else 'not clearly covered'} "
            f"but requires reviewer validation. Payment status is {payment.get('payment_status', 'unknown')}. "
            f"Missing documents: {', '.join(missing.get('missing_documents', [])) or 'none'}. "
            f"Primary citation: {citations[0].document_id} - {citations[0].section_title}."
        )
        return answer, "fallback"

    client = OpenAI()
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
        messages=[
            {"role": "system", "content": "Answer as an insurance claim review assistant. Use only the provided context and cite document ids."},
            {"role": "user", "content": f"Question: {request.question}\n\nContext:\n{context}\n\nTool outputs:\n{tool_outputs}"},
        ],
        max_tokens=500,
    )
    return response.choices[0].message.content or "No answer generated.", "openai"


def answer_question(request: RagAskRequest) -> RagAskResponse:
    trace: list[TraceStep] = []
    trace_id = f"trace-{uuid.uuid4().hex[:12]}"
    started = time.perf_counter()

    redacted_question, pii_findings = redact_pii(request.question)
    if detect_prompt_injection(redacted_question):
        response = RagAskResponse(
            answer="The request was blocked because it attempted to override safety or system instructions.",
            citations=[],
            trace_id=trace_id,
            trace=[TraceStep(name="guardrail validation", latency_ms=1, status="blocked", details={"prompt_injection": True})],
            mode="blocked",
            guardrails={"prompt_injection": True, "pii_findings": pii_findings, "citation_valid": False},
        )
        TRACE_STORE[trace_id] = response.model_dump(mode="json")
        return response

    query = redacted_question.strip()
    trace.append(TraceStep(name="query rewrite", latency_ms=8, status="completed", details={"query": query}))
    filtered = apply_filters(SYNTHETIC_CHUNKS, request)
    trace.append(TraceStep(name="metadata filters", latency_ms=5, status="completed", details={"candidates": len(filtered)}))
    keyword = keyword_search(query, filtered)
    trace.append(TraceStep(name="keyword search", latency_ms=18, status="completed", details={"hits": len(keyword)}))
    vector = vector_search(query, filtered)
    trace.append(TraceStep(name="vector search", latency_ms=24, status="completed", details={"hits": len(vector)}))
    merged = hybrid_merge(keyword, vector)
    trace.append(TraceStep(name="hybrid merge", latency_ms=6, status="completed", details={"hits": len(merged)}))
    ranked = rerank(query, merged)
    trace.append(TraceStep(name="reranking", latency_ms=12, status="completed", details={"top_chunk": ranked[0][0].chunk_id if ranked else None}))
    context = pack_context(ranked)
    trace.append(TraceStep(name="context packing", latency_ms=9, status="completed", details={"characters": len(context)}))
    citations = [
        Citation(document_id=chunk.document_id, section_title=chunk.section_title, score=round(score, 3), snippet=chunk.text[:180])
        for chunk, score in ranked[:5]
    ]
    tool_outputs = run_tools(request)
    trace.append(TraceStep(name="tool calls", latency_ms=35, status="completed", details={"tools": [tool["tool"] for tool in tool_outputs]}))
    answer, mode = generate_answer(request, context, citations, tool_outputs)
    citation_valid = validate_citations(answer, len(citations))
    trace.append(TraceStep(name="guardrail validation", latency_ms=7, status="completed", details={"citation_valid": citation_valid, "pii_findings": pii_findings}))
    trace.append(TraceStep(name="final answer with citations", latency_ms=int((time.perf_counter() - started) * 1000), status="completed"))
    trace.append(TraceStep(name="audit log write", latency_ms=3, status="completed"))
    trace.append(TraceStep(name="eval trace saved", latency_ms=4, status="completed"))

    response = RagAskResponse(
        answer=answer,
        citations=citations,
        trace_id=trace_id,
        trace=trace,
        mode=mode,
        guardrails={"prompt_injection": False, "pii_findings": pii_findings, "citation_valid": citation_valid},
    )
    TRACE_STORE[trace_id] = response.model_dump(mode="json")
    return response
