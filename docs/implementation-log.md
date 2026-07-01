# Implementation Log

## 2026-07-01

- Initialized the local repository on `main`.
- Created baseline monorepo structure, environment contract, README, license, and persistent project docs.
- Added the Next.js web application with landing page, business workflow routes, Engineering Mode, React Flow architecture graph, Framer Motion RAG replay, Recharts eval/latency views, and Playwright happy-path coverage.
- Added the .NET 8 ASP.NET Core API project with required endpoints, synthetic in-memory store, AI proxy fallback behavior, rate limiting, Swagger, Dockerfile, OpenAPI contract stub, and xUnit tests for core store behavior.
- Verification note: `dotnet --info` failed locally because the .NET SDK is not installed or not on PATH. Run `dotnet test apps/api/PolicyClaim.sln` after installing .NET 8 SDK.
- Added the FastAPI AI service with `/rag/ask`, `/rag/ingest`, `/rag/trace/{trace_id}`, tool endpoints, eval endpoints, deterministic fallback answers, prompt-injection blocking, PII redaction, citation validation, hybrid retrieval, reranking, context packing, trace logging, pytest tests, and pgvector seed schema.
