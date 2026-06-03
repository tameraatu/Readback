import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import "./home.css";

export default function Home() {
  return (
    <AppShell>
      <div className="home-empty">
        <h1 className="home-empty__title">Create your first project</h1>
        <p className="home-empty__description">
          Upload a UXR transcript, connect your Figma file, and get design
          recommendations grounded in real user quotes.
        </p>
        <Link href="/project/new" className="home-empty__cta">
          New Project
        </Link>
      </div>
    </AppShell>
  );
}
