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
  },
  {
    id: "CLM-10485",
    policyId: "POL-TX-9033",
    claimant: "Synthetic Driver D",
    lossType: "Weather hail",
    state: "TX",
    amount: 14250,
    status: "Ready to Approve",
    risk: "Low",
    coverage: "Covered",
    missingDocs: [],
    paymentStatus: "Matched",
    openedAt: "2026-06-27"
  },
  {
    id: "CLM-10486",
    policyId: "POL-FL-2290",
    claimant: "Synthetic Driver E",
    lossType: "Flood water intrusion",
    state: "FL",
    amount: 26600,
    status: "Escalated",
    risk: "High",
    coverage: "Excluded flood peril",
    missingDocs: ["cause of loss statement", "water line photos"],
    paymentStatus: "Exception",
    openedAt: "2026-06-28"
  },
  {
    id: "CLM-10487",
    policyId: "POL-WA-6152",
    claimant: "Synthetic Driver F",
    lossType: "Glass repair",
    state: "WA",
    amount: 840,
    status: "Ready to Approve",
    risk: "Low",
    coverage: "Covered with waiver",
    missingDocs: [],
    paymentStatus: "Ready for disbursement",
    openedAt: "2026-06-28"
  },
  {
    id: "CLM-10488",
    policyId: "POL-IL-3817",
    claimant: "Synthetic Driver G",
    lossType: "Bodily injury liability",
    state: "IL",
    amount: 48500,
    status: "Needs Review",
    risk: "Medium",
    coverage: "Coverage pending liability review",
    missingDocs: ["medical bill summary", "liability statement"],
    paymentStatus: "Hold",
    openedAt: "2026-06-29"
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
  },
  {
    id: "POL-TX-9033",
    holder: "Synthetic Household 44",
    state: "TX",
    effectiveDate: "2026-02-10",
    coverage: ["Comprehensive", "Weather hail", "Roadside assistance"],
    exclusions: ["Pre-existing cosmetic damage"],
    deductible: 500
  },
  {
    id: "POL-FL-2290",
    holder: "Synthetic Household 58",
    state: "FL",
    effectiveDate: "2026-04-20",
    coverage: ["Collision", "Comprehensive", "Liability"],
    exclusions: ["Flood water intrusion", "Named storm waiting period"],
    deductible: 1250
  },
  {
    id: "POL-WA-6152",
    holder: "Synthetic Household 63",
    state: "WA",
    effectiveDate: "2025-12-01",
    coverage: ["Glass repair", "Comprehensive", "Rental reimbursement"],
    exclusions: ["Aftermarket racing parts"],
    deductible: 250
  },
  {
    id: "POL-IL-3817",
    holder: "Synthetic Household 70",
    state: "IL",
    effectiveDate: "2026-05-05",
    coverage: ["Liability", "Medical payments", "Uninsured motorist"],
    exclusions: ["Intentional acts", "Business livery use"],
    deductible: 1000
  }
];

export const auditEvents = [
  { time: "09:12", entity: "CLM-10482", event: "RAG trace saved", actor: "AI review agent" },
  { time: "09:14", entity: "CLM-10482", event: "Coverage check completed", actor: "Coverage service" },
  { time: "09:20", entity: "CLM-10484", event: "Escalation task created", actor: "Reviewer queue" },
  { time: "09:28", entity: "POL-CA-1184", event: "Citation validated", actor: "Guardrail worker" },
  { time: "09:35", entity: "CLM-10485", event: "Payment matched", actor: "Payment reconciliation" },
  { time: "09:42", entity: "CLM-10486", event: "Flood exclusion flagged", actor: "Underwriting rules engine" },
  { time: "09:49", entity: "CLM-10487", event: "Glass waiver applied", actor: "Coverage service" },
  { time: "10:03", entity: "CLM-10488", event: "Medical review task opened", actor: "Reviewer queue" },
  { time: "10:17", entity: "CLM-10486", event: "PII scan completed", actor: "Guardrail worker" }
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
