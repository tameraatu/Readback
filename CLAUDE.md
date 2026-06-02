Readback
Drop in your UXR transcript. Connect your Figma file. Get back specific, actionable design recommendations tied to real user quotes.


What is Readback?
Readback is a UX research-to-design synthesis tool for product designers. It takes raw UXR transcripts (interview notes, usability test recordings, survey responses) and a connected Figma file, and returns structured design recommendations grounded in specific user quotes.

It closes the gap between "we ran research" and "we know what to change in the design."


The Problem It Solves
Designers spend hours manually:

Reading through transcripts
Identifying themes and patterns
Mapping those themes to specific pages or flows (and the components within them)
Writing up recommendations for stakeholders

Readback automates steps 1–3 and structures step 4 — so designers can focus on the actual design decisions, not the synthesis overhead.


Core User Flow
Upload transcript — paste text or upload a .txt / .md file of UXR notes
Connect Figma — paste a Figma file URL; Readback reads the file structure via Figma MCP
Declare analysis type — user selects: Page analysis or Flow analysis
Run synthesis — Claude analyzes the transcript against the Figma context, using the declared analysis type as the lens
Review recommendations — structured output adapts based on analysis type (see below)
Export — download as .docx for stakeholder handoff, or markdown for Notion/personal use
Analysis Types
Page analysis — user is testing whether a single page's layout, hierarchy, or content makes sense.

Recommendations map to: page → components on that page
Example: Pricing Page → Plan cards are not visually differentiated enough

Flow analysis — user is testing whether a multi-step task or journey works end to end.

Recommendations map to: flow → pages within that flow → components on those pages
Example: Checkout Flow → Payment page → Confirmation feedback is missing


Tech Stack
Layer
Tool
Frontend
Next.js (App Router)
Styling
Tailwind CSS
AI Synthesis
Claude API (claude-sonnet-4-20250514)
Figma Integration
Figma MCP (via MCP server)
Auth & Storage
Supabase (user sessions + saved projects)
Version Control
GitHub
Dev Environment
Cursor + Claude Code
PDF Parsing
pdf-parse
DOCX Parsing
mammoth



Project Structure
readback/

├── app/

│   ├── page.tsx                  # Landing / home

│   ├── project/

│   │   ├── new/page.tsx          # New project: upload transcript + connect Figma

│   │   └── [id]/page.tsx         # Project view: recommendations output

│   └── api/

│       ├── synthesize/route.ts   # POST: runs Claude synthesis

│       └── figma/route.ts        # GET: fetches Figma file structure via MCP

├── components/

│   ├── TranscriptUploader.tsx

│   ├── FigmaConnector.tsx

│   ├── RecommendationCard.tsx

│   ├── ThemeTag.tsx

│   └── ExportButton.tsx

├── lib/

│   ├── claude.ts                 # Claude API client

│   ├── figma.ts                  # Figma MCP integration

│   └── supabase.ts               # Supabase client

├── types/

│   └── index.ts                  # Shared types

├── CLAUDE.md                     # This file

└── BRIEF.md                      # Brand + design language reference


Claude API — Synthesis Prompt Strategy
The synthesis call sends Claude:

The full UXR transcript
A structured summary of the Figma file (page names, frame names, component names)
The declared analysis type: "page" or "flow"
A system prompt instructing it to return structured JSON
Output Schema
type AnalysisType = "page" | "flow"

type SynthesisOutput = {

  analysisType: AnalysisType

  themes: Theme[]

  recommendations: Recommendation[]

  summary: string

}

type Theme = {

  id: string

  label: string

  description: string

  quotes: string[]        // verbatim from transcript

  sentiment: "positive" | "negative" | "neutral"

  frequency: number       // how many times this came up

}

// Page analysis recommendation

type PageRecommendation = {

  id: string

  themeId: string

  analysisType: "page"

  affectedPage: string          // matched to Figma page/frame name

  affectedComponents: string[]  // components on that page (supporting context)

  priority: "high" | "medium" | "low"

  suggestion: string

  rationale: string

  supportingQuote: string

}

// Flow analysis recommendation

type FlowRecommendation = {

  id: string

  themeId: string

  analysisType: "flow"

  affectedFlow: string          // name of the flow (e.g. "Checkout Flow")

  affectedPages: string[]       // pages within that flow

  affectedComponents: string[]  // components on those pages (supporting context)

  priority: "high" | "medium" | "low"

  suggestion: string

  rationale: string

  supportingQuote: string

}

type Recommendation = PageRecommendation | FlowRecommendation


Figma MCP Integration
Use the Figma MCP server to read file structure: pages, frames, components
Do NOT attempt to write back to Figma in MVP
For page analysis: extract page names and the components/frames within each page
For flow analysis: extract frame sequences that represent flows (based on prototype connections or naming conventions like "1. Login → 2. Dashboard")
Pass this structure to Claude so it can match recommendation targets to real Figma elements by name


Supabase Schema
-- Projects

create table projects (

  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users,

  name text,

  figma_url text,

  transcript text,

  synthesis jsonb,         -- stores SynthesisOutput

  created_at timestamptz default now()

);


Design Language
Colors
Token
Hex
Usage
--white
#FFFFFF
Main workspace background
--gray-50
#F7F8FA
Left nav background
--gray-100
#EDEEF2
Borders, dividers
--gray-200
#D9DBE3
Subtle borders
--gray-400
#9397A8
Placeholder, meta text
--gray-600
#5B5F72
Secondary text
--gray-900
#16181F
Primary text
--blue-50
#EEF4FF
Active state backgrounds
--blue-100
#D8E8FF
Hover states
--blue-400
#4A7FE5
Quote bar accent
--blue-500
#2F6AD9
Primary buttons, active nav
--blue-600
#1D56C4
Button hover
--green
#22C55E
Low priority, success
--green-bg
#F0FDF4
Low priority background
--yellow
#EAB308
Medium priority
--yellow-bg
#FEFCE8
Medium priority background
--red
#EF4444
High priority, error
--red-bg
#FEF2F2
High priority background

Typography
Font: Inter (all uses — headings, body, labels, mono)
Weights: 100, 200, 300, 400, 500, 600
Google Fonts import: Inter:wght@100;200;300;400;500;600

Role
Weight
Size
Page title
600
24px
Section heading
500
16px
Body
400
13–14px
Secondary / meta
400
12px
Labels / badges
500
11px
Stat numbers
600
26px

Layout
Left nav: #F7F8FA background, 220px wide
Main workspace: #FFFFFF background
Blue: accent only — buttons, active states, badges, quote bars. Never decorative.
Aesthetic
Calm, precise, tool-forward. Feels like a product designers trust, not a flashy demo. Whitespace is generous. Every element earns its place.


MVP Scope (v1)
In scope
Transcript input — paste text OR upload a .txt, .docx, or .pdf file
Figma URL input + MCP file read
Analysis type declaration — Page or Flow toggle
Claude synthesis → structured recommendations (adapts to analysis type)
Recommendation cards UI (theme + quote + page/flow + components + suggestion)
Export as .docx for stakeholder handoff
Export as markdown (secondary)
Supabase auth (email login)
Save + retrieve projects
Out of scope for v1
Audio/video transcript upload
Scanned/image-based PDF transcripts (typed PDFs are supported)
Figma write-back / annotation
Team/collaborative features
Slack or Notion export
Custom prompt tuning


Getting Started
# 1. Clone the repo

git clone https://github.com/tameraatu/Readback.git

cd readback

# 2. Install dependencies

npm install

# 3. Copy environment variables

cp .env.example .env.local

# 4. Fill in your keys in .env.local (see Environment Variables below)

# 5. Run the dev server

npm run dev

Open http://localhost:3000 to see the app.


Environment Variables
Create a .env.local file in the root with the following:

# Anthropic

ANTHROPIC_API_KEY=

# Supabase

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

# Figma

FIGMA_ACCESS_TOKEN=

⚠️ Never commit .env.local to GitHub. It is already in .gitignore.


Key Commands
# Run dev server

npm run dev

# Generate Supabase types

npx supabase gen types typescript --local > types/supabase.ts

# Install file parsing dependencies

npm install pdf-parse mammoth


Notes for Claude Code
Always use TypeScript
Prefer server components unless client interactivity is needed
API routes handle all Claude and Figma calls — never expose API keys to the client
Keep synthesis logic in lib/claude.ts, not in the route handler
Supabase client should be initialized per-request in server contexts
All color and typography tokens live in styles/tokens.css — never hardcode values
UI components live in components/ui/ — build atoms first (Button, Badge, Card, Input) before composing pages
Font is Inter at weights 100–600, imported from Google Fonts — no other fonts
Blue is an accent color only — do not use it for decorative purposes
When in doubt about a design decision, refer to the Design Language section above

