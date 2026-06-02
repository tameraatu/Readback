/**
 * Fetches and serializes Figma file structure for use in Claude synthesis prompts.
 * Uses the Figma REST API with a personal access token.
 */

type FigmaNode = {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
};

type FigmaFile = {
  name: string;
  document: FigmaNode;
};

export function extractFileId(figmaUrl: string): string | null {
  const match = figmaUrl.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export async function fetchFigmaStructure(figmaUrl: string): Promise<string> {
  const fileId = extractFileId(figmaUrl);
  if (!fileId) throw new Error("Invalid Figma URL");

  const res = await fetch(`https://api.figma.com/v1/files/${fileId}?depth=3`, {
    headers: { "X-Figma-Token": process.env.FIGMA_ACCESS_TOKEN ?? "" },
  });

  if (!res.ok) {
    throw new Error(`Figma API error: ${res.status} ${res.statusText}`);
  }

  const data: FigmaFile = await res.json();
  return serializeStructure(data);
}

function serializeStructure(file: FigmaFile): string {
  const lines: string[] = [`File: ${file.name}`];

  const pages = file.document.children ?? [];
  for (const page of pages) {
    lines.push(`\nPage: ${page.name}`);
    const frames = page.children ?? [];
    for (const frame of frames) {
      lines.push(`  Frame: ${frame.name}`);
      const components = frame.children ?? [];
      for (const component of components) {
        lines.push(`    Component: ${component.name} (${component.type})`);
      }
    }
  }

  return lines.join("\n");
}
