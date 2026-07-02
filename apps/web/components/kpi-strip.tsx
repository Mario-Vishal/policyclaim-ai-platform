import { Card } from "@/components/ui/card";
import { claims } from "@/lib/data";

const kpis = [
  ["Synthetic claims", claims.length.toString(), "live corpus"],
  ["In review", claims.filter((claim) => claim.status === "Needs Review").length.toString(), "triage"],
  ["Escalated", claims.filter((claim) => claim.status === "Escalated").length.toString(), "reviewer queue"],
  ["Payment exceptions", claims.filter((claim) => claim.paymentStatus === "Exception").length.toString(), "exceptions"]
];

export function KpiStrip() {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {kpis.map(([label, value, delta]) => (
        <Card key={label} className="p-4">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-2 flex items-end justify-between">
            <div className="text-3xl font-semibold">{value}</div>
            <div className="text-xs text-success">{delta}</div>
          </div>
        </Card>
      ))}
    </section>
  );
}
