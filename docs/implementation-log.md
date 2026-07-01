# Implementation Log

## 2026-07-01

- Initialized the local repository on `main`.
- Created baseline monorepo structure, environment contract, README, license, and persistent project docs.
- Added the Next.js web application with landing page, business workflow routes, Engineering Mode, React Flow architecture graph, Framer Motion RAG replay, Recharts eval/latency views, and Playwright happy-path coverage.
- Added the .NET 8 ASP.NET Core API project with required endpoints, synthetic in-memory store, AI proxy fallback behavior, rate limiting, Swagger, Dockerfile, OpenAPI contract stub, and xUnit tests for core store behavior.
- Verification note: `dotnet --info` failed locally because the .NET SDK is not installed or not on PATH. Run `dotnet test apps/api/PolicyClaim.sln` after installing .NET 8 SDK.
- Added the FastAPI AI service with `/rag/ask`, `/rag/ingest`, `/rag/trace/{trace_id}`, tool endpoints, eval endpoints, deterministic fallback answers, prompt-injection blocking, PII redaction, citation validation, hybrid retrieval, reranking, context packing, trace logging, pytest tests, and pgvector seed schema.
- Added the standalone eval harness under `packages/evals` with JSON cases, metrics scoring, generated latest-results output, and pytest smoke coverage.
- Added Dockerfiles, Docker Compose, Azure DevOps pipeline, Azure Container Apps templates and instructions, AKS-ready manifests, and deployment docs.
- Final verification passed for web lint/build, Playwright happy path, .NET API xUnit tests, FastAPI pytest, eval harness pytest, live FastAPI `/health`, live `/rag/ask` fallback response with citations and trace, and Docker Compose config validation.
- Installed .NET 8 SDK and Azure CLI locally with `winget`. The current Codex process may need absolute paths until its inherited PATH is refreshed, but new terminals should pick up the installers' PATH changes.
- Fixed the API project so it no longer compiles nested test files as production source, and added an explicit xUnit import in the test file.
- Expanded synthetic demo data across the web app, .NET API, FastAPI RAG chunks, AI tool mappings, and seed JSON files to cover more states, claim types, payment statuses, missing-document scenarios, and audit events.
