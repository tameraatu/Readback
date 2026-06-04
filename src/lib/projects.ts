import { createServerClient } from "@/lib/supabase";
import type { Project, SynthesisOutput } from "@/types";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getProjects(): Promise<Project[]> {
  const db = createServerClient();
  const { data, error } = await db
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = createServerClient();
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Project | null) ?? null;
}

export async function saveProject(input: {
  name: string;
  transcript: string;
  figmaUrl?: string;
  synthesis: SynthesisOutput;
}): Promise<Project> {
  const db = createServerClient();
  const { data, error } = await db
    .from("projects")
    .insert({
      name: input.name.trim(),
      transcript: input.transcript.trim(),
      figma_url: input.figmaUrl?.trim() || null,
      synthesis: input.synthesis,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}
