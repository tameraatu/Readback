"use client";

import { useRef, useState } from "react";

const ACCEPT = ".txt,.docx,.pdf";

type Props = {
  value: string;
  onChange: (text: string) => void;
  uploadedFileName: string | null;
  onFileNameChange: (name: string | null) => void;
};

export function TranscriptUploader({
  value,
  onChange,
  uploadedFileName,
  onFileNameChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setParsing(true);
    onFileNameChange(file.name);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "txt") {
        const text = await file.text();
        onChange(text);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-transcript", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { text?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to parse file");
      }

      onChange(data.text ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse file");
      onFileNameChange(null);
    } finally {
      setParsing(false);
    }
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  }

  function onPasteChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    if (e.target.value.trim()) {
      onFileNameChange(null);
    }
  }

  return (
    <div className="transcript-uploader">
      <textarea
        className="transcript-uploader__textarea"
        value={value}
        onChange={onPasteChange}
        placeholder="Paste your UXR transcript here…"
        rows={10}
        disabled={parsing}
      />

      <div className="transcript-uploader__divider">
        <span className="transcript-uploader__divider-line" />
        <span className="transcript-uploader__divider-text">or</span>
        <span className="transcript-uploader__divider-line" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="transcript-uploader__file-input"
        onChange={onFileInputChange}
        disabled={parsing}
      />

      <button
        type="button"
        className="transcript-uploader__upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={parsing}
      >
        {parsing ? "Parsing file…" : "Upload .txt, .docx, or .pdf"}
      </button>

      {uploadedFileName && !parsing && (
        <p className="transcript-uploader__file-name">{uploadedFileName}</p>
      )}

      {error && (
        <p className="transcript-uploader__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
