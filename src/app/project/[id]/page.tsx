import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { SynthesisResults } from "@/components/SynthesisResults";
import { getProjectById, isSupabaseConfigured } from "@/lib/projects";
import "@/components/synthesis.css";
import "../new/new-project.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <AppShell>
        <div className="new-project">
          <p className="new-project__submit-error">
            Supabase is not configured.
          </p>
        </div>
      </AppShell>
    );
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <AppShell>
      <div className="new-project">
        <header className="new-project__header">
          <Link href="/" className="new-project__back">
            ← All projects
          </Link>
          <h1 className="new-project__title">{project.name}</h1>
        </header>

        {project.synthesis ? (
          <SynthesisResults
            projectName={project.name}
            synthesis={project.synthesis}
          />
        ) : (
          <p className="new-project__hint">No analysis results for this project.</p>
        )}
      </div>
    </AppShell>
  );
}
