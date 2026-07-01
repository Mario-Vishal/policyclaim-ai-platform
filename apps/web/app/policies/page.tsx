import { AppShell } from "@/components/app-shell";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { policies } from "@/lib/data";

export default function PoliciesPage() {
  return (
    <AppShell title="Policy Search">
      <div className="mb-5 rounded-lg border border-border bg-card p-4">
        <input className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Search policy, state, coverage, exclusion, or effective date" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardTitle>{policy.id}</CardTitle>
            <CardText className="mt-2">{policy.holder} | {policy.state} | Effective {policy.effectiveDate}</CardText>
            <div className="mt-4 flex flex-wrap gap-2">
              {policy.coverage.map((coverage) => <span key={coverage} className="rounded-md border border-border px-2 py-1 text-xs">{coverage}</span>)}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
