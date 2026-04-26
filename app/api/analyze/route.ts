import { NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/analyzer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repoUrl = String(body.repoUrl ?? "");

    if (!repoUrl.trim()) {
      return NextResponse.json({ error: "GitHub repository URL is required." }, { status: 400 });
    }

    const result = await analyzeRepository(repoUrl);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
