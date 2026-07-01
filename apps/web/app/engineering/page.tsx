import { AppShell } from "@/components/app-shell";
import { EngineeringVisuals } from "@/components/engineering-visuals";

export default function EngineeringPage() {
  return (
    <AppShell title="Engineering Mode">
      <EngineeringVisuals />
    </AppShell>
  );
}
