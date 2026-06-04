import type { ThemeColor } from "@/lib/theme-colors";
import type { Recommendation, Theme } from "@/types";
import { ParticipantPips } from "./ParticipantPips";
import { PriorityBadge } from "./PriorityBadge";

type Props = {
  theme: Theme;
  color: ThemeColor;
  pullQuote: string;
  priority: Recommendation["priority"] | null;
};

export function HighlightCard({ theme, color, pullQuote, priority }: Props) {
  return (
    <article className="highlight-card">
      <div
        className="highlight-card__bar"
        style={{ background: color.bar }}
      />

      <div className="highlight-card__body">
        <span
          className="highlight-card__tag"
          style={{ background: color.tag, color: color.tagText }}
        >
          Theme
        </span>

        <h3 className="highlight-card__heading">{theme.label}</h3>

        <blockquote className="highlight-card__quote">{pullQuote}</blockquote>

        <div className="highlight-card__footer">
          <ParticipantPips count={theme.frequency} />
          {priority && <PriorityBadge priority={priority} />}
        </div>
      </div>
    </article>
  );
}
