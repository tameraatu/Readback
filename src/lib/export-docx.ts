import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import type { Project } from "@/types";

export async function exportProjectDocx(project: Project): Promise<void> {
  const synthesis = project.synthesis;
  if (!synthesis) return;

  const children: Paragraph[] = [
    new Paragraph({
      text: project.name,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      text: synthesis.summary,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Themes",
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  for (const theme of synthesis.themes) {
    children.push(
      new Paragraph({
        text: theme.label,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ text: theme.description }),
      ...theme.quotes.map(
        (q) =>
          new Paragraph({
            children: [new TextRun({ text: `"${q}"`, italics: true })],
            spacing: { after: 120 },
          })
      )
    );
  }

  children.push(
    new Paragraph({
      text: "Recommendations",
      heading: HeadingLevel.HEADING_1,
    })
  );

  for (const rec of synthesis.recommendations) {
    children.push(
      new Paragraph({
        text: `[${rec.priority.toUpperCase()}] ${rec.suggestion}`,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ text: rec.rationale }),
      new Paragraph({
        children: [
          new TextRun({ text: `"${rec.supportingQuote}"`, italics: true }),
        ],
        spacing: { after: 240 },
      })
    );
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${project.name.replace(/[^\w\s-]/g, "").trim() || "readback-report"}.docx`;
  saveAs(blob, filename);
}
