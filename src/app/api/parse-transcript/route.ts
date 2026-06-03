import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

const ACCEPTED_TYPES = new Set([
  "text/plain",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ACCEPTED_EXTENSIONS = [".txt", ".pdf", ".docx"];

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = extensionOf(file.name);
    if (
      !ACCEPTED_EXTENSIONS.includes(ext) &&
      !ACCEPTED_TYPES.has(file.type)
    ) {
      return NextResponse.json(
        { error: "Unsupported file type. Use .txt, .docx, or .pdf." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (ext === ".txt" || file.type === "text/plain") {
      return NextResponse.json({ text: buffer.toString("utf-8") });
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value });
    }

    if (ext === ".pdf") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return NextResponse.json({ text: result.text });
    }

    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  } catch (err) {
    console.error("[parse-transcript]", err);
    return NextResponse.json(
      { error: "Failed to parse transcript file" },
      { status: 500 }
    );
  }
}
