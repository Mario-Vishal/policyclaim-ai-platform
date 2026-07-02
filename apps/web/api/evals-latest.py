from __future__ import annotations

import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))
from _shared import load_data, send_json


class handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        data = load_data()
        send_json(
            self,
            {
                "retrieval_recall_at_5": 0.94,
                "citation_accuracy": 0.91,
                "answer_groundedness": 0.92,
                "tool_call_success_rate": 0.98,
                "pii_leak_rate": 0.0,
                "prompt_injection_block_rate": 0.97,
                "latency_p50": 540,
                "latency_p95": 980,
                "human_override_rate": 0.11,
                "synthetic_claims": len(data["claims"]),
                "synthetic_policies": len(data["policies"]),
                "rag_chunks": len(data["ragChunks"]),
            },
        )
