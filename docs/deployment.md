# Deployment

## Frontend: Vercel

```bash
cd apps/web
vercel link
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel deploy
vercel --prod
```

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
