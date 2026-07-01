import { AppShell } from "@/components/app-shell";
import { ClaimsTable } from "@/components/claims-table";
import { KpiStrip } from "@/components/kpi-strip";
import { Card, CardText, CardTitle } from "@/components/ui/card";

export default function ClaimsPage() {
  return (
    <AppShell title="Claims Dashboard">
      <div className="space-y-5">
        <KpiStrip />
        <ClaimsTable />
        <Card>
          <CardTitle>Create Synthetic Claim</CardTitle>
          <CardText className="mt-2">Local demo claim creation is represented by the .NET API `POST /api/claims` endpoint and the synthetic seed scripts.</CardText>
        </Card>
      </div>
    </AppShell>
  );
}
