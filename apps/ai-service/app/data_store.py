from __future__ import annotations

from datetime import date
from .models import DocumentChunk


SYNTHETIC_CHUNKS: list[DocumentChunk] = [
    DocumentChunk(
        document_id="POL-AZ-7721",
        chunk_id="POL-AZ-7721-COLLISION",
        document_type="policy",
        policy_id="POL-AZ-7721",
        coverage_type="Collision",
        state="AZ",
        effective_date=date(2026, 1, 1),
        section_title="Collision Coverage",
        risk_category="medium",
        text="Collision losses are covered for listed vehicles when the policy is active, subject to a 750 deductible and listed exclusions.",
        relationships={"coverage": "Collision", "exclusion": "Commercial delivery use", "claim": "CLM-10482"},
    ),
    DocumentChunk(
        document_id="POL-AZ-7721",
        chunk_id="POL-AZ-7721-EXCLUSION",
        document_type="exclusion",
        policy_id="POL-AZ-7721",
        coverage_type="Collision",
        state="AZ",
        effective_date=date(2026, 1, 1),
        section_title="Commercial Delivery Exclusion",
        risk_category="high",
        text="Losses arising during undisclosed commercial delivery use are excluded unless the endorsement is present.",
        relationships={"policy": "POL-AZ-7721", "claim": "CLM-10482"},
    ),
    DocumentChunk(
        document_id="CLM-10482",
        chunk_id="CLM-10482-FORM",
        document_type="claim_form",
        policy_id="POL-AZ-7721",
        claim_id="CLM-10482",
        coverage_type="Collision",
        state="AZ",
        section_title="Claim Form Summary",
        risk_category="medium",
        text="Synthetic claim CLM-10482 reports a collision loss with repair estimate supplement still missing.",
        relationships={"policy": "POL-AZ-7721", "payment": "PAY-8841"},
    ),
    DocumentChunk(
        document_id="PAY-8841",
        chunk_id="PAY-8841-LEDGER",
        document_type="payment_record",
        policy_id="POL-AZ-7721",
        claim_id="CLM-10482",
        payment_status="Pending reconciliation",
        section_title="Payment Ledger",
        text="Payment PAY-8841 is pending reconciliation for CLM-10482 after deductible application.",
        relationships={"claim": "CLM-10482", "decision": "reviewer-validation"},
    ),
    DocumentChunk(
        document_id="RULE-AZ-UNDERWRITING",
        chunk_id="RULE-AZ-UNDERWRITING-01",
        document_type="underwriting_rule",
        state="AZ",
        section_title="Underwriting Risk Rule",
        risk_category="medium",
        text="Medium risk is assigned when a covered claim has missing repair supplements but no confirmed exclusion.",
        relationships={"claim": "CLM-10482"},
    ),
    DocumentChunk(
        document_id="POL-NV-4420",
        chunk_id="POL-NV-4420-RENTAL",
        document_type="exclusion",
        policy_id="POL-NV-4420",
        claim_id="CLM-10484",
        coverage_type="Rental reimbursement",
        state="NV",
        section_title="Rental Reimbursement Exclusion",
        risk_category="high",
        text="Rental reimbursement is excluded unless the policy includes the rental endorsement and a rental agreement is supplied.",
        payment_status="Exception",
        relationships={"policy": "POL-NV-4420", "claim": "CLM-10484", "payment": "PAY-8843"},
    ),
]


TRACE_STORE: dict[str, dict] = {}
LATEST_EVALS = {
    "retrieval_recall_at_5": 0.92,
    "citation_accuracy": 0.88,
    "answer_groundedness": 0.90,
    "tool_call_success_rate": 0.97,
    "pii_leak_rate": 0.0,
    "prompt_injection_block_rate": 0.96,
    "latency_p50": 612,
    "latency_p95": 1180,
    "human_override_rate": 0.07,
}
