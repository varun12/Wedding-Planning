# Shaadi AI — Documentation Roadmap

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada
**Purpose:** Living checklist of documentation artifacts — what exists, what's missing, and when each gap must be closed.

---

## What Exists (as of June 2026)

| Artifact | Location | Status |
|----------|----------|--------|
| Full product context, personas, features, GTM | `CLAUDE.md` | ✅ Complete |
| Product Requirements Document v2.0 | `docs/Discovery/ShaadiAI_PRD_v2.0.md` | ✅ Complete |
| Master prompt v1.0 (structure + modules) | `docs/Design/master_prompt_v1.md` | ⚠️ Pre-Lovable stack (see Gap 1) |
| Prompt variations and optimization | `docs/Development/master_prompt_v2.md` | ✅ Complete |
| AI model selection rationale | `docs/Development/model_selection.md` | ✅ Complete |
| RAG architecture and data sources | `docs/Development/RAG_architecture.md` | ✅ Complete |
| Three-tier eval framework | `docs/Development/evaluation_methods.md` | ✅ Complete |
| Eval cadence, thresholds, ship/no-ship rules | `docs/Design/evals.md` | ✅ Complete |
| Infrastructure, APIs, rate limits, monitoring, rollback | `docs/Development/infra.md` | ✅ Complete |
| Launch approach, scaling, internal communication | `docs/Development/deployment.md` | ✅ Complete |
| Data storage, privacy, RLS, encryption | `docs/Development/data_privacy.md` | ✅ Complete |
| Compliance, legal, audit, regulatory | `docs/Development/compliance.md` | ✅ Complete |
| Marketing assets, FAQ, demo script, onboarding guides | `docs/Design/marketing_assets.md` | ✅ Complete |
| User and business success metrics | `docs/Design/success_metrics.md` | ✅ Complete |
| Support channels, escalation, bug triage, feedback | `docs/Design/support.md` | ✅ Complete |
| Continuous improvement: learning loop, review cadence | `docs/Design/continuous_improvement.md` | ✅ Complete |
| Use cases | `docs/Design/use_cases.md` | ✅ Complete |
| Prototype documentation | `docs/Design/prototype.md` | ✅ Complete |
| Required input fields spec | `docs/Development/required_input_fields.md` | ✅ Complete |
| Output evaluation checklist | `docs/Development/output_evaluation_checklist.md` | ✅ Complete |
| Example data / test inputs | `docs/Development/example_data.md` | ✅ Complete |
| Screen wireframes and navigation flow | `docs/Design/Wireframes/` | ✅ Complete |
| Competitive research | `ShaadiAI_Competitive_Research.docx` | ⚠️ .docx format only (see Gap 8) |

---

## Gaps — Prioritized by When They Must Be Closed

### Tier 1: Before Capstone Submission (June 15, 2026)

#### Gap 1: Live Prompt Documentation (v3.0)
**What's missing:** `master_prompt_v1.md` was written for the Bubble stack. The actual production prompts running in `analyze-contract` and `draft-response` edge functions (Claude API format, updated June 2026) are only in the edge function code — not versioned in `docs/`.

**Why it matters for capstone:** The capstone evaluates the AI system design. The actual prompts powering the demo are the core artifact. If they exist only in Lovable-deployed code, they can't be cited or demonstrated without running the app.

**What to build:** `docs/Development/master_prompt_v3.md` — the actual production system prompt and task modules as deployed in June 2026, with version log and rationale for key decisions.

---

#### Gap 2: System Architecture Overview
**What's missing:** No single document maps the complete request lifecycle: `[User uploads PDF] → [Frontend] → [Supabase Storage] → [analyze-contract edge function] → [Anthropic API] → [Supabase DB] → [Frontend renders summary]`. `infra.md` describes components; `RAG_architecture.md` covers data strategy — but neither shows the unified data flow.

**Why it matters for capstone:** Reviewers need a clear picture of how the system fits together end-to-end. This is the most commonly requested artifact in technical evaluations.

**What to build:** `docs/Development/architecture.md` — system diagram (text-based), component responsibilities, data flow per feature, and the Lovable/Supabase/Anthropic integration topology.

---

### Tier 2: Before V1 Public Launch (July 2026)

#### Gap 3: Database Schema Reference
**What's missing:** The 11-table schema lives in `app/src/integrations/supabase/types.ts` (TypeScript interfaces) and in Supabase migrations. There's no human-readable reference explaining what each table stores, how tables relate to each other, which RLS policies apply, and what constraints enforce data integrity.

**Why it matters:** Any engineer, new hire, or Lovable AI session that touches the database needs to understand the schema without reverse-engineering TypeScript. Also required for the Data Processing Agreement (DPA) template in the compliance roadmap.

**What to build:** `docs/Development/database_schema.md` — table-by-table reference with columns, relationships, RLS policy summary per table, and key constraints.

---

#### Gap 4: Edge Function API Contracts
**What's missing:** No specification documents what `analyze-contract` and `draft-response` accept (request body schema) and return (response body schema). This is currently only discoverable by reading the edge function code.

**Why it matters:** Required if a second frontend (mobile app, V2 redesign) or external integration ever needs to call these functions. Also ensures any prompt change doesn't silently break the response schema the frontend depends on.

**What to build:** `docs/Development/edge_function_contracts.md` — request schema, response schema, error codes, and example request/response payloads for both functions.

---

#### Gap 5: Engineer Onboarding Guide
**What's missing:** `CLAUDE.md` is optimized for Claude Code sessions. There's no guide for a human engineer joining the project — covering local development setup, the Lovable vs. `Wedding-Planning/app/` repo relationship, required environment variables, how to run tests, and known gotchas (e.g., can't use Supabase CLI to deploy edge functions directly).

**Why it matters:** Without this, the first hire spends days reverse-engineering the setup. It also captures decisions that seem obvious today but won't be in 6 months (e.g., why edge functions are deployed through Lovable chat, not CLI).

**What to build:** `docs/Development/engineer_onboarding.md` — dev environment setup, repo structure, deployment workflow, env var reference, and known gotchas.

---

#### Gap 6: Golden Test Set (Actual Contracts)
**What's missing:** `evals.md` and `evaluation_methods.md` specify the eval framework. `example_data.md` has sample data. But the actual golden test set — real or synthetic contracts with annotated expected outputs for each module — doesn't exist as a documented artifact. The eval system cannot run without it.

**Why it matters:** This is the single most important pre-launch item for AI quality assurance. Without a validated test set, eval scores are meaningless. Target: 15+ contracts before capstone, 30+ before public launch, covering all 5 vendor categories and 2+ cultural variations.

**What to build:** A `docs/Design/golden_test_set/` directory containing: contract inputs (anonymized), expected Module A summaries, expected Module B flags with ratings, expected Module D obligations. Track source (real vs. synthetic) and which cultural/vendor variation each contract covers.

---

#### Gap 7: Financial Model
**What's missing:** CLAUDE.md has 6-month MRR projections and unit economics approximations. No document shows the underlying model: API cost per tier at different usage volumes, Supabase cost at 50/200/500 planners, CAC assumptions, LTV model with retention curve, break-even analysis, and capital efficiency.

**Why it matters:** Required for investor conversations, hiring timing decisions, and spend cap calibration. Also determines when to upgrade the Supabase plan and Anthropic tier.

**What to build:** `docs/Discovery/financial_model.md` — unit economics model, cost projections at three scale points (Phase 1 / Phase 2 / 12 months), break-even analysis, and key assumptions documented.

---

### Tier 3: Before V2 Planning (Q3–Q4 2026)

#### Gap 8: Competitive Intelligence in Markdown
**What's missing:** `ShaadiAI_Competitive_Research.docx` exists but is a binary file — unsearchable, not version-controlled meaningfully, and not accessible in Claude Code sessions.

**Why it matters:** Competitive positioning should be re-evaluated quarterly. Having it in markdown makes it updatable and referenceable in future sessions without manual extraction.

**What to build:** Convert to `docs/Discovery/competitive_research.md` — capability matrix, threat level assessments, quarterly review notes.

---

#### Gap 9: V2 Product Roadmap
**What's missing:** V2 out-of-scope items are listed in CLAUDE.md and PRD. No standalone document sequences and prioritizes them — multilingual support, vendor marketplace, OCR for scanned PDFs, native mobile app, automation integrations — with rationale for ordering.

**Why it matters:** V2 planning starts from beta feedback. Having a structured roadmap doc makes it easy to update priorities based on what the first 20 planners actually ask for.

**What to build:** `docs/Discovery/v2_roadmap.md` — V2 feature candidates with prioritization rationale, dependency map, and estimated scope. Updated after each monthly review.

---

#### Gap 10: Vendor Norm Benchmarks
**What's missing:** `RAG_architecture.md` defines the plan to collect 50+ contracts and build Indian wedding vendor market norm benchmarks. These benchmarks are what Module B's traffic light flagging is judged against. They don't yet exist as a documented artifact.

**Why it matters:** Without defined benchmarks, Module B flags are based on Claude's training knowledge — which is unvalidated for Indian wedding vendors in North America. Defined benchmarks are required for accurate evals and for the "Is this normal?" explainer feature.

**What to build:** `docs/Design/vendor_norm_benchmarks.md` — per-vendor-category documentation of normal vs. unusual terms: payment schedule norms, cancellation policy norms, overtime rate norms, exclusivity clause norms. Built from collected contracts; updated as more contracts are analyzed.

---

## Summary Checklist

| Gap | Artifact | Priority | Target Date |
|-----|----------|----------|-------------|
| 1 | Live Prompt Documentation v3 | 🔴 Capstone | June 15, 2026 |
| 2 | System Architecture Overview | 🔴 Capstone | June 15, 2026 |
| 3 | Database Schema Reference | 🟡 V1 Launch | July 2026 |
| 4 | Edge Function API Contracts | 🟡 V1 Launch | July 2026 |
| 5 | Engineer Onboarding Guide | 🟡 V1 Launch | July 2026 |
| 6 | Golden Test Set (actual contracts) | 🔴 Pre-Launch | July 2026 |
| 7 | Financial Model | 🟡 V1 Launch | July 2026 |
| 8 | Competitive Intelligence → Markdown | 🟢 V2 Planning | Q3 2026 |
| 9 | V2 Product Roadmap | 🟢 V2 Planning | Q3 2026 |
| 10 | Vendor Norm Benchmarks | 🟢 V2 Planning | Q3 2026 |
