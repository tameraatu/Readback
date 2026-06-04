import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/claude";
import { isSupabaseConfigured, saveProject } from "@/lib/projects";
import type { AnalysisType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    const { name, transcript, figmaUrl, analysisType } = (await req.json()) as {
      name: string;
      transcript: string;
      figmaUrl?: string;
      analysisType: AnalysisType;
    };

    if (!name?.trim() || !transcript?.trim() || !analysisType) {
      return NextResponse.json(
        { error: "name, transcript, and analysisType are required" },
        { status: 400 }
      );
    }

    const synthesis = await synthesize(transcript.trim(), analysisType);

    const project = await saveProject({
      name: name.trim(),
      transcript: transcript.trim(),
      figmaUrl,
      synthesis,
    });

    return NextResponse.json({ synthesis, project });
  } catch (err) {
    console.error("[synthesize]", err);
    const message =
      err instanceof Error ? err.message : "Synthesis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
