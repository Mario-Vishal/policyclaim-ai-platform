import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const states = ["AZ", "CA", "NV", "TX", "FL", "WA", "IL", "GA", "CO", "NC", "OH", "PA"];
const lossTypes = [
  ["Collision", "Covered with deductible", "repair estimate supplement", "Medium", "Pending reconciliation"],
  ["Comprehensive theft", "Covered pending police report", "police report", "Medium", "Hold"],
  ["Weather hail", "Covered", "", "Low", "Matched"],
  ["Glass repair", "Covered with waiver", "", "Low", "Ready for disbursement"],
  ["Rental reimbursement", "Potential exclusion", "rental agreement", "High", "Exception"],
  ["Flood water intrusion", "Excluded flood peril", "cause of loss statement", "High", "Exception"],
  ["Bodily injury liability", "Coverage pending liability review", "medical bill summary", "Medium", "Hold"],
  ["Roadside assistance", "Covered", "", "Low", "Matched"]
];
const coverageByLoss = {
  Collision: ["Collision", "Comprehensive", "Rental reimbursement"],
  "Comprehensive theft": ["Comprehensive", "Theft", "Rental reimbursement"],
  "Weather hail": ["Comprehensive", "Weather hail", "Roadside assistance"],
  "Glass repair": ["Glass repair", "Comprehensive", "Rental reimbursement"],
  "Rental reimbursement": ["Liability", "Collision", "Rental reimbursement"],
  "Flood water intrusion": ["Collision", "Comprehensive", "Liability"],
  "Bodily injury liability": ["Liability", "Medical payments", "Uninsured motorist"],
  "Roadside assistance": ["Roadside assistance", "Comprehensive", "Towing"]
};
const exclusionsByLoss = {
  Collision: ["Commercial delivery use", "Intentional damage"],
  "Comprehensive theft": ["Unlocked vehicle without forced entry", "Unreported theft"],
  "Weather hail": ["Pre-existing cosmetic damage"],
  "Glass repair": ["Aftermarket racing parts"],
  "Rental reimbursement": ["Rental reimbursement without endorsement"],
  "Flood water intrusion": ["Flood water intrusion", "Named storm waiting period"],
  "Bodily injury liability": ["Intentional acts", "Business livery use"],
  "Roadside assistance": ["Services outside coverage territory"]
};

function pad(value, length = 5) {
  return String(value).padStart(length, "0");
}

function dateFor(index) {
  const day = (index % 28) + 1;
  return `2026-06-${String(day).padStart(2, "0")}`;
}

function effectiveDateFor(index) {
  const month = (index % 6) + 1;
  const day = ((index * 3) % 24) + 1;
  return `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const policies = Array.from({ length: 72 }, (_, index) => {
  const state = states[index % states.length];
  const [lossType] = lossTypes[index % lossTypes.length];
  const policyId = `POL-${state}-${pad(7000 + index, 4)}`;
  return {
    id: policyId,
    holder: `Synthetic Household ${index + 1}`,
    state,
    effectiveDate: effectiveDateFor(index),
    coverage: coverageByLoss[lossType],
    exclusions: exclusionsByLoss[lossType],
    deductible: [250, 500, 750, 1000, 1250][index % 5]
  };
});

const claims = Array.from({ length: 144 }, (_, index) => {
  const policy = policies[index % policies.length];
  const [lossType, coverage, missingDoc, risk, paymentStatus] = lossTypes[index % lossTypes.length];
  const claimId = `CLM-${10482 + index}`;
  const amountBase = [840, 3100, 9200, 14250, 18420, 26600, 48500, 63500][index % 8];
  const status = risk === "High" ? "Escalated" : risk === "Medium" ? "Needs Review" : "Ready to Approve";
  const missingDocs = missingDoc ? [missingDoc, ...(index % 7 === 0 ? ["reviewer note"] : [])] : [];
  return {
    id: claimId,
    policyId: policy.id,
    claimant: `Synthetic Driver ${String.fromCharCode(65 + (index % 26))}-${index + 1}`,
    lossType,
    state: policy.state,
    amount: amountBase + (index % 9) * 325,
    status,
    risk,
    coverage,
    missingDocs,
    paymentStatus,
    openedAt: dateFor(index)
  };
});

const auditEvents = claims.flatMap((claim, index) => {
  const baseHour = 8 + (index % 8);
  const minute = String((index * 7) % 60).padStart(2, "0");
  const common = [
    { time: `${String(baseHour).padStart(2, "0")}:${minute}`, entity: claim.id, event: "Claim intake completed", actor: "Claims API" },
    { time: `${String(baseHour).padStart(2, "0")}:${String((Number(minute) + 3) % 60).padStart(2, "0")}`, entity: claim.id, event: "Coverage retrieval trace saved", actor: "AI review agent" }
  ];
  if (claim.risk !== "Low") {
    common.push({ time: `${String(baseHour).padStart(2, "0")}:${String((Number(minute) + 9) % 60).padStart(2, "0")}`, entity: claim.id, event: `${claim.risk} risk reviewer task opened`, actor: "Reviewer queue" });
  }
  return common;
});

const payments = claims.map((claim, index) => ({
  paymentId: `PAY-${8841 + index}`,
  claimId: claim.id,
  amount: claim.paymentStatus === "Exception" || claim.paymentStatus === "Hold" ? 0 : Math.max(0, claim.amount - policies[index % policies.length].deductible),
  status: claim.paymentStatus,
  updatedAt: dateFor(index + 3)
}));

const ragChunks = claims.slice(0, 96).map((claim, index) => {
  const policy = policies.find((item) => item.id === claim.policyId);
  return {
    document_id: policy.id,
    chunk_id: `${policy.id}-${claim.id}`,
    document_type: claim.risk === "High" ? "exclusion" : "policy",
    policy_id: policy.id,
    claim_id: claim.id,
    coverage_type: claim.lossType,
    state: claim.state,
    effective_date: policy.effectiveDate,
    section_title: `${claim.lossType} Review`,
    risk_category: claim.risk.toLowerCase(),
    payment_status: claim.paymentStatus,
    text: `${claim.lossType} claim ${claim.id} is ${claim.coverage.toLowerCase()} for ${policy.id}. Missing documents: ${claim.missingDocs.length ? claim.missingDocs.join(", ") : "none"}. Payment status: ${claim.paymentStatus}.`,
    relationships: {
      policy: policy.id,
      claim: claim.id,
      payment: payments[index].paymentId,
      decision: claim.status
    }
  };
});

const payload = {
  generatedAt: "2026-07-01",
  claims,
  policies,
  payments,
  auditEvents,
  ragChunks,
  evalMetrics: [
    { metric: "Recall@5", value: 0.94 },
    { metric: "Citations", value: 0.91 },
    { metric: "Grounded", value: 0.92 },
    { metric: "PII Safe", value: 1 },
    { metric: "Injection Block", value: 0.97 }
  ],
  latency: [
    { step: "rewrite", ms: 24 },
    { step: "keyword", ms: 41 },
    { step: "vector", ms: 69 },
    { step: "rerank", ms: 51 },
    { step: "tools", ms: 88 },
    { step: "answer", ms: 390 }
  ]
};

const targets = [
  "apps/web/lib/synthetic-data.json",
  "apps/web/api/synthetic-data.json",
  "data/synthetic-demo-corpus.json"
];

for (const target of targets) {
  const output = resolve(target);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

console.log(`Generated ${claims.length} claims, ${policies.length} policies, ${auditEvents.length} audit events, and ${ragChunks.length} RAG chunks.`);
