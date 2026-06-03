import type { Theme } from "@/types";

type Props = {
  theme: Theme;
};

const SENTIMENT_CLASS: Record<Theme["sentiment"], string> = {
  positive: "theme-tag--positive",
  negative: "theme-tag--negative",
  neutral: "theme-tag--neutral",
};

export function ThemeTag({ theme }: Props) {
  return (
    <article className={`theme-tag ${SENTIMENT_CLASS[theme.sentiment]}`}>
      <div className="theme-tag__header">
        <h3 className="theme-tag__label">{theme.label}</h3>
        <span className="theme-tag__frequency">
          {theme.frequency} mention{theme.frequency === 1 ? "" : "s"}
        </span>
      </div>
      <p className="theme-tag__description">{theme.description}</p>
      {theme.quotes.length > 0 && (
        <ul className="theme-tag__quotes">
          {theme.quotes.map((quote) => (
            <li key={quote} className="theme-tag__quote">
              {quote}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
