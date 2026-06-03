import { RecommendationCard } from "@/components/RecommendationCard";
import { ThemeTag } from "@/components/ThemeTag";
import type { SynthesisOutput } from "@/types";

type Props = {
  projectName: string;
  synthesis: SynthesisOutput;
};

export function SynthesisResults({ projectName, synthesis }: Props) {
  const themeById = Object.fromEntries(
    synthesis.themes.map((t) => [t.id, t.label])
  );

  return (
    <section className="synthesis-results" aria-labelledby="results-heading">
      <header className="synthesis-results__header">
        <h2 id="results-heading" className="synthesis-results__title">
          {projectName}
        </h2>
        <p className="synthesis-results__summary">{synthesis.summary}</p>
      </header>

      <div className="synthesis-results__section">
        <h3 className="synthesis-results__section-title">Themes</h3>
        <div className="synthesis-results__themes">
          {synthesis.themes.map((theme) => (
            <ThemeTag key={theme.id} theme={theme} />
          ))}
        </div>
      </div>

      <div className="synthesis-results__section">
        <h3 className="synthesis-results__section-title">
          Recommendations
          <span className="synthesis-results__count">
            {synthesis.recommendations.length}
          </span>
        </h3>
        <div className="synthesis-results__recommendations">
          {synthesis.recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              themeLabel={themeById[rec.themeId]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
