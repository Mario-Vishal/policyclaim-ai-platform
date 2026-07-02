from __future__ import annotations

from http.server import BaseHTTPRequestHandler
from uuid import uuid4

from _shared import load_data, read_json, send_json


class handler(BaseHTTPRequestHandler):
    def do_POST(self) -> None:
        payload = read_json(self)
        claim_id = payload.get("claimId")
        action = str(payload.get("action", "review")).lower()
        data = load_data()
        claim = next((item for item in data["claims"] if item["id"] == claim_id), None)
        if not claim:
            send_json(self, {"error": "claim not found"}, 404)
            return

        status_by_action = {
            "approve": "Approved in live demo",
            "reject": "Rejected in live demo",
            "escalate": "Escalated to reviewer queue",
        }
        send_json(
            self,
            {
                "taskId": f"TASK-{uuid4().hex[:8].upper()}",
                "claimId": claim_id,
                "action": action,
                "status": status_by_action.get(action, "Recorded"),
                "auditEvent": {
                    "entity": claim_id,
                    "event": f"{action.upper()}_RECORDED",
                    "actor": "Vercel Python backend",
                },
            },
        )
