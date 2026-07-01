import Link from "next/link";
import { claims } from "@/lib/data";
import { StatusPill } from "@/components/status-pill";

export function ClaimsTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Claim</th>
            <th className="px-4 py-3">Policy</th>
            <th className="px-4 py-3">Loss</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium"><Link href={`/claims/${claim.id}`}>{claim.id}</Link></td>
              <td className="px-4 py-3 text-muted-foreground">{claim.policyId}</td>
              <td className="px-4 py-3">{claim.lossType}</td>
              <td className="px-4 py-3">${claim.amount.toLocaleString()}</td>
              <td className="px-4 py-3"><StatusPill value={claim.risk} /></td>
              <td className="px-4 py-3"><StatusPill value={claim.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
