"use client";

import { useState } from "react";
import { HighlightCard } from "@/components/HighlightCard";
import { ParticipantPips } from "@/components/ParticipantPips";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ProjectDetailHeader } from "@/components/ProjectDetailHeader";
import {
  getThemePriority,
  getThemePullQuote,
} from "@/lib/synthesis-utils";
import { getThemeColorMap } from "@/lib/theme-colors";
import type { Project, Recommendation } from "@/types";
import "./project-detail.css";

type Tab = "highlights" | "artifacts" | "themes";

type Props = {
  project: Project;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function recTitle(rec: Recommendation): string {
  if (rec.analysisType === "page") return rec.affectedPage;
  return rec.affectedFlow;
}

export function ProjectView({ project }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("highlights");
  const synthesis = project.synthesis;

  if (!synthesis) {
    return (
      <div className="project-detail">
        <p className="project-detail__empty">No analysis results for this project.</p>
      </div>
    );
  }

  const themeColors = getThemeColorMap(synthesis.themes.map((t) => t.id));
  const themeById = Object.fromEntries(
    synthesis.themes.map((t) => [t.id, t])
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "highlights", label: "Highlights" },
    { id: "artifacts", label: "Artifacts" },
    { id: "themes", label: "Themes" },
  ];

  const artifacts = [
    {
      id: "transcript",
      label: "Transcript",
      value: truncate(project.transcript, 200),
      meta: `${project.transcript.trim().split(/\s+/).length.toLocaleString()} words`,
    },
    {
      id: "figma",
      label: "Figma file",
      value: project.figma_url ?? "Not connected",
      meta: project.figma_url ? "Linked design file" : undefined,
      href: project.figma_url ?? undefined,
    },
    {
      id: "report",
      label: "Generated report",
      value: synthesis.summary,
      meta: `${synthesis.themes.length} themes · ${synthesis.recommendations.length} recommendations`,
    },
    {
      id: "settings",
      label: "Analysis settings",
      value:
        synthesis.analysisType === "flow"
          ? "Flow analysis"
          : "Page analysis",
      meta: `Created ${formatDate(project.created_at)}`,
    },
  ];

  return (
    <div className="project-detail">
      <ProjectDetailHeader project={project} synthesis={synthesis} />

      <div
        className="project-detail__tabs"
        role="tablist"
        aria-label="Project views"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`project-detail__tab${activeTab === tab.id ? " project-detail__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Highlights */}
      <div
        id="panel-highlights"
        role="tabpanel"
        aria-labelledby="tab-highlights"
        hidden={activeTab !== "highlights"}
        className="project-detail__panel"
      >
        <div className="summary-strip">
          <p className="summary-strip__text">{synthesis.summary}</p>
        </div>

        <div className="project-detail__highlights">
          {synthesis.themes.map((theme) => (
            <HighlightCard
              key={theme.id}
              theme={theme}
              color={themeColors[theme.id]}
              priority={getThemePriority(theme.id, synthesis.recommendations)}
              pullQuote={getThemePullQuote(
                theme.quotes,
                synthesis.recommendations,
                theme.id
              )}
            />
          ))}
        </div>
      </div>

      {/* Artifacts */}
      <div
        id="panel-artifacts"
        role="tabpanel"
        aria-labelledby="tab-artifacts"
        hidden={activeTab !== "artifacts"}
        className="project-detail__panel"
      >
        <ul className="artifact-list">
          {artifacts.map((item) => (
            <li key={item.id} className="artifact-row">
              <span className="artifact-row__label">{item.label}</span>
              <div className="artifact-row__content">
                {item.href ? (
                  <a
                    href={item.href}
                    className="artifact-row__value artifact-row__value--link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="artifact-row__value">{item.value}</p>
                )}
                {item.meta && (
                  <p className="artifact-row__meta">{item.meta}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Themes Kanban */}
      <div
        id="panel-themes"
        role="tabpanel"
        aria-labelledby="tab-themes"
        hidden={activeTab !== "themes"}
        className="project-detail__panel"
      >
        <div className="kanban-board">
          {synthesis.themes.map((theme) => {
            const color = themeColors[theme.id];
            const recs = synthesis.recommendations.filter(
              (r) => r.themeId === theme.id
            );

            return (
              <div key={theme.id} className="kanban-column">
                <div
                  className="kanban-column__header"
                  style={{ borderTopColor: color.bar, background: color.bg }}
                >
                  <h3 className="kanban-column__title">{theme.label}</h3>
                  <span className="kanban-column__count">
                    {recs.length} item{recs.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="kanban-column__cards">
                  {recs.length === 0 ? (
                    <p className="kanban-column__empty">No recommendations</p>
                  ) : (
                    recs.map((rec) => (
                      <article key={rec.id} className="kanban-card">
                        <h4 className="kanban-card__title">{recTitle(rec)}</h4>
                        <p className="kanban-card__suggestion">
                          {rec.suggestion}
                        </p>
                        <blockquote className="kanban-card__quote">
                          {rec.supportingQuote}
                        </blockquote>
                        <div className="kanban-card__footer">
                          <ParticipantPips
                            count={themeById[rec.themeId]?.frequency ?? 1}
                            size="sm"
                          />
                          <PriorityBadge priority={rec.priority} />
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
