import { Card } from "@/components/ui/card";

const kpis = [
  ["Claims in review", "37", "+12%"],
  ["AI citation accuracy", "88%", "+4 pts"],
  ["Human override rate", "7%", "-2 pts"],
  ["Payment exceptions", "5", "-3"]
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
