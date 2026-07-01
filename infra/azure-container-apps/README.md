# Azure Container Apps Deployment

These commands assume Azure CLI is installed and authenticated. Replace placeholders before running.

```bash
az login
az group create --name rg-policyclaim-ai --location eastus
az acr create --resource-group rg-policyclaim-ai --name policyclaimregistry --sku Basic
az acr login --name policyclaimregistry

docker build -f apps/api/Dockerfile -t policyclaimregistry.azurecr.io/policyclaim-api:latest .
docker build -f apps/ai-service/Dockerfile -t policyclaimregistry.azurecr.io/policyclaim-ai-service:latest .
docker push policyclaimregistry.azurecr.io/policyclaim-api:latest
docker push policyclaimregistry.azurecr.io/policyclaim-ai-service:latest

az containerapp env create \
  --name cae-policyclaim \
  --resource-group rg-policyclaim-ai \
  --location eastus

az containerapp create \
  --name policyclaim-ai-service \
  --resource-group rg-policyclaim-ai \
  --environment cae-policyclaim \
  --image policyclaimregistry.azurecr.io/policyclaim-ai-service:latest \
  --target-port 8000 \
  --ingress internal \
  --env-vars OPENAI_MODEL=gpt-4.1-mini OPENAI_EMBEDDING_MODEL=text-embedding-3-small DATABASE_URL="<supabase-url>" REDIS_URL="<upstash-url>" \
  --secrets openai-api-key="<openai-key>"

az containerapp update \
  --name policyclaim-ai-service \
  --resource-group rg-policyclaim-ai \
  --set-env-vars OPENAI_API_KEY=secretref:openai-api-key

az containerapp create \
  --name policyclaim-api \
  --resource-group rg-policyclaim-ai \
  --environment cae-policyclaim \
  --image policyclaimregistry.azurecr.io/policyclaim-api:latest \
  --target-port 8080 \
  --ingress external \
  --env-vars AI_SERVICE_BASE_URL="http://policyclaim-ai-service" DATABASE_URL="<supabase-url>" REDIS_URL="<upstash-url>"
```

Set the public API URL in Vercel:

```bash
cd apps/web
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel --prod
```

## Required Cloud Resources

- Azure resource group
- Azure Container Apps environment
- Azure Container Registry or another OCI registry
- Supabase Postgres with pgvector enabled
- Upstash Redis
- OpenAI API key stored as a Container Apps secret

Do not place secrets in Git. Use Container Apps secrets, Vercel env vars, Supabase connection strings, and Upstash env vars.
