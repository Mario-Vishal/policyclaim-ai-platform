export const claims = [
  {
    id: "CLM-10482",
    policyId: "POL-AZ-7721",
    claimant: "Synthetic Driver A",
    lossType: "Collision",
    state: "AZ",
    amount: 18420,
    status: "Needs Review",
    risk: "Medium",
    coverage: "Covered with deductible",
    missingDocs: ["repair estimate supplement"],
    paymentStatus: "Pending reconciliation",
    openedAt: "2026-06-24"
  },
  {
    id: "CLM-10483",
    policyId: "POL-CA-1184",
    claimant: "Synthetic Driver B",
    lossType: "Comprehensive",
    state: "CA",
    amount: 9200,
    status: "Ready to Approve",
    risk: "Low",
    coverage: "Covered",
    missingDocs: [],
    paymentStatus: "Matched",
    openedAt: "2026-06-25"
  },
  {
    id: "CLM-10484",
    policyId: "POL-NV-4420",
    claimant: "Synthetic Driver C",
    lossType: "Rental reimbursement",
    state: "NV",
    amount: 3100,
    status: "Escalated",
    risk: "High",
    coverage: "Potential exclusion",
    missingDocs: ["rental agreement", "police report"],
    paymentStatus: "Exception",
    openedAt: "2026-06-26"
  }
];

export const policies = [
  {
    id: "POL-AZ-7721",
    holder: "Synthetic Household 17",
    state: "AZ",
    effectiveDate: "2026-01-01",
    coverage: ["Collision", "Comprehensive", "Rental reimbursement"],
    exclusions: ["Commercial delivery use", "Intentional damage"],
    deductible: 750
  },
  {
    id: "POL-CA-1184",
    holder: "Synthetic Household 22",
    state: "CA",
    effectiveDate: "2025-11-15",
    coverage: ["Collision", "Comprehensive", "Medical payments"],
    exclusions: ["Unlisted rideshare period"],
    deductible: 500
  },
  {
    id: "POL-NV-4420",
    holder: "Synthetic Household 31",
    state: "NV",
    effectiveDate: "2026-03-01",
    coverage: ["Liability", "Collision"],
    exclusions: ["Rental reimbursement without endorsement"],
    deductible: 1000
  }
];

export const auditEvents = [
  { time: "09:12", entity: "CLM-10482", event: "RAG trace saved", actor: "AI review agent" },
  { time: "09:14", entity: "CLM-10482", event: "Coverage check completed", actor: "Coverage service" },
  { time: "09:20", entity: "CLM-10484", event: "Escalation task created", actor: "Reviewer queue" },
  { time: "09:28", entity: "POL-CA-1184", event: "Citation validated", actor: "Guardrail worker" }
];

export const evalMetrics = [
  { metric: "Recall@5", value: 0.92 },
  { metric: "Citations", value: 0.88 },
  { metric: "Grounded", value: 0.9 },
  { metric: "PII Safe", value: 1 },
  { metric: "Injection Block", value: 0.96 }
];

export const latency = [
  { step: "rewrite", ms: 28 },
  { step: "keyword", ms: 45 },
  { step: "vector", ms: 72 },
  { step: "rerank", ms: 54 },
  { step: "tools", ms: 93 },
  { step: "answer", ms: 420 }
];

export const ragSteps = [
  "query rewrite",
  "metadata filters",
  "keyword search",
  "vector search",
  "hybrid merge",
  "reranking",
  "context packing",
  "tool calls",
  "guardrail validation",
  "final answer with citations",
  "audit log write",
  "eval trace saved"
];
