import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id")!;
  const data = db.get(id);
  return data
    ? NextResponse.json(data)
    : NextResponse.json({ error: "not found" }, { status: 404 });
} 