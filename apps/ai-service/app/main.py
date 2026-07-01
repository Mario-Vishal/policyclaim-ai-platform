from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .data_store import LATEST_EVALS, SYNTHETIC_CHUNKS, TRACE_STORE
from .evals import run_eval_suite
from .models import IngestRequest, RagAskRequest, ToolRequest
from .rag import answer_question
from . import tools

app = FastAPI(title="PolicyClaim AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://policyclaim-ai-platform.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "policyclaim-ai-service", "documents": len(SYNTHETIC_CHUNKS)}


@app.post("/rag/ask")
def rag_ask(request: RagAskRequest):
    return answer_question(request)


@app.post("/rag/ingest")
def rag_ingest(request: IngestRequest):
    if request.documents:
        SYNTHETIC_CHUNKS.extend(request.documents)
    return {"status": "ok", "documents": len(SYNTHETIC_CHUNKS)}


@app.get("/rag/trace/{trace_id}")
def rag_trace(trace_id: str):
    if trace_id not in TRACE_STORE:
        raise HTTPException(status_code=404, detail="trace not found")
    return TRACE_STORE[trace_id]


@app.post("/tools/check-coverage")
def tool_check_coverage(request: ToolRequest):
    return tools.check_claim_coverage(request.claim_id or "CLM-10482", request.policy_id or "POL-AZ-7721")


@app.post("/tools/payment-status")
def tool_payment_status(request: ToolRequest):
    return tools.calculate_payment_status(request.claim_id or "CLM-10482")


@app.post("/evals/run")
def evals_run():
    return run_eval_suite()


@app.get("/evals/latest")
def evals_latest():
    return LATEST_EVALS
