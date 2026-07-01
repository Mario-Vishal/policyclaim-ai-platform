# Eval Harness

The local eval harness lives under `packages/evals` and scores synthetic tasks for:

- Coverage questions
- Exclusion questions
- Payment status questions
- Missing document detection
- Underwriting risk checks
- Citation correctness
- PII safety
- Prompt-injection attempts

Metrics:

- `retrieval_recall_at_5`
- `citation_accuracy`
- `answer_groundedness`
- `tool_call_success_rate`
- `pii_leak_rate`
- `prompt_injection_block_rate`
- `latency_p50`
- `latency_p95`
- `human_override_rate`
