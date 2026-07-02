from __future__ import annotations

import time
from http.server import BaseHTTPRequestHandler
from uuid import uuid4

from _shared import build_trace, call_openai, has_prompt_injection, read_json, redact_pii, retrieve, send_json, tool_outputs


class handler(BaseHTTPRequestHandler):
    def do_POST(self) -> None:
        started = time.perf_counter()
        payload = read_json(self)
        question, pii_findings = redact_pii(str(payload.get("question", ""))[:1200])
        claim_id = payload.get("claimId") or payload.get("claim_id")
        policy_id = payload.get("policyId") or payload.get("policy_id")

        if has_prompt_injection(question):
            send_json(
                self,
                {
                    "answer": "Blocked: this request attempted to override safety instructions.",
                    "mode": "blocked",
                    "traceId": f"trace-{uuid4().hex[:12]}",
                    "citations": [],
                    "trace": [{"name": "guardrail validation", "latency_ms": 1, "status": "blocked"}],
                    "guardrails": {"promptInjection": True, "piiFindings": pii_findings},
                },
            )
            return

        citations = retrieve(question, claim_id, policy_id)
        tools = tool_outputs(claim_id, policy_id)
        answer, mode = call_openai(question, citations, tools)
        send_json(
            self,
            {
                "answer": answer,
                "mode": mode,
                "traceId": f"trace-{uuid4().hex[:12]}",
                "citations": [{key: item[key] for key in ("document_id", "section_title", "score", "snippet")} for item in citations],
                "tools": tools,
                "trace": build_trace(started, citations, mode, pii_findings),
                "guardrails": {"promptInjection": False, "piiFindings": pii_findings, "citationValid": bool(citations)},
            },
        )
