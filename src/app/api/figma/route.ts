import { NextRequest, NextResponse } from "next/server";
import { fetchFigmaStructure } from "@/lib/figma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const figmaUrl = searchParams.get("url");

  if (!figmaUrl) {
    return NextResponse.json({ error: "url query param required" }, { status: 400 });
  }

  try {
    const structure = await fetchFigmaStructure(figmaUrl);
    return NextResponse.json({ structure });
  } catch (err) {
    console.error("[figma]", err);
    return NextResponse.json({ error: "Failed to fetch Figma file" }, { status: 500 });
  }
}
