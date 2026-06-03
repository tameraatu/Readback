import type { Recommendation } from "@/types";

type Props = {
  recommendation: Recommendation;
  themeLabel?: string;
};

const PRIORITY_CLASS: Record<
  Recommendation["priority"],
  string
> = {
  high: "rec-card__priority--high",
  medium: "rec-card__priority--medium",
  low: "rec-card__priority--low",
};

export function RecommendationCard({ recommendation, themeLabel }: Props) {
  const target =
    recommendation.analysisType === "page"
      ? recommendation.affectedPage
      : recommendation.affectedFlow;

  const context =
    recommendation.analysisType === "page"
      ? recommendation.affectedComponents.join(", ")
      : [
          ...recommendation.affectedPages,
          ...recommendation.affectedComponents,
        ].join(" · ");

  return (
    <article className="rec-card">
      <div className="rec-card__header">
        <span
          className={`rec-card__priority ${PRIORITY_CLASS[recommendation.priority]}`}
        >
          {recommendation.priority}
        </span>
        {themeLabel && (
          <span className="rec-card__theme">{themeLabel}</span>
        )}
      </div>

      <h3 className="rec-card__target">{target}</h3>
      {context && <p className="rec-card__context">{context}</p>}

      <p className="rec-card__suggestion">{recommendation.suggestion}</p>
      <p className="rec-card__rationale">{recommendation.rationale}</p>

      <blockquote className="rec-card__quote">
        {recommendation.supportingQuote}
      </blockquote>
    </article>
  );
}
