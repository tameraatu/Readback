import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/claude";
import type { AnalysisType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { transcript, analysisType } = (await req.json()) as {
      transcript: string;
      analysisType: AnalysisType;
    };

    if (!transcript?.trim() || !analysisType) {
      return NextResponse.json(
        { error: "transcript and analysisType are required" },
        { status: 400 }
      );
    }

    const synthesis = await synthesize(transcript.trim(), analysisType);

    return NextResponse.json({ synthesis });
  } catch (err) {
    console.error("[synthesize]", err);
    const message =
      err instanceof Error ? err.message : "Synthesis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
