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
