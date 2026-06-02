"use client";

import type { SynthesisOutput } from "@/types";

type Props = {
  synthesis: SynthesisOutput;
  format: "docx" | "markdown";
};

export function ExportButton({ synthesis, format }: Props) {
  return (
    <button type="button">
      Export as {format === "docx" ? ".docx" : "Markdown"}
    </button>
  );
}
