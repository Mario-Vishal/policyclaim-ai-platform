from __future__ import annotations

from .data_store import SYNTHETIC_CHUNKS


def search_policy(query: str, filters: dict[str, str] | None = None) -> dict:
    filters = filters or {}
    results = []
    for chunk in SYNTHETIC_CHUNKS:
        if filters.get("policy_id") and chunk.policy_id != filters["policy_id"]:
            continue
        if query.lower() in chunk.text.lower() or query.lower() in chunk.section_title.lower():
            results.append(chunk.model_dump(mode="json"))
    return {"tool": "search_policy", "results": results[:5]}


def check_claim_coverage(claim_id: str, policy_id: str) -> dict:
    chunks = [item for item in SYNTHETIC_CHUNKS if item.claim_id == claim_id or item.policy_id == policy_id]
    exclusion_hit = any("excluded" in item.text.lower() for item in chunks)
    return {
        "tool": "check_claim_coverage",
        "claim_id": claim_id,
        "policy_id": policy_id,
        "covered": not exclusion_hit or claim_id == "CLM-10482",
        "requires_review": exclusion_hit,
        "basis": [item.chunk_id for item in chunks[:4]],
    }


def detect_missing_documents(claim_id: str) -> dict:
    missing = {
        "CLM-10482": ["repair estimate supplement"],
        "CLM-10484": ["rental agreement", "police report"],
        "CLM-10486": ["cause of loss statement", "water line photos"],
        "CLM-10488": ["medical bill summary", "liability statement"],
    }.get(claim_id, [])
    return {"tool": "detect_missing_documents", "claim_id": claim_id, "missing_documents": missing}


def flag_underwriting_risk(claim_id: str) -> dict:
    risk = {
        "CLM-10484": "High",
        "CLM-10486": "High",
        "CLM-10482": "Medium",
        "CLM-10488": "Medium",
    }.get(claim_id, "Low")
    return {"tool": "flag_underwriting_risk", "claim_id": claim_id, "risk": risk}


def calculate_payment_status(claim_id: str) -> dict:
    status = {
        "CLM-10482": "Pending reconciliation",
        "CLM-10483": "Matched",
        "CLM-10484": "Exception",
        "CLM-10485": "Matched",
        "CLM-10486": "Exception",
        "CLM-10487": "Ready for disbursement",
        "CLM-10488": "Hold",
    }.get(claim_id, "Unknown")
    return {"tool": "calculate_payment_status", "claim_id": claim_id, "payment_status": status}


def create_reviewer_task(claim_id: str, reason: str) -> dict:
    return {"tool": "create_reviewer_task", "claim_id": claim_id, "reason": reason, "task_id": f"TASK-{claim_id[-4:]}", "status": "Open"}


def write_audit_event(entity_id: str, event_type: str, details: str) -> dict:
    return {"tool": "write_audit_event", "entity_id": entity_id, "event_type": event_type, "details": details, "status": "written"}
