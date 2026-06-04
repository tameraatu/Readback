import Link from "next/link";
import type { Project } from "@/types";

type Props = {
  projects: Project[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProjectList({ projects }: Props) {
  return (
    <ul className="home-projects">
      {projects.map((project) => {
        const themeCount = project.synthesis?.themes.length ?? 0;
        const recCount = project.synthesis?.recommendations.length ?? 0;
        const analysisLabel =
          project.synthesis?.analysisType === "flow"
            ? "Flow analysis"
            : "Page analysis";

        return (
          <li key={project.id}>
            <Link href={`/project/${project.id}`} className="home-project-card">
              <div className="home-project-card__header">
                <h2 className="home-project-card__name">{project.name}</h2>
                <time
                  className="home-project-card__date"
                  dateTime={project.created_at}
                >
                  {formatDate(project.created_at)}
                </time>
              </div>
              {project.synthesis ? (
                <p className="home-project-card__meta">
                  {themeCount} theme{themeCount === 1 ? "" : "s"} · {recCount}{" "}
                  recommendation{recCount === 1 ? "" : "s"} · {analysisLabel}
                </p>
              ) : (
                <p className="home-project-card__meta home-project-card__meta--muted">
                  No analysis yet
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
