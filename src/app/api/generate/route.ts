import { NextResponse } from "next/server";
import { csvToChat } from "@/lib/parseCsv";
import { systemSOAP } from "@/lib/prompts";
import { openai } from "@/lib/openai";
import { newEncounter, db } from "@/lib/store";

export async function POST(req: Request) {
  const { csv } = await req.json();
  const enc = newEncounter(csv);

  const messages = [
    { role: "system" as const, content: systemSOAP },
    ...csvToChat(csv),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.3,
  });

  const note = completion.choices[0].message.content ?? "";
  db.get(enc.id)!.aiNote = note;

  return NextResponse.json({ id: enc.id, aiNote: note });
} 