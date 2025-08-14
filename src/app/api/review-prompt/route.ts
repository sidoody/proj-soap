import { NextResponse } from "next/server";
import { db } from "@/lib/store";
import { defaultReviewPrompt } from "@/lib/reviewPrompt";

// GET: ?id=<encId> → { id, prompt: string | null, defaultPrompt: string }
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }
  
  const enc = db.get(id);
  if (!enc) {
    return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
  }
  
  return NextResponse.json({
    id,
    prompt: enc.reviewPrompt ?? null,
    defaultPrompt: defaultReviewPrompt
  });
}

// PUT: body { id: string, prompt: string }
export async function PUT(req: Request) {
  try {
    const { id, prompt } = await req.json();
    
    if (!id || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid id or prompt" }, { status: 400 });
    }
    
    const trimmedPrompt = prompt.trim();
    
    // Cap at 12,000 chars
    if (trimmedPrompt.length > 12_000) {
      return NextResponse.json({ error: "Prompt exceeds 12,000 character limit" }, { status: 413 });
    }
    
    const enc = db.get(id);
    if (!enc) {
      return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
    }
    
    enc.reviewPrompt = trimmedPrompt;
    enc.reviewPromptEditedAt = new Date();
    
    return NextResponse.json({ 
      id, 
      prompt: trimmedPrompt,
      editedAt: enc.reviewPromptEditedAt 
    });
    
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE: body { id: string }
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    
    const enc = db.get(id);
    if (!enc) {
      return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
    }
    
    delete enc.reviewPrompt;
    delete enc.reviewPromptEditedAt;
    
    return NextResponse.json({ 
      id,
      prompt: null 
    });
    
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
} 