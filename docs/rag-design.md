# RAG Design

The RAG service implements a deterministic local pipeline with OpenAI-ready seams:

1. Document ingestion
2. Contextual chunking
3. Metadata extraction
4. Embedding generation
5. PostgreSQL + pgvector storage
6. Keyword search
7. Vector search
8. Hybrid result merge
9. Reranking
10. Context packing
11. Answer generation
12. Grounded citations
13. Guardrail checks
14. Output validation
15. Trace logging

Metadata fields include `policy_id`, `claim_id`, `document_type`, `coverage_type`, `state`, `effective_date`, `section_title`, `risk_category`, and `payment_status`.

GraphRAG-lite relationships are modeled as JSON relationship maps:

`Policy -> Coverage -> Exclusion -> Claim -> Payment -> ReviewerDecision`

The local implementation uses deterministic hashed embeddings for stable test runs. Production deployments can switch ingestion to OpenAI embeddings by configuring `OPENAI_API_KEY` and `OPENAI_EMBEDDING_MODEL`, then storing vectors in the `document_chunks.embedding` pgvector column.
