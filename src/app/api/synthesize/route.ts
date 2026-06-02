import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/claude";
import { fetchFigmaStructure } from "@/lib/figma";
import { createServerClient } from "@/lib/supabase";
import type { AnalysisType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { transcript, figmaUrl, analysisType, projectId } =
      (await req.json()) as {
        transcript: string;
        figmaUrl: string;
        analysisType: AnalysisType;
        projectId?: string;
      };

    if (!transcript || !figmaUrl || !analysisType) {
      return NextResponse.json(
        { error: "transcript, figmaUrl, and analysisType are required" },
        { status: 400 }
      );
    }

    const figmaStructure = await fetchFigmaStructure(figmaUrl);
    const synthesis = await synthesize(transcript, figmaStructure, analysisType);

    if (projectId) {
      const db = createServerClient();
      await db
        .from("projects")
        .update({ synthesis })
        .eq("id", projectId);
    }

    return NextResponse.json({ synthesis });
  } catch (err) {
    console.error("[synthesize]", err);
    return NextResponse.json({ error: "Synthesis failed" }, { status: 500 });
  }
}
