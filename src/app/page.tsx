import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProjectList } from "@/components/ProjectList";
import { getProjects, isSupabaseConfigured } from "@/lib/projects";
import "./home.css";

export default async function Home() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let fetchError: string | null = null;

  if (isSupabaseConfigured()) {
    try {
      projects = await getProjects();
    } catch (err) {
      console.error("[home] failed to fetch projects", err);
      fetchError =
        err instanceof Error ? err.message : "Failed to load projects";
    }
  }

  const hasProjects = projects.length > 0;

  return (
    <AppShell>
      <div className={`home${hasProjects ? " home--with-projects" : ""}`}>
        <header className="home__header">
          <div>
            <h1 className="home__title">
              {hasProjects ? "Projects" : "Create your first project"}
            </h1>
            <p className="home__description">
              {hasProjects
                ? "Your saved UXR synthesis projects."
                : "Upload a UXR transcript, connect your Figma file, and get design recommendations grounded in real user quotes."}
            </p>
          </div>
          <Link href="/project/new" className="home__cta">
            New Project
          </Link>
        </header>

        {fetchError && (
          <p className="home__error" role="alert">
            Could not load projects: {fetchError}. Check your Supabase
            configuration and run the migration SQL.
          </p>
        )}

        {!isSupabaseConfigured() && (
          <p className="home__error" role="alert">
            Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and
            SUPABASE_SERVICE_ROLE_KEY to .env.local.
          </p>
        )}

        {hasProjects ? (
          <ProjectList projects={projects} />
        ) : (
          !fetchError && (
            <div className="home-empty">
              <Link href="/project/new" className="home-empty__cta">
                New Project
              </Link>
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}
