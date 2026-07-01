import Link from "next/link";
import { BarChart3, ClipboardCheck, FileSearch, GitBranch, History, LayoutDashboard, WalletCards } from "lucide-react";

const nav = [
  { href: "/claims", label: "Claims", icon: LayoutDashboard },
  { href: "/policies", label: "Policies", icon: FileSearch },
  { href: "/underwriting", label: "Underwriting", icon: ClipboardCheck },
  { href: "/payments", label: "Payments", icon: WalletCards },
  { href: "/audit", label: "Audit", icon: History },
  { href: "/engineering", label: "Engineering", icon: GitBranch },
  { href: "/queue", label: "Queue", icon: BarChart3 }
];

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-border bg-card/80 p-5 backdrop-blur lg:block">
        <Link href="/" className="block">
          <div className="text-xs uppercase text-muted-foreground">PolicyClaim</div>
          <div className="mt-1 text-lg font-semibold">AI Platform</div>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground">Demo data only</div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </main>
    </div>
  );
}
