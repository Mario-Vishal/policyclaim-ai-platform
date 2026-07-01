export type ClaimStatus = "Needs Review" | "Ready to Approve" | "Escalated";

export interface ClaimSummary {
  id: string;
  policyId: string;
  lossType: string;
  state: string;
  amount: number;
  status: ClaimStatus;
  risk: "Low" | "Medium" | "High";
}

export interface RagCitation {
  documentId: string;
  sectionTitle: string;
  score: number;
  snippet: string;
}

export interface RagTraceStep {
  name: string;
  latencyMs: number;
  status: string;
  details?: Record<string, unknown>;
}
