import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ClaimReviewActions } from "@/components/claim-review-actions";
import { StatusPill } from "@/components/status-pill";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { auditEvents, claims, policies } from "@/lib/data";

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = claims.find((item) => item.id === id);
  if (!claim) notFound();
  const policy = policies.find((item) => item.id === claim.policyId);

  return (
    <AppShell title={`Claim Detail ${claim.id}`}>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{claim.lossType} claim</CardTitle>
              <CardText className="mt-2">{claim.claimant} in {claim.state}. Opened {claim.openedAt}.</CardText>
            </div>
            <StatusPill value={claim.status} />
          </div>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div><dt className="text-xs text-muted-foreground">Amount</dt><dd className="text-2xl font-semibold">${claim.amount.toLocaleString()}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Coverage</dt><dd>{claim.coverage}</dd></div>
            <div><dt className="text-xs text-muted-foreground">Risk</dt><dd><StatusPill value={claim.risk} /></dd></div>
            <div><dt className="text-xs text-muted-foreground">Payment</dt><dd>{claim.paymentStatus}</dd></div>
          </dl>
          <ClaimReviewActions claimId={claim.id} policyId={claim.policyId} lossType={claim.lossType} />
        </Card>
        <Card>
          <CardTitle>Policy Coverage</CardTitle>
          <CardText className="mt-2">{policy?.id} has deductible ${policy?.deductible.toLocaleString()} and active coverage in {policy?.state}.</CardText>
          <div className="mt-5 space-y-3">
            {policy?.coverage.map((item) => <div key={item} className="rounded-md border border-border p-3 text-sm">{item}</div>)}
          </div>
        </Card>
        <Card>
          <CardTitle>Missing Documents</CardTitle>
          <div className="mt-4 space-y-2">
            {claim.missingDocs.length ? claim.missingDocs.map((doc) => <div key={doc} className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">{doc}</div>) : <CardText>No missing documents detected.</CardText>}
          </div>
        </Card>
        <Card>
          <CardTitle>Audit Trail</CardTitle>
          <div className="mt-4 space-y-3">
            {auditEvents.filter((event) => event.entity === claim.id).map((event) => (
              <div key={`${event.time}-${event.event}`} className="rounded-md border border-border p-3 text-sm">
                <div className="font-medium">{event.event}</div>
                <div className="text-xs text-muted-foreground">{event.time} by {event.actor}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
