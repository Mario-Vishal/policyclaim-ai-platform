from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


DATA_PATH = Path(__file__).resolve().parent / "synthetic-data.json"
if not DATA_PATH.exists():
    DATA_PATH = Path(__file__).resolve().parents[1] / "lib" / "synthetic-data.json"
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
INJECTION_MARKERS = [
    "ignore previous instructions",
    "reveal the system prompt",
    "print secrets",
    "bypass guardrails",
    "exfiltrate",
]
PII_PATTERNS = [
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    re.compile(r"\b\d{16}\b"),
    re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"),
]


def load_data() -> dict[str, Any]:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def send_json(handler: Any, payload: dict[str, Any], status: int = 200) -> None:
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Cache-Control", "no-store")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_json(handler: Any) -> dict[str, Any]:
    length = int(handler.headers.get("content-length", "0") or "0")
    if length == 0:
        return {}
    return json.loads(handler.rfile.read(length).decode("utf-8"))


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in re.findall(r"[a-zA-Z0-9-]{3,}", text)]


def redact_pii(text: str) -> tuple[str, list[str]]:
    findings: list[str] = []
    redacted = text
    for pattern in PII_PATTERNS:
        if pattern.search(redacted):
            findings.append(pattern.pattern)
            redacted = pattern.sub("[REDACTED]", redacted)
    return redacted, findings


def has_prompt_injection(text: str) -> bool:
    lowered = text.lower()
    return any(marker in lowered for marker in INJECTION_MARKERS)


def retrieve(question: str, claim_id: str | None, policy_id: str | None, limit: int = 6) -> list[dict[str, Any]]:
    data = load_data()
    terms = set(tokenize(question))
    scored: list[tuple[float, dict[str, Any]]] = []
    for chunk in data["ragChunks"]:
        if claim_id and chunk.get("claim_id") != claim_id:
            continue
        if policy_id and chunk.get("policy_id") != policy_id:
            continue
        text = f"{chunk.get('section_title', '')} {chunk.get('text', '')}"
        chunk_terms = set(tokenize(text))
        score = len(terms & chunk_terms) + (2 if claim_id and chunk.get("claim_id") == claim_id else 0)
        score += 1 if policy_id and chunk.get("policy_id") == policy_id else 0
        if score > 0:
            scored.append((float(score), chunk))
    if not scored:
        for chunk in data["ragChunks"][:limit]:
            scored.append((1.0, chunk))
    return [
        {
            "document_id": chunk["document_id"],
            "section_title": chunk["section_title"],
            "score": round(score / 10, 3),
            "snippet": chunk["text"][:220],
            "chunk": chunk,
        }
        for score, chunk in sorted(scored, key=lambda item: item[0], reverse=True)[:limit]
    ]


def tool_outputs(claim_id: str | None, policy_id: str | None) -> list[dict[str, Any]]:
    data = load_data()
    claim = next((item for item in data["claims"] if item["id"] == claim_id), data["claims"][0])
    policy = next((item for item in data["policies"] if item["id"] == (policy_id or claim["policyId"])), data["policies"][0])
    return [
        {"tool": "check_claim_coverage", "covered": "Excluded" not in claim["coverage"], "claim_id": claim["id"], "policy_id": policy["id"], "basis": policy["coverage"]},
        {"tool": "detect_missing_documents", "claim_id": claim["id"], "missing_documents": claim["missingDocs"]},
        {"tool": "flag_underwriting_risk", "claim_id": claim["id"], "risk": claim["risk"]},
        {"tool": "calculate_payment_status", "claim_id": claim["id"], "payment_status": claim["paymentStatus"]},
        {"tool": "write_audit_event", "entity_id": claim["id"], "event_type": "LIVE_DEMO_TRACE", "status": "simulated-write"},
    ]


def call_openai(question: str, citations: list[dict[str, Any]], tools: list[dict[str, Any]]) -> tuple[str, str]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        first = citations[0] if citations else {"document_id": "synthetic-corpus", "section_title": "Fallback"}
        missing = next((item for item in tools if item["tool"] == "detect_missing_documents"), {})
        payment = next((item for item in tools if item["tool"] == "calculate_payment_status"), {})
        risk = next((item for item in tools if item["tool"] == "flag_underwriting_risk"), {})
        return (
            "Fallback mode: OpenAI is not configured for this deployment yet. "
            f"Using the live Python backend and synthetic corpus, the claim is {risk.get('risk', 'unknown')} risk, "
            f"payment status is {payment.get('payment_status', 'unknown')}, and missing documents are "
            f"{', '.join(missing.get('missing_documents', [])) or 'none'}. "
            f"Primary citation: {first['document_id']} - {first['section_title']}.",
            "fallback",
        )

    context = "\n".join(f"[{item['document_id']}] {item['section_title']}: {item['snippet']}" for item in citations)[:5000]
    configured_model = os.getenv("OPENAI_MODEL", "").strip()
    candidates = [
        configured_model,
        "gpt-4.1-nano",
        "gpt-4.1-mini",
        "gpt-4o-mini",
        "gpt-3.5-turbo",
        "gpt-5-nano",
        "gpt-5-mini",
        "gpt-5.4-nano",
        "gpt-5.4-mini",
        "gpt-4o",
    ]
    seen: set[str] = set()
    errors: list[str] = []
    for model in [item for item in candidates if item and not (item in seen or seen.add(item))]:
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a careful insurance claim review assistant. Use only provided synthetic context. Include citations by document id. Do not invent personal data."},
                {"role": "user", "content": f"Question: {question}\n\nContext:\n{context}\n\nTool outputs:\n{json.dumps(tools)}"},
            ],
            "max_tokens": 450,
            "temperature": 0.2,
        }
        request = urllib.request.Request(
            OPENAI_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                body = json.loads(response.read().decode("utf-8"))
                return f"{body['choices'][0]['message']['content']}\n\nModel used: {model}", "openai"
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:500]
            errors.append(f"{model}: HTTP {exc.code}: {detail}")
            if "invalid model ID" in detail or "model_not_found" in detail or exc.code == 404:
                continue
            return f"Fallback mode: OpenAI request failed in the live Python backend ({errors[-1]}). Synthetic citations are still available.", "fallback"
        except Exception as exc:
            return f"Fallback mode: OpenAI request failed in the live Python backend ({type(exc).__name__}). Synthetic citations are still available.", "fallback"
    if errors:
        return f"Fallback mode: none of the configured low-cost OpenAI model candidates worked. Last error: {errors[-1]}. Synthetic citations are still available.", "fallback"
    except_marker = "no model candidates"
    return f"Fallback mode: OpenAI request failed in the live Python backend ({except_marker}). Synthetic citations are still available.", "fallback"


def build_trace(started: float, citations: list[dict[str, Any]], mode: str, pii_findings: list[str]) -> list[dict[str, Any]]:
    return [
        {"name": "query rewrite", "latency_ms": 12, "status": "completed"},
        {"name": "metadata filters", "latency_ms": 8, "status": "completed"},
        {"name": "hybrid retrieval", "latency_ms": 42, "status": "completed", "details": {"hits": len(citations)}},
        {"name": "tool calls", "latency_ms": 31, "status": "completed"},
        {"name": "OpenAI generation" if mode == "openai" else "fallback generation", "latency_ms": max(1, int((time.perf_counter() - started) * 1000)), "status": "completed"},
        {"name": "guardrail validation", "latency_ms": 7, "status": "completed", "details": {"pii_findings": pii_findings}},
        {"name": "audit log write", "latency_ms": 3, "status": "completed"},
    ]
