import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { db, getReviewPromptForRubric } from "@/lib/store";
import { clipText } from "@/lib/clipText";
import { RUBRIC_REGISTRY, getDefaultRubricKey, RubricKey } from "@/lib/rubrics";
import { validateReviewResponse } from "@/lib/reviewSchemas";

export async function POST(req: Request) {
  const { id, studentNote, gradingPrompt, rubricKey } = await req.json();
  const enc = db.get(id);
  if (!enc?.aiNote) {
    return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
  }
  enc.studentNote = studentNote;

  // Determine which rubric to use (default to PDQI for backward compatibility)
  const selectedRubricKey: RubricKey = rubricKey || getDefaultRubricKey();
  const rubricDefinition = RUBRIC_REGISTRY[selectedRubricKey];
  
  // Store the selected rubric key for this encounter
  enc.reviewRubricKey = selectedRubricKey;

  // Resolve prompt in order: inline → saved per rubric → default rubric
  let promptToUse = rubricDefinition.prompt;
  
  if (gradingPrompt) {
    // Inline override - apply same validation
    const trimmedInlinePrompt = gradingPrompt.trim();
    if (trimmedInlinePrompt.length > 12_000) {
      return NextResponse.json({ error: "Grading prompt exceeds 12,000 character limit" }, { status: 413 });
    }
    promptToUse = trimmedInlinePrompt;
  } else {
    // Check for saved prompt for this specific rubric
    const savedPrompt = getReviewPromptForRubric(enc, selectedRubricKey);
    if (savedPrompt) {
      promptToUse = savedPrompt;
    }
  }

  // Include schema_version in the assistant instructions to force the model to emit it
  const schemaInstruction = `\n\nIMPORTANT: Your response must include "schema_version": "${rubricDefinition.schema_version}" in the JSON.`;
  const finalPrompt = promptToUse + schemaInstruction;

  const transcript = clipText(enc.csv);
  console.log("Transcript chars:", transcript.length);
  console.log("Using rubric:", selectedRubricKey, "with schema version:", rubricDefinition.schema_version);

  const messages = [
    {
      role: "system" as const,
      content: finalPrompt,
    },
    {
      role: "user" as const,
      name: "CONTEXT",
      content:
        "Full encounter transcript (User & Assistant turns):\n\"\"\"\n" +
        transcript +
        "\n\"\"\"",
    },
    {
      role: "user" as const,
      name: "NOTE_A",
      content: enc.aiNote,
    },
    {
      role: "user" as const,
      name: "NOTE_B",
      content: studentNote,
    },
  ];

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const rawResponse = res.choices[0].message.content ?? "{}";
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", parseError);
      return NextResponse.json({ error: "Invalid JSON response from model" }, { status: 500 });
    }

    // Validate the response against the appropriate schema
    const validation = validateReviewResponse(parsedResponse);
    if (!validation.success) {
      console.error("Schema validation failed:", validation.error);
      return NextResponse.json({ 
        error: `Review response validation failed: ${validation.error}` 
      }, { status: 400 });
    }

    // Store the validated response
    enc.reviewJson = validation.data;
    return NextResponse.json(validation.data);
    
  } catch (error) {
    console.error("Error generating review:", error);
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 });
  }
} 