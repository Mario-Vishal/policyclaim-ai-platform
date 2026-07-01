# Tradeoffs

## Local Demo vs Cloud Production

The repository supports a lightweight local/recruiter demo while preserving production deployment assets. Some cloud resources, including Vercel, Azure Container Apps, Supabase, and Upstash, require user-owned credentials and manual login.

## Deterministic AI Fallback

The AI service supports real OpenAI calls when `OPENAI_API_KEY` is configured. Without the key, it returns deterministic trace-backed responses. This keeps tests and demos stable but is not a substitute for validating production model quality.
