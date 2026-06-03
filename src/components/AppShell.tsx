import Link from "next/link";
import "./AppShell.css";

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="app-shell">
      <nav className="app-nav" aria-label="Main">
        <Link href="/" className="app-logo">
          <img
            src="/glowy_logo 1.svg"
            alt=""
            width={32}
            height={32}
            className="app-logo-image"
          />
          <span className="app-logo-text">Readback</span>
        </Link>
        <Link href="/project/new" className="app-nav-button">
          New Project
        </Link>
      </nav>
      <main className="app-workspace">{children}</main>
    </div>
  );
}
