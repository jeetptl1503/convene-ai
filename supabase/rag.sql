-- =============================================================
-- Convene AI — RAG Vector Similarity Search Function
-- Run this in the Supabase SQL Editor to enable semantic search.
-- =============================================================

-- Matches document chunks against a query embedding vector(768)
create or replace function match_document_chunks (
  query_embedding vector(768),
  match_threshold float default 0.2,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;
