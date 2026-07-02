import syntheticData from "./synthetic-data.json";

export const claims = syntheticData.claims;
export const policies = syntheticData.policies;
export const payments = syntheticData.payments;
export const auditEvents = syntheticData.auditEvents;
export const evalMetrics = syntheticData.evalMetrics;
export const latency = syntheticData.latency;
export const ragChunks = syntheticData.ragChunks;

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
