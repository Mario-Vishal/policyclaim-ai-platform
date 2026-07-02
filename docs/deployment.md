# Deployment

## Frontend: Vercel

```bash
cd apps/web
vercel link
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel env add OPENAI_API_KEY
vercel env add OPENAI_MODEL
vercel deploy
vercel --prod
```

Set `NEXT_PUBLIC_API_BASE_URL` to the external Azure Container Apps URL for `policyclaim-api` after backend deployment.

For the lightweight public demo, Azure is optional. The deployed Next.js app includes Vercel Python API routes:

- `/api/rag-ask`
- `/api/claim-action`
- `/api/evals-latest`

These routes use the generated synthetic corpus under `apps/web/lib/synthetic-data.json`. `/api/rag-ask` calls OpenAI only when `OPENAI_API_KEY` is configured in Vercel; otherwise it returns a clearly labeled fallback response.

## Backend: Azure Container Apps

Detailed commands and resource naming are in `infra/azure-container-apps/README.md`.

## Local Docker Compose

```bash
docker compose -f infra/docker-compose.yml up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:5088`
- AI service: `http://localhost:8000`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

## Supabase PostgreSQL + pgvector

1. Create a Supabase project.
2. Enable the `vector` extension in SQL editor:

```sql
create extension if not exists vector;
```

3. Set `DATABASE_URL` for `apps/api` and `apps/ai-service`.

## Upstash Redis

1. Create an Upstash Redis database.
2. Set `REDIS_URL` in Azure Container Apps and local `.env` files.
3. The API falls back to in-memory rate limiting if Redis is unavailable.

## AKS-Ready Manifests

Kubernetes manifests live in `infra/k8s-aks-ready`. They are intentionally registry-neutral except for placeholder image names and should be paired with Azure Key Vault or External Secrets for production secrets.
