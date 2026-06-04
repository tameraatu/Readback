import type { Recommendation } from "@/types";

const PRIORITY_RANK: Record<Recommendation["priority"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function getThemePriority(
  themeId: string,
  recommendations: Recommendation[]
): Recommendation["priority"] | null {
  const themeRecs = recommendations.filter((r) => r.themeId === themeId);
  if (themeRecs.length === 0) return null;

  return themeRecs.reduce((best, rec) =>
    PRIORITY_RANK[rec.priority] > PRIORITY_RANK[best.priority] ? rec : best
  ).priority;
}

export function getThemePullQuote(
  quotes: string[],
  recommendations: Recommendation[],
  themeId: string
): string {
  if (quotes.length > 0) return quotes[0];

  const themeRec = recommendations.find((r) => r.themeId === themeId);
  return themeRec?.supportingQuote ?? "No quote available";
}
