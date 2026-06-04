export type AnalysisType = "page" | "flow";

export type Theme = {
  id: string;
  label: string;
  description: string;
  quotes: string[];
  sentiment: "positive" | "negative" | "neutral";
  frequency: number;
};

export type PageRecommendation = {
  id: string;
  themeId: string;
  analysisType: "page";
  affectedPage: string;
  affectedComponents: string[];
  priority: "high" | "medium" | "low";
  suggestion: string;
  rationale: string;
  supportingQuote: string;
};

export type FlowRecommendation = {
  id: string;
  themeId: string;
  analysisType: "flow";
  affectedFlow: string;
  affectedPages: string[];
  affectedComponents: string[];
  priority: "high" | "medium" | "low";
  suggestion: string;
  rationale: string;
  supportingQuote: string;
};

export type Recommendation = PageRecommendation | FlowRecommendation;

export type SynthesisOutput = {
  analysisType: AnalysisType;
  themes: Theme[];
  recommendations: Recommendation[];
  summary: string;
};

export type Project = {
  id: string;
  user_id: string | null;
  name: string;
  figma_url: string | null;
  transcript: string;
  synthesis: SynthesisOutput | null;
  created_at: string;
};
