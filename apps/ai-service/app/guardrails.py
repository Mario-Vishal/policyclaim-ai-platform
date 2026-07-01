from __future__ import annotations

import re

PII_PATTERNS = [
    re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    re.compile(r"\b\d{16}\b"),
    re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"),
]

INJECTION_MARKERS = [
    "ignore previous instructions",
    "reveal the system prompt",
    "exfiltrate",
    "bypass guardrails",
    "print secrets",
]


def detect_prompt_injection(text: str) -> bool:
    lowered = text.lower()
    return any(marker in lowered for marker in INJECTION_MARKERS)


def redact_pii(text: str) -> tuple[str, list[str]]:
    findings: list[str] = []
    redacted = text
    for pattern in PII_PATTERNS:
        if pattern.search(redacted):
            findings.append(pattern.pattern)
            redacted = pattern.sub("[REDACTED]", redacted)
    return redacted, findings


def validate_citations(answer: str, citation_count: int) -> bool:
    return citation_count > 0 and ("POL-" in answer or "claim" in answer.lower() or "coverage" in answer.lower())
