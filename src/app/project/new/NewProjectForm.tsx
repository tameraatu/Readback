"use client";

import { useMemo, useState } from "react";
import { FigmaConnector } from "@/components/FigmaConnector";
import { SynthesisResults } from "@/components/SynthesisResults";
import { TranscriptUploader } from "@/components/TranscriptUploader";
import type { AnalysisType, SynthesisOutput } from "@/types";
import "@/components/synthesis.css";

function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function NewProjectForm() {
  const [name, setName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptFileName, setTranscriptFileName] = useState<string | null>(
    null
  );
  const [figmaUrl, setFigmaUrl] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("page");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [synthesis, setSynthesis] = useState<SynthesisOutput | null>(null);

  const canSubmit =
    name.trim().length > 0 &&
    transcript.trim().length > 0 &&
    !submitting;

  const previewName = name.trim() || "Untitled project";
  const transcriptWords = useMemo(() => wordCount(transcript), [transcript]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);
    setSynthesis(null);

    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcript.trim(),
          analysisType,
        }),
      });

      const data = (await res.json()) as {
        synthesis?: SynthesisOutput;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      if (!data.synthesis) {
        throw new Error("No synthesis returned");
      }

      setSynthesis(data.synthesis);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="new-project">
      <header className="new-project__header">
        <h1 className="new-project__title">New Project</h1>
        <p className="new-project__subtitle">
          Upload your research transcript and choose how to analyze it.
          Recommendations are generated from your transcript.
        </p>
      </header>

      <div className="new-project__grid">
        <form className="new-project__form" onSubmit={handleSubmit}>
          <fieldset
            className="new-project__form-fields"
            disabled={submitting}
          >
            <div className="new-project__field">
              <label className="new-project__label" htmlFor="project-name">
                Project name
              </label>
              <input
                id="project-name"
                type="text"
                className="new-project__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Checkout usability study"
                autoComplete="off"
              />
            </div>

            <div className="new-project__field">
              <span className="new-project__label">Transcript</span>
              <TranscriptUploader
                value={transcript}
                onChange={setTranscript}
                uploadedFileName={transcriptFileName}
                onFileNameChange={setTranscriptFileName}
              />
            </div>

            <div className="new-project__field">
              <label className="new-project__label" htmlFor="figma-url">
                Figma file URL
                <span className="new-project__optional"> (optional)</span>
              </label>
              <FigmaConnector value={figmaUrl} onChange={setFigmaUrl} />
            </div>

            <div className="new-project__field">
              <span className="new-project__label" id="analysis-type-label">
                Analysis type
              </span>
              <div
                className="new-project__toggle"
                role="group"
                aria-labelledby="analysis-type-label"
              >
                <button
                  type="button"
                  className={`new-project__toggle-option${analysisType === "page" ? " new-project__toggle-option--active" : ""}`}
                  aria-pressed={analysisType === "page"}
                  onClick={() => setAnalysisType("page")}
                >
                  Page
                </button>
                <button
                  type="button"
                  className={`new-project__toggle-option${analysisType === "flow" ? " new-project__toggle-option--active" : ""}`}
                  aria-pressed={analysisType === "flow"}
                  onClick={() => setAnalysisType("flow")}
                >
                  Flow
                </button>
              </div>
              <p className="new-project__hint">
                {analysisType === "page"
                  ? "Map findings to a single page and its components."
                  : "Map findings across a multi-step flow and its pages."}
              </p>
            </div>
          </fieldset>

          {submitError && (
            <p className="new-project__submit-error" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            className="new-project__submit"
            disabled={!canSubmit}
            aria-busy={submitting}
          >
            {submitting ? "Running analysis…" : "Run Analysis"}
          </button>
        </form>

        <aside
          className={`new-project__preview${submitting ? " new-project__preview--loading" : ""}`}
          aria-live="polite"
        >
          {submitting ? (
            <div className="new-project__loading">
              <div
                className="new-project__loading-spinner"
                role="status"
                aria-label="Analyzing transcript"
              />
              <p className="new-project__loading-text">Analyzing transcript…</p>
              <p className="new-project__loading-detail">
                Claude is identifying themes and recommendations. This may take
                a minute.
              </p>
            </div>
          ) : (
            <>
              <h2 className="new-project__preview-title">Summary</h2>

              <dl className="new-project__preview-list">
                <div className="new-project__preview-item">
                  <dt>Project</dt>
                  <dd>{previewName}</dd>
                </div>

                <div className="new-project__preview-item">
                  <dt>Transcript</dt>
                  <dd>
                    {transcript.trim() ? (
                      <>
                        <span className="new-project__preview-meta">
                          {transcriptWords.toLocaleString()} words
                          {transcriptFileName
                            ? ` · ${transcriptFileName}`
                            : " · pasted"}
                        </span>
                        <p className="new-project__preview-excerpt">
                          {truncate(transcript.trim(), 280)}
                        </p>
                      </>
                    ) : (
                      <span className="new-project__preview-empty">
                        No transcript yet
                      </span>
                    )}
                  </dd>
                </div>

                <div className="new-project__preview-item">
                  <dt>Figma</dt>
                  <dd>
                    {figmaUrl.trim() ? (
                      <span className="new-project__preview-url">
                        {figmaUrl.trim()}
                      </span>
                    ) : (
                      <span className="new-project__preview-empty">
                        Not connected
                      </span>
                    )}
                  </dd>
                </div>

                <div className="new-project__preview-item">
                  <dt>Analysis</dt>
                  <dd>
                    <span
                      className={`new-project__preview-badge new-project__preview-badge--${analysisType}`}
                    >
                      {analysisType === "page"
                        ? "Page analysis"
                        : "Flow analysis"}
                    </span>
                  </dd>
                </div>

                {synthesis && (
                  <div className="new-project__preview-item">
                    <dt>Results</dt>
                    <dd>
                      {synthesis.themes.length} themes ·{" "}
                      {synthesis.recommendations.length} recommendations
                    </dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </aside>
      </div>

      {synthesis && !submitting && (
        <SynthesisResults projectName={previewName} synthesis={synthesis} />
      )}
    </div>
  );
}
