import { AppShell } from "@/components/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { auditEvents } from "@/lib/data";

export default function AuditPage() {
  return (
    <AppShell title="Audit History">
      <Card>
        <CardTitle>Recent Events</CardTitle>
        <div className="mt-5 divide-y divide-border">
          {auditEvents.map((event) => (
            <div key={`${event.time}-${event.entity}`} className="grid gap-2 py-4 text-sm md:grid-cols-[80px_140px_1fr_180px]">
              <span className="text-muted-foreground">{event.time}</span>
              <span>{event.entity}</span>
              <span>{event.event}</span>
              <span className="text-muted-foreground">{event.actor}</span>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
