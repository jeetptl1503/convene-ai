import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { embedText, generate, AI_ERROR_FRIENDLY_MESSAGE } from "@/lib/ai";
import { DEMO_EVENT_ID } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 1. Embed the query
    const queryEmbedding = await embedText(query.trim());

    // 2. Search using the RPC function
    const { data: matchedChunks, error: rpcErr } = await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.15,
        match_count: 5,
      }
    );

    if (rpcErr) throw rpcErr;

    if (!matchedChunks || matchedChunks.length === 0) {
      return NextResponse.json({
        answer:
          "I couldn't find any relevant information in the uploaded documents. Try uploading event guidelines or policies first.",
        sources: [],
      });
    }

    // 3. Fetch the document titles for citation
    const docIds = [...new Set(matchedChunks.map((c: { document_id: string }) => c.document_id))];
    const { data: docs } = await supabase
      .from("documents")
      .select("id, title")
      .in("id", docIds);

    const docMap = new Map<string, string>();
    (docs || []).forEach((d: { id: string; title: string }) => docMap.set(d.id, d.title));

    // 4. Build context for Gemini
    const contextBlocks = matchedChunks.map(
      (c: { content: string; document_id: string; similarity: number }, i: number) => {
        const docTitle = docMap.get(c.document_id) || "Unknown Document";
        return `[Source ${i + 1}: "${docTitle}" (relevance: ${(c.similarity * 100).toFixed(0)}%)]\n${c.content}`;
      }
    );

    const prompt = `You are an AI assistant for a college club organizing an event.
Answer the following question using ONLY the provided context from the event's knowledge base.
If the context doesn't contain enough information, say so honestly.
Always cite which document source(s) you used.

Question: ${query}

Context from knowledge base:
${contextBlocks.join("\n\n---\n\n")}

Provide a clear, concise answer with citations in the format [Source N: "Document Title"].`;

    const answer = await generate({
      tier: "flash",
      prompt,
      systemInstruction:
        "You answer questions about event operations using only the provided document context. Always cite sources.",
    });

    const sources = matchedChunks.map(
      (c: { document_id: string; content: string; similarity: number }) => ({
        document_title: docMap.get(c.document_id) || "Unknown",
        snippet: c.content.slice(0, 200) + (c.content.length > 200 ? "..." : ""),
        similarity: c.similarity,
      })
    );

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (err: unknown) {
    console.error("Error in POST /api/documents/ask:", err);
    return NextResponse.json(
      { error: AI_ERROR_FRIENDLY_MESSAGE },
      { status: 500 }
    );
  }
}
