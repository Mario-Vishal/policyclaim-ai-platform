import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { claims, policies, ragChunks } from "@/lib/data";

const steps = [
  ["Start with Claims", "Open the claims dashboard, pick a claim, and run the live AI review from the detail page."],
  ["Compare Policies", "Use Policy Search to inspect coverage, exclusions, deductibles, and state-specific scenarios."],
  ["Review Decisions", "Approve, reject, or escalate a claim. The action is recorded by the lightweight Python backend."],
  ["Inspect Engineering Mode", "Open the RAG pipeline, retrieval chunks, guardrails, eval metrics, and latency views."]
];

export default function GuidePage() {
  return (
    <AppShell title="Demo Guide">
      <div className="space-y-5">
        <Card>
          <CardTitle>How to Review This Demo</CardTitle>
          <CardText className="mt-3">
            The public app uses a Vercel-hosted Python backend with a large synthetic insurance corpus. The AI review route calls OpenAI when `OPENAI_API_KEY` is configured and clearly labels fallback mode when it is not.
          </CardText>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-border p-3 text-sm"><span className="font-semibold">{claims.length}</span> synthetic claims</div>
            <div className="rounded-md border border-border p-3 text-sm"><span className="font-semibold">{policies.length}</span> synthetic policies</div>
            <div className="rounded-md border border-border p-3 text-sm"><span className="font-semibold">{ragChunks.length}</span> RAG chunks</div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/claims" className="bg-primary text-white hover:text-white">Open Claims</Button>
            <Button href="/engineering">Engineering Mode</Button>
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          {steps.map(([title, body], index) => (
            <Card key={title}>
              <div className="mb-3 inline-flex rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">Step {index + 1}</div>
              <CardTitle>{title}</CardTitle>
              <CardText className="mt-3">{body}</CardText>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
