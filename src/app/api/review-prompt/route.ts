import { NextResponse } from "next/server";
import { db, getReviewPromptForRubric, setReviewPromptForRubric, deleteReviewPromptForRubric } from "@/lib/store";
import { RUBRIC_REGISTRY, getDefaultRubricKey, RubricKey } from "@/lib/rubrics";

// GET: ?id=<encId>&rubricKey=<key> → { id, rubricKey, prompt: string | null, defaultPrompt: string }
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const rubricKeyParam = url.searchParams.get("rubricKey");
  
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }
  
  const enc = db.get(id);
  if (!enc) {
    return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
  }
  
  // Default to PDQI if no rubricKey specified (backward compatibility)
  const rubricKey: RubricKey = (rubricKeyParam as RubricKey) || getDefaultRubricKey();
  
  // Validate rubricKey
  if (!RUBRIC_REGISTRY[rubricKey]) {
    return NextResponse.json({ error: "Invalid rubric key" }, { status: 400 });
  }
  
  const rubricDefinition = RUBRIC_REGISTRY[rubricKey];
  const savedPrompt = getReviewPromptForRubric(enc, rubricKey);
  
  return NextResponse.json({
    id,
    rubricKey,
    prompt: savedPrompt ?? null,
    defaultPrompt: rubricDefinition.prompt
  });
}

// PUT: body { id: string, prompt: string, rubricKey?: string }
export async function PUT(req: Request) {
  try {
    const { id, prompt, rubricKey: rubricKeyParam } = await req.json();
    
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
    
    // Default to PDQI if no rubricKey specified (backward compatibility)
    const rubricKey: RubricKey = (rubricKeyParam as RubricKey) || getDefaultRubricKey();
    
    // Validate rubricKey
    if (!RUBRIC_REGISTRY[rubricKey]) {
      return NextResponse.json({ error: "Invalid rubric key" }, { status: 400 });
    }
    
    setReviewPromptForRubric(enc, rubricKey, trimmedPrompt);
    
    return NextResponse.json({ 
      id, 
      rubricKey,
      prompt: trimmedPrompt,
      editedAt: enc.reviewPromptEditedAt 
    });
    
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE: body { id: string, rubricKey?: string }
export async function DELETE(req: Request) {
  try {
    const { id, rubricKey: rubricKeyParam } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    
    const enc = db.get(id);
    if (!enc) {
      return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
    }
    
    // Default to PDQI if no rubricKey specified (backward compatibility)
    const rubricKey: RubricKey = (rubricKeyParam as RubricKey) || getDefaultRubricKey();
    
    // Validate rubricKey
    if (!RUBRIC_REGISTRY[rubricKey]) {
      return NextResponse.json({ error: "Invalid rubric key" }, { status: 400 });
    }
    
    deleteReviewPromptForRubric(enc, rubricKey);
    
    return NextResponse.json({ 
      id,
      rubricKey,
      prompt: null 
    });
    
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
} 