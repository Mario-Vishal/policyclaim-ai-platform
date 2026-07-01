import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { claims } from "@/lib/data";

export default function UnderwritingPage() {
  return (
    <AppShell title="Underwriting Review Panel">
      <div className="grid gap-5 lg:grid-cols-3">
        {claims.map((claim) => (
          <Card key={claim.id}>
            <div className="flex items-start justify-between">
              <CardTitle>{claim.id}</CardTitle>
              <StatusPill value={claim.risk} />
            </div>
            <CardText className="mt-3">{claim.lossType} claim checked against state rules, missing document rules, and synthetic risk indicators.</CardText>
            <div className="mt-4 rounded-md border border-border p-3 text-sm">Recommendation: {claim.risk === "High" ? "Escalate for senior review" : "Proceed with reviewer validation"}</div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
