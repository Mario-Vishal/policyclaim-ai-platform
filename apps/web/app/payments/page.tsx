import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { Card, CardTitle } from "@/components/ui/card";
import { claims } from "@/lib/data";

export default function PaymentsPage() {
  return (
    <AppShell title="Payment Reconciliation">
      <div className="grid gap-5 lg:grid-cols-3">
        {claims.map((claim) => (
          <Card key={claim.id}>
            <CardTitle>{claim.id}</CardTitle>
            <div className="mt-3 text-3xl font-semibold">${claim.amount.toLocaleString()}</div>
            <div className="mt-4"><StatusPill value={claim.paymentStatus === "Pending reconciliation" ? "Needs Review" : claim.paymentStatus} /></div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
