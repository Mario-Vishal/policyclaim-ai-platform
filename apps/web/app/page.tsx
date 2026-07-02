import { ArrowRight, BrainCircuit, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardText, CardTitle } from "@/components/ui/card";

const capabilities = [
  ["Claims workflow", "Coverage, underwriting, payments, queue, and audit workflows backed by synthetic insurance data."],
  ["RAG and agents", "Hybrid retrieval, reranking, OpenAI generation, tool calls, guardrails, citations, and traces."],
  ["Production posture", "Docker, Azure DevOps, Container Apps, AKS-ready manifests, evals, and observability hooks."]
];

export default function LandingPage() {
  return (
    <main>
      <section className="relative min-h-[92vh] overflow-hidden px-5 py-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <div className="text-xs uppercase text-muted-foreground">PolicyClaim AI Platform</div>
            <div className="font-semibold">Claims, Underwriting & Payment Review</div>
          </div>
          <div className="flex gap-3">
            <Button href="/guide">Guide</Button>
            <Button href="/claims">Live demo</Button>
            <Button href="/engineering" className="border-primary text-primary">Engineering mode</Button>
          </div>
        </nav>
        <div className="mx-auto grid max-w-7xl items-center gap-10 py-20 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-5 inline-flex rounded-md border border-border bg-card px-3 py-1 text-xs text-muted-foreground">Recruiter-safe enterprise AI demo</div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">PolicyClaim AI Platform</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A production-style insurance review system with a polished business workflow and a transparent Engineering Mode for RAG, agent tools, guardrails, evals, and deployment readiness.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/guide">Start with the Guide</Button>
              <Button href="/claims" className="bg-primary text-white hover:text-white">Open Business Mode <ArrowRight size={16} /></Button>
              <Button href="/engineering">Inspect AI pipeline</Button>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card/80 p-5 shadow-soft backdrop-blur">
            <div className="grid gap-4">
              {[
                ["CLM-10482", "Collision coverage validated", "Needs reviewer approval"],
                ["POL-AZ-7721", "Hybrid retrieval found 3 cited clauses", "Reranked confidence 0.91"],
                ["PAY-8841", "Payment ledger pending reconciliation", "Audit write queued"]
              ].map(([id, title, body]) => (
                <div key={id} className="rounded-md border border-border bg-background/60 p-4">
                  <div className="text-xs text-muted-foreground">{id}</div>
                  <div className="mt-1 font-semibold">{title}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background px-5 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Demo guide</div>
            <h2 className="mt-2 text-2xl font-semibold">Recommended review path</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {["Open Guide", "Select Claim", "Run AI Review", "Inspect Engineering Mode"].map((item, index) => (
              <div key={item} className="rounded-md border border-border bg-card p-3 text-sm">
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                <div className="mt-1 font-medium">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/45 px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {capabilities.map(([title, body], index) => (
            <Card key={title}>
              {index === 0 && <Workflow className="mb-4 text-primary" />}
              {index === 1 && <BrainCircuit className="mb-4 text-accent" />}
              {index === 2 && <ShieldCheck className="mb-4 text-success" />}
              <CardTitle>{title}</CardTitle>
              <CardText className="mt-3">{body}</CardText>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <Card>
            <CardTitle>Business Workflow Preview</CardTitle>
            <CardText className="mt-3">Create or select synthetic claims, search policy coverage, inspect underwriting risk, reconcile payments, and approve, reject, or escalate with an audit trail.</CardText>
          </Card>
          <Card>
            <CardTitle>Engineering Mode Preview</CardTitle>
            <CardText className="mt-3">Watch query rewrite, metadata filters, hybrid retrieval, reranking, context packing, tool calls, guardrails, citations, audit writes, and eval trace capture.</CardText>
          </Card>
          <Card>
            <CardTitle>Architecture Preview</CardTitle>
            <CardText className="mt-3">Next.js on Vercel, .NET API and FastAPI services on Azure Container Apps, PostgreSQL with pgvector, Redis rate limiting, and Azure DevOps pipelines.</CardText>
          </Card>
          <Card>
            <CardTitle>Eval and Observability Preview</CardTitle>
            <CardText className="mt-3">Local eval harness reports retrieval recall, citation accuracy, groundedness, safety, prompt-injection blocks, latency, and human override rate.</CardText>
          </Card>
        </div>
      </section>
    </main>
  );
}
