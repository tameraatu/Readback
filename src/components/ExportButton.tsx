"use client";

import { useState } from "react";
import { exportProjectDocx } from "@/lib/export-docx";
import type { Project } from "@/types";

type Props = {
  project: Project;
};

export function ExportButton({ project }: Props) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (!project.synthesis || exporting) return;
    setExporting(true);
    try {
      await exportProjectDocx(project);
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      className="project-header__btn project-header__btn--primary"
      onClick={handleExport}
      disabled={!project.synthesis || exporting}
    >
      {exporting ? "Exporting…" : "Export .docx"}
    </button>
  );
}
