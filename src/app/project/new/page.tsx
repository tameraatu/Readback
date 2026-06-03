import { AppShell } from "@/components/AppShell";
import { NewProjectForm } from "./NewProjectForm";
import "./new-project.css";

export default function NewProjectPage() {
  return (
    <AppShell>
      <NewProjectForm />
    </AppShell>
  );
}
