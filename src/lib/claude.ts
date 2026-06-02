import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisType, SynthesisOutput } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a UX research synthesis expert. Given a UXR transcript and a Figma file structure, produce structured design recommendations grounded in specific user quotes.

Always return valid JSON matching the SynthesisOutput schema exactly. Do not include markdown fences or commentary outside the JSON object.`;

export async function synthesize(
  transcript: string,
  figmaStructure: string,
  analysisType: AnalysisType
): Promise<SynthesisOutput> {
  const userPrompt = `Analysis type: ${analysisType}

UXR Transcript:
${transcript}

Figma File Structure:
${figmaStructure}

Return a JSON object with this shape:
{
  "analysisType": "${analysisType}",
  "summary": "...",
  "themes": [
    {
      "id": "theme-1",
      "label": "...",
      "description": "...",
      "quotes": ["..."],
      "sentiment": "positive" | "negative" | "neutral",
      "frequency": 1
    }
  ],
  "recommendations": [
    ${
      analysisType === "page"
        ? `{
      "id": "rec-1",
      "themeId": "theme-1",
      "analysisType": "page",
      "affectedPage": "...",
      "affectedComponents": ["..."],
      "priority": "high" | "medium" | "low",
      "suggestion": "...",
      "rationale": "...",
      "supportingQuote": "..."
    }`
        : `{
      "id": "rec-1",
      "themeId": "theme-1",
      "analysisType": "flow",
      "affectedFlow": "...",
      "affectedPages": ["..."],
      "affectedComponents": ["..."],
      "priority": "high" | "medium" | "low",
      "suggestion": "...",
      "rationale": "...",
      "supportingQuote": "..."
    }`
    }
  ]
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content.find((b) => b.type === "text")?.text ?? "";
  return JSON.parse(text) as SynthesisOutput;
}
