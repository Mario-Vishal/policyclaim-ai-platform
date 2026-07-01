from __future__ import annotations

from datetime import date
from typing import Any
from pydantic import BaseModel, Field


class RagAskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1200)
    claim_id: str | None = None
    policy_id: str | None = None
    filters: dict[str, str] | None = None


class Citation(BaseModel):
    document_id: str
    section_title: str
    score: float
    snippet: str


class TraceStep(BaseModel):
    name: str
    latency_ms: int
    status: str
    details: dict[str, Any] = Field(default_factory=dict)


class RagAskResponse(BaseModel):
    answer: str
    citations: list[Citation]
    trace_id: str
    trace: list[TraceStep]
    mode: str
    guardrails: dict[str, Any]


class DocumentChunk(BaseModel):
    document_id: str
    chunk_id: str
    text: str
    section_title: str
    policy_id: str | None = None
    claim_id: str | None = None
    document_type: str
    coverage_type: str | None = None
    state: str | None = None
    effective_date: date | None = None
    risk_category: str | None = None
    payment_status: str | None = None
    relationships: dict[str, str] = Field(default_factory=dict)


class IngestRequest(BaseModel):
    documents: list[DocumentChunk] | None = None


class ToolRequest(BaseModel):
    claim_id: str | None = None
    policy_id: str | None = None
    query: str | None = None
    filters: dict[str, str] | None = None


class EvalResult(BaseModel):
    retrieval_recall_at_5: float
    citation_accuracy: float
    answer_groundedness: float
    tool_call_success_rate: float
    pii_leak_rate: float
    prompt_injection_block_rate: float
    latency_p50: int
    latency_p95: int
    human_override_rate: float
