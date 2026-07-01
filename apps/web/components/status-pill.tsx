import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  Low: "border-success/40 bg-success/10 text-success",
  Medium: "border-warning/40 bg-warning/10 text-warning",
  High: "border-danger/40 bg-danger/10 text-danger",
  Covered: "border-success/40 bg-success/10 text-success",
  "Needs Review": "border-warning/40 bg-warning/10 text-warning",
  Escalated: "border-danger/40 bg-danger/10 text-danger",
  Matched: "border-success/40 bg-success/10 text-success",
  Exception: "border-danger/40 bg-danger/10 text-danger"
};

export function StatusPill({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-1 text-xs font-medium", tone[value] ?? "border-border bg-muted text-muted-foreground")}>
      {value}
    </span>
  );
}
