# Architecture

PolicyClaim AI Platform uses three primary runtime services:

- `apps/web`: Next.js recruiter-facing web application with Business Mode and Engineering Mode.
- `apps/api`: .NET 8 ASP.NET Core API that owns claims, policies, payments, reviewer tasks, audit events, auth boundaries, and the `/api/ai/ask` proxy.
- `apps/ai-service`: FastAPI service that owns RAG, agent tool orchestration, guardrails, traces, eval execution, and backend-only OpenAI calls.

```mermaid
flowchart TD
  User[Reviewer or Recruiter] --> Web[Next.js Web]
  Web --> DotNet[ASP.NET Core API]
  DotNet --> Claims[(Synthetic Claims Store)]
  DotNet --> Audit[(Audit Events)]
  DotNet --> Redis[(Redis Cache and Rate Limit)]
  DotNet --> Ai[FastAPI AI Service]
  Ai --> Pg[(PostgreSQL + pgvector)]
  Ai --> Eval[(Eval Trace Store)]
  Ai --> OpenAI[OpenAI API]
```

The API remains the trusted backend boundary. The frontend never calls OpenAI directly and never receives backend secrets.
