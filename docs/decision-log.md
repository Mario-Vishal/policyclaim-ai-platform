# Decision Log

## 2026-07-01

- Chose a polyglot monorepo to demonstrate a realistic enterprise split: Next.js web, .NET claims API, FastAPI AI service, shared contracts, evals, and infrastructure.
- Targeted Vercel for the public web app and Azure Container Apps for backend services, matching the requested deployment profile while keeping local Docker Compose support.
- Kept OpenAI usage backend-only and required deterministic fallback mode when credentials are absent so the demo remains recruiter-safe and locally runnable.
- Built the web app as a static-friendly Next.js App Router experience backed by synthetic client-side data first, so Vercel can host a recruiter-safe demo even before cloud backend credentials are configured.
- Used shadcn-style local UI primitives instead of generated component dependencies to keep the design system auditable and lightweight while preserving the requested dashboard feel.
- Kept the .NET API as the trusted workflow and AI proxy boundary. The API owns synthetic claims, policies, payments, reviewer tasks, audit writes, rate limiting, and forwards `/api/ai/ask` to FastAPI.
- Implemented the AI service with deterministic local embeddings for repeatable tests and OpenAI chat completion only when `OPENAI_API_KEY` is configured. This keeps local and public demo behavior stable while preserving real LLM readiness.
- Modeled GraphRAG-lite relationships in chunk metadata JSON rather than adding a graph database, which is sufficient for the demo domain and easier to deploy on Supabase-compatible Postgres.
