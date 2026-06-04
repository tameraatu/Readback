"use client";

import type { Project, SynthesisOutput } from "@/types";
import { ExportButton } from "./ExportButton";
import { ShareButton } from "./ShareButton";

type Props = {
  project: Project;
  synthesis: SynthesisOutput;
};

function totalParticipants(synthesis: SynthesisOutput): number {
  return synthesis.themes.reduce((sum, t) => sum + t.frequency, 0);
}

export function ProjectDetailHeader({ project, synthesis }: Props) {
  const analysisLabel =
    synthesis.analysisType === "flow" ? "Flow analysis" : "Page analysis";

  return (
    <header className="project-header">
      <div className="project-header__info">
        <div className="project-header__title-row">
          <h1 className="project-header__title">{project.name}</h1>
          <span className="project-header__badge">{analysisLabel}</span>
        </div>
        <p className="project-header__stats">
          {totalParticipants(synthesis)} participants · {synthesis.themes.length}{" "}
          theme{synthesis.themes.length === 1 ? "" : "s"} ·{" "}
          {synthesis.recommendations.length} recommendation
          {synthesis.recommendations.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="project-header__actions">
        <ShareButton />
        <ExportButton project={project} />
      </div>
    </header>
  );
}
