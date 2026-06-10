# Shaadi AI — Continuous Improvement: Learning, Review, and System Updates

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada

---

## Overview

Continuous improvement at Shaadi AI operates as a closed loop across three layers:
1. **Collect** — surface signals from users, evals, and system logs
2. **Review** — analyze signals on a structured cadence; distinguish product issues from AI quality issues from operational issues
3. **Update** — ship changes safely with validation gates; measure whether the change improved the signal that triggered it

---

## 1. Learning Collection — What Signals We Gather and Where

### In-product signals (passive — no user action required)

| Signal | Source | What It Tells Us |
|--------|--------|-----------------|
| Contract summary star rating (1–5) | Post-analysis rating UI | Overall accuracy and usefulness of Module A + B |
| Per-flag thumbs-up/down | Inline flag rating in contract summary | Clause-level accuracy of Module B |
| Response draft edit rate | Tracked when user edits before copying | Module C tone and specificity match |
| Obligation tracker empty after signing | DB: obligation count = 0 | Module D extraction failure (silent) |
| Contract analysis completion rate | DB: analyses completed vs. uploads started | Upload friction or PDF extraction failures |
| Session length after first contract | Analytics | Whether onboarding converts to ongoing use |
| Couple dashboard activation rate | DB: couple accounts created per wedding | Whether dual-user model is actually being used |

### User-reported signals (active)

| Channel | Signal Type | Cadence |
|---------|------------|---------|
| In-app open-text feedback (post-analysis) | Qualitative — specific output issues, missing features, praise | Continuous |
| Beta planner WhatsApp/Slack group | Qualitative — friction, workflow gaps, trust issues | Ongoing during Phase 1 |
| Support tickets (Phase 2) | Bug reports, AI accuracy complaints, feature requests | Continuous |
| Monthly NPS survey | Satisfaction + referral intent + open-text | Monthly from Month 2 |
| Scheduled user interviews | Deep qualitative — jobs to be done, workflow gaps | ≥ 3 planners + 3 couples before launch; quarterly post-launch |

### Formal AI quality signals (eval system)

The three-tier eval system (automated scripts, model-graded review, human review) runs on a scheduled cadence against a golden test set of real contracts. See `docs/Design/evals.md` for full methodology.

| Trigger | Modules Evaluated | Output |
|---------|------------------|--------|
| Weekly (beta) | A (summary), B (flags) | Pass/fail per benchmark; trend vs. prior week |
| Monthly (post-launch) | Full suite (all 8 modules) | Aggregate score per module; delta vs. baseline |
| Any prompt change | Affected module(s) | Must pass before deployment |
| Any Claude model version upgrade | Full suite | Must pass before switching model in production |
| AI accuracy support ticket confirmed | Affected module | Triggered immediately; determines root cause |

### Operational signals (infrastructure layer)
See `docs/Development/infra.md` Section 7. Covers edge function error rates, latency trends, API cost, and rate limit proximity. Operational signals feed the improvement loop only when they reveal user-facing degradation (e.g., high latency → users abandoning analyses → lower completion rate).

---

## 2. Review Cadence — When and How We Analyze

### Weekly (during beta — Phases 1 and 2)
**Who:** Founder
**Time:** ~2 hours each week

1. Run Modules A and B evals against golden test set (5 contracts)
2. Review all in-app feedback and support tickets from the week
3. Review in-app quality ratings — flag any module averaging < 3.5
4. Check Supabase logs for error spikes; check Anthropic cost trend
5. Identify top 3 friction points; map each to: prompt fix / feature fix / onboarding fix / known gap
6. Update beta planner Slack/WhatsApp group with what shipped and what's coming

**Output:** Weekly issue log entry. P0/P1 bugs triaged immediately. Product backlog updated.

### Monthly (Phase 2 and beyond)
**Who:** Founder (+ customer success hire by Month 3)
**Time:** ~4 hours per month

1. Run full eval suite (all 8 modules) against golden test set
2. Review aggregate in-app quality ratings; compare to prior month
3. Review all support ticket themes; identify top 3 recurring issues
4. Review NPS responses; read all open-text comments
5. Map top 3 friction points and top 3 praise themes to product decisions
6. Assess prompt performance trend — is accuracy holding, improving, or degrading?
7. Check if any new contracts should be added to the golden test set (edge cases uncovered)
8. Assess whether rate limits, spend caps, or Supabase plan upgrades are needed

**Output:** Monthly review doc (shared with any investors or advisors). Product backlog prioritization refreshed. Prompt version decision: hold / update / escalate.

### Quarterly
**Who:** Founder
**Time:** ~1 day per quarter

1. Aggregate trend analysis across all metrics (see `docs/Design/success_metrics.md`)
2. Assess product-market fit signals: retention curves, NPS trend, engagement depth
3. Review competitive landscape — has BollyWeds or The Knot shipped anything relevant?
4. Define V2 priorities based on recurring friction and unmet need patterns
5. Review and update golden test set — add new contracts, remove outdated ones
6. Review compliance roadmap progress (see `docs/Development/compliance.md`)

**Output:** Quarterly roadmap update. V2 scoping input.

---

## 3. System Update Process — How Changes Are Made Safely

Different types of changes follow different update paths. The shared principle: **no change that affects AI output quality ships without an eval gate**.

### Prompt Updates

Prompts are the most impactful and most fragile part of the system. A prompt change that improves one module can degrade another.

**Update process:**
1. Identify the specific module and benchmark failing (from evals or support tickets)
2. Draft prompt change — target the specific failure; don't rewrite unrelated sections
3. Run affected module's eval suite against the updated prompt
4. If score improves and no regressions: deploy to Supabase edge function via Lovable
5. Run smoke test (one real contract end-to-end) to confirm production behavior
6. Log the change in prompt version history (see Section 4 below)
7. Monitor in-app quality ratings for the following week to confirm improvement in production

**Rule:** No prompt change ships without passing its module eval. A fix that skips evals risks introducing a new regression while fixing the reported issue.

### Feature Updates (frontend / backend)

Standard dev cycle: Lovable chat → review → test → deploy.

For AI-adjacent features (anything that touches the contract analysis flow, obligation tracker, or response drafting):
- Test end-to-end with a real contract before confirming deployment
- Check Supabase logs for errors after first production use

For non-AI features (guest list, budget tracker, dashboard):
- Standard functional test; no eval gate required

### Model Upgrades (new Claude version)

When Anthropic releases a new Claude model version:
1. Run full eval suite against the new model (identical prompts, same golden test set)
2. Compare scores across all 8 modules vs. current baseline
3. If scores hold or improve across all modules: update model ID in edge functions
4. If any module degrades: investigate — may need prompt adjustment before switching
5. Deploy on a non-demo day; monitor logs and ratings for 48 hours after switching

**Do not upgrade the model immediately on release.** Run evals first. Model behavior can shift even with identical prompts.

### Golden Test Set Expansion

The golden test set is the foundation of the eval system. It should grow over time to cover more edge cases.

Add a contract to the golden test set when:
- A support ticket reveals an edge case not currently covered (e.g., a vendor clause type we've never seen)
- A new cultural variation of a wedding vendor contract surfaces (e.g., mandap rental with non-standard cancellation structure)
- A user reports a miss that evals would have caught — the test set should have caught it

Review and prune the golden test set quarterly — remove contracts that are no longer representative or that test cases already well-covered by multiple other examples.

---

## 4. Prompt Version Management

Prompts are treated like code — versioned, documented, and tested before deployment.

### Version log format

Each prompt update is logged with:
- **Version number** (e.g., v1.0 → v1.1)
- **Date deployed**
- **Module(s) affected**
- **Change summary** (what changed and why — which failure mode triggered it)
- **Eval scores before and after** (per affected module)
- **Deployed by**

Master prompts are stored in `docs/Design/` — the edge function prompts should stay in sync with the versioned docs.

### Rollback
If a deployed prompt change causes in-production quality degradation (rating drops, support tickets spike):
1. Revert the edge function to the previous prompt version via Lovable
2. Run a smoke test to confirm the rollback worked
3. Investigate root cause before attempting the change again

---

## 5. Closing the Loop — How Signals Feed Back Into the System

The improvement loop only works if signals reliably drive changes and changes are measured against the original signal.

| Signal Source | → | Action Type | → | Measured By |
|--------------|---|------------|---|------------|
| Eval failure (module score below threshold) | → | Prompt update | → | Eval score improvement |
| Support ticket: AI missed a clause | → | Prompt update + golden test set expansion | → | Eval coverage + ticket recurrence |
| Support ticket: feature friction (≥ 3 reports) | → | Product backlog item | → | Support ticket volume for that issue |
| In-app rating drops below 3.5 weekly average | → | Immediate eval run on affected module | → | Rating recovery over next 2 weeks |
| NPS comment: "I love the flags but..." | → | Product backlog (feature enhancement) | → | NPS score + engagement metric |
| Passive: high draft edit rate | → | Module C prompt review | → | Edit rate drop after fix |
| Passive: low obligation tracker adoption | → | UX investigation (discoverability vs. trust) | → | Obligation tracker activation rate |

**Rule:** For every change shipped in response to a signal, define in advance which metric you're trying to move and check it at the next weekly review.

---

## 6. Cultural Intelligence — A Compounding Moat

Cultural intelligence is Shaadi AI's primary long-term differentiator. It deepens with every wedding processed.

**How it compounds over time:**
- **Contract norm benchmarks** improve as more real contracts are processed → traffic light flag accuracy increases
- **Vendor category coverage** expands as more obscure roles (dhol player, saree draper, makeup artist for mehndi) appear in contracts
- **Regional variations** (Gujarati, Tamil, Sikh) surface through support tickets and user interviews → cultural setup interview improves
- **Edge case library** grows as every unusual clause becomes a golden test set addition

**How to actively build it:**
- Log every new vendor category or cultural variation that surfaces in a contract as a potential golden test set addition
- Use monthly user interviews to specifically probe: "Was there anything culturally specific about your wedding that the platform didn't handle well?"
- Track flag accuracy separately by wedding type (Hindu North Indian vs. Punjabi Sikh vs. Tamil vs. interfaith) to identify cultural gaps in the model

---

## 7. What Good Looks Like at 6 Months Post-Launch

| Dimension | Target State |
|-----------|-------------|
| Eval scores | All 8 modules at or above baseline; no module degrading month-over-month |
| In-app quality rating | ≥ 4.2 average; trending up or stable |
| Support ticket AI accuracy rate | < 5% of contract reviews generating an accuracy complaint |
| Prompt version | At least 2 iterations shipped with documented improvement |
| Golden test set | ≥ 30 contracts (up from 5 at launch), covering ≥ 3 cultural variations and ≥ 4 vendor categories |
| NPS | > 50; open-text themes skewing toward accuracy and time-saved |
| Feedback-to-product pipeline | Top 3 friction points from Month 1 resolved or in progress by Month 3 |
