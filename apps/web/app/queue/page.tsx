import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { Card, CardText, CardTitle } from "@/components/ui/card";
import { claims } from "@/lib/data";

export default function QueuePage() {
  return (
    <AppShell title="Reviewer Queue">
      <div className="space-y-4">
        {claims.map((claim, index) => (
          <Card key={claim.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>{claim.id} | {claim.lossType}</CardTitle>
              <CardText className="mt-1">Queue priority {index + 1}. Missing docs: {claim.missingDocs.length || "none"}.</CardText>
            </div>
            <StatusPill value={claim.status} />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
