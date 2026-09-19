import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { embedText, AI_ERROR_FRIENDLY_MESSAGE } from "@/lib/ai";
import { chunkText } from "@/lib/chunking";
import { DEMO_EVENT_ID } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 1. Insert document
    const { data: doc, error: docErr } = await supabase
      .from("documents")
      .insert({
        event_id: DEMO_EVENT_ID,
        title: title.trim(),
        content: content.trim(),
      })
      .select()
      .single();

    if (docErr) throw docErr;

    // 2. Chunk the content
    const chunks = chunkText(content.trim());

    // 3. Embed each chunk and insert
    const chunkRows = [];
    for (const chunkContent of chunks) {
      const embedding = await embedText(chunkContent);
      chunkRows.push({
        document_id: doc.id,
        content: chunkContent,
        embedding: JSON.stringify(embedding),
      });
    }

    if (chunkRows.length > 0) {
      const { error: chunkErr } = await supabase
        .from("document_chunks")
        .insert(chunkRows);
      if (chunkErr) throw chunkErr;
    }

    // 4. Log activity
    await supabase.from("activity_log").insert({
      event_id: DEMO_EVENT_ID,
      action: "Document Uploaded",
      details: `Uploaded "${title}" with ${chunks.length} indexed chunks`,
    });

    return NextResponse.json({
      document: doc,
      chunks_count: chunks.length,
      message: `Document "${title}" indexed with ${chunks.length} searchable chunks.`,
    });
  } catch (err: unknown) {
    console.error("Error in POST /api/documents:", err);
    return NextResponse.json(
      { error: AI_ERROR_FRIENDLY_MESSAGE },
      { status: 500 }
    );
  }
}
