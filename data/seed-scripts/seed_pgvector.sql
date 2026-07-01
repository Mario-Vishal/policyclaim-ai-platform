create extension if not exists vector;

create table if not exists document_chunks (
  id bigserial primary key,
  document_id text not null,
  chunk_id text not null unique,
  text text not null,
  section_title text not null,
  policy_id text,
  claim_id text,
  document_type text not null,
  coverage_type text,
  state text,
  effective_date date,
  risk_category text,
  payment_status text,
  relationships jsonb not null default '{}'::jsonb,
  embedding vector(48)
);

create index if not exists idx_document_chunks_embedding on document_chunks using ivfflat (embedding vector_cosine_ops);
create index if not exists idx_document_chunks_metadata on document_chunks (policy_id, claim_id, document_type, state);
