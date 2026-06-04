import { notFound } from "next/navigation";
import { ProjectDetailShell } from "@/components/ProjectDetailShell";
import { ProjectView } from "@/components/ProjectView";
import { getProjectById, isSupabaseConfigured } from "@/lib/projects";
import "@/components/project-detail.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <ProjectDetailShell projectName="Project">
        <div className="project-detail">
          <p className="project-detail__empty">
            Supabase is not configured.
          </p>
        </div>
      </ProjectDetailShell>
    );
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailShell projectName={project.name}>
      <ProjectView project={project} />
    </ProjectDetailShell>
  );
}
