"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type LiveResponse = {
  answer?: string;
  mode?: string;
  traceId?: string;
  status?: string;
  taskId?: string;
  citations?: Array<{ document_id: string; section_title: string; score: number; snippet: string }>;
};

export function ClaimReviewActions({
  claimId,
  policyId,
  lossType
}: {
  claimId: string;
  policyId: string;
  lossType: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<LiveResponse | null>(null);

  async function askAi() {
    setLoading("AI review");
    const response = await fetch("/api/rag-ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `Review coverage, missing documents, risk, and payment status for ${claimId} ${lossType}.`,
        claimId,
        policyId
      })
    });
    setResult(await response.json());
    setLoading(null);
  }

  async function recordAction(action: "approve" | "reject" | "escalate") {
    setLoading(action);
    const response = await fetch("/api/claim-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimId, action })
    });
    setResult(await response.json());
    setLoading(null);
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button onClick={askAi} disabled={Boolean(loading)} className="border-primary text-primary">
          {loading === "AI review" ? "Running..." : "Run AI Review"}
        </Button>
        <Button onClick={() => recordAction("approve")} disabled={Boolean(loading)} className="bg-success text-white hover:text-white">Approve</Button>
        <Button onClick={() => recordAction("reject")} disabled={Boolean(loading)}>Reject</Button>
        <Button onClick={() => recordAction("escalate")} disabled={Boolean(loading)} className="border-warning text-warning">Escalate</Button>
      </div>

      {result && (
        <div className="rounded-md border border-border bg-background/70 p-4 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Live Python backend</span>
            {result.mode && <span>mode: {result.mode}</span>}
            {result.traceId && <span>trace: {result.traceId}</span>}
            {result.taskId && <span>task: {result.taskId}</span>}
          </div>
          <div className="mt-3 leading-6">{result.answer ?? result.status}</div>
          {result.citations?.length ? (
            <div className="mt-4 space-y-2">
              {result.citations.slice(0, 3).map((citation) => (
                <div key={`${citation.document_id}-${citation.section_title}`} className="rounded-md border border-border p-3">
                  <div className="font-medium">{citation.document_id} | {citation.section_title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">score {citation.score}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
