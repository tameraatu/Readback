import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisType, SynthesisOutput } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a UX research synthesis expert. Given a UXR transcript, identify themes and produce actionable design recommendations grounded in specific verbatim user quotes.

Infer likely screens, flows, and UI areas from what participants describe — do not invent Figma file names you were not given.

Always return valid JSON matching the SynthesisOutput schema exactly. Do not include markdown fences or commentary outside the JSON object.`;

function parseSynthesisJson(text: string): SynthesisOutput {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonStr) as SynthesisOutput;
}

export async function synthesize(
  transcript: string,
  analysisType: AnalysisType
): Promise<SynthesisOutput> {
  const pageRecShape =
    analysisType === "page"
      ? `{
      "id": "rec-1",
      "themeId": "theme-1",
      "analysisType": "page",
      "affectedPage": "inferred page or screen name from transcript",
      "affectedComponents": ["component or UI element"],
      "priority": "high" | "medium" | "low",
      "suggestion": "specific design change",
      "rationale": "why this matters based on research",
      "supportingQuote": "verbatim quote from transcript"
    }`
      : `{
      "id": "rec-1",
      "themeId": "theme-1",
      "analysisType": "flow",
      "affectedFlow": "inferred flow name",
      "affectedPages": ["step or screen in the flow"],
      "affectedComponents": ["component or UI element"],
      "priority": "high" | "medium" | "low",
      "suggestion": "specific design change",
      "rationale": "why this matters based on research",
      "supportingQuote": "verbatim quote from transcript"
    }`;

  const userPrompt = `Analysis type: ${analysisType}

UXR Transcript:
${transcript}

Return a JSON object with this shape:
{
  "analysisType": "${analysisType}",
  "summary": "2-3 sentence executive summary of key findings",
  "themes": [
    {
      "id": "theme-1",
      "label": "short theme name",
      "description": "what this theme means",
      "quotes": ["verbatim quote 1", "verbatim quote 2"],
      "sentiment": "positive" | "negative" | "neutral",
      "frequency": 1
    }
  ],
  "recommendations": [
    ${pageRecShape}
  ]
}

Include at least 3 themes and 4 recommendations. Every recommendation must reference a themeId and include a verbatim supportingQuote from the transcript.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content.find((b) => b.type === "text")?.text ?? "";
  if (!text) {
    throw new Error("Empty response from Claude");
  }

  return parseSynthesisJson(text);
}
