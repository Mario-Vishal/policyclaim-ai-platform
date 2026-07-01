# Decision Log

## 2026-07-01

- Chose a polyglot monorepo to demonstrate a realistic enterprise split: Next.js web, .NET claims API, FastAPI AI service, shared contracts, evals, and infrastructure.
- Targeted Vercel for the public web app and Azure Container Apps for backend services, matching the requested deployment profile while keeping local Docker Compose support.
- Kept OpenAI usage backend-only and required deterministic fallback mode when credentials are absent so the demo remains recruiter-safe and locally runnable.
