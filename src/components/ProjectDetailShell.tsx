import Link from "next/link";
import "./ProjectDetailShell.css";

type Props = {
  projectName: string;
  children: React.ReactNode;
};

export function ProjectDetailShell({ projectName, children }: Props) {
  return (
    <div className="project-shell">
      <nav className="project-shell__nav" aria-label="Project">
        <Link href="/" className="project-shell__logo">
          <img
            src="/glowy_logo 1.svg"
            alt=""
            width={32}
            height={32}
            className="project-shell__logo-image"
          />
          <span className="project-shell__logo-text">Readback</span>
        </Link>

        <div className="project-shell__links">
          <Link href="/" className="project-shell__nav-link">
            Projects
          </Link>
          <span className="project-shell__project-name" title={projectName}>
            {projectName}
          </span>
        </div>
      </nav>
      <main className="project-shell__main">{children}</main>
    </div>
  );
}
