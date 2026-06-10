# Shaadi AI — Prompt Evaluation Framework

**Author:** Varun Maryada
**Version:** 2.0
**Date:** April 2026
**Applies to:** Master Prompt v1.0 — all 8 task modules (A–H)

> **What changed in v2.0:** This version adds a Phase Applicability section that maps every benchmark to its required pass gate — MVP Prototype (April 2026), V1 Product Launch (July 2026), or V2+. All benchmarks are retained from v1.0, but modules E, F, G, and H are explicitly deferred to V1. A new Confirmed Failures section documents the 4 blocking failures found in the first eval run (April 4, 2026). Two reliability concerns and two prompt design gaps from that run are also recorded. The Known Limitations section is updated to reflect current evidence.

---

## AI Performance Measurement — Summary

### What is measured
AI performance is evaluated across five dimensions:

| Dimension | What It Covers | Key Benchmark |
|-----------|---------------|---------------|
| **Accuracy** | Do contract summaries and flags correctly reflect the source document? | Module A (clause coverage ≥ 4.0/5), Module B (flag accuracy ≥ 4.0/5, missed RED ≤ 5%) |
| **Hallucination avoidance** | Does the AI invent facts not present in the contract? | U3 — 100% pass rate, zero tolerance |
| **Cultural correctness** | Are Indian wedding vendor norms, event types, and cultural terms used accurately? | Module B (market norm benchmarks), Module H (cultural accuracy ≥ 4.0/5) |
| **Output quality** | Is the output clear, send-ready, and at the right reading level? | Module A (8th-grade reading level), Module C (send-readiness ≥ 2.5/3) |
| **Reliability** | Does the AI behave consistently across repeated runs? | C3 style adherence tested ≥ 5 runs; B2 false negative rate tracked over time |

### How it is measured — three-tier system
- **Tier 1 — Automated scripts (40% of coverage):** JSON schema validation, field presence checks, date math verification, risk score consistency rules, string matching for disclaimer presence. Fast, free, runs on every eval.
- **Tier 2 — Model grader (45% of coverage):** A second Claude call evaluates the output against rubric criteria. Used for reading level scoring, tone classification, clause specificity. Scales without human time.
- **Tier 3 — Human review (15% of coverage):** Required for flag accuracy (B1), cultural accuracy (H2), and anything involving Indian wedding domain knowledge that a model cannot reliably self-evaluate.

### When evals run — trigger-based cadence
- Before every demo or launch gate (MVP, V1)
- Before any prompt change goes to production
- Every 25 contracts added to the benchmark library (Module B only)
- Weekly during private beta (Modules A and B)
- Monthly post-launch (full suite)
- Immediately before any Claude model version upgrade

### Targets that define "good enough to ship"
- Missed RED flags (false negative rate): ≤ 5% — the single most critical metric
- Contract summary accuracy: ≥ 90% of key sections correctly extracted (human review)
- Risk score alignment with human assessment: ≥ 85%
- Hallucination: 0% — any invented clause is a blocker
- Legal disclaimer present: 100% — zero tolerance

---

## Purpose

This document defines what "good" looks like for every AI output in Shaadi AI. It is the benchmark used to:
- Validate the prompt before each launch gate
- Detect regressions when the prompt is updated
- Score outputs during human review sessions
- Prioritize prompt improvement work by failure mode

Evaluations are run on a **golden test set** — a fixed collection of realistic inputs with known expected outputs. The golden set is maintained in `Design/use_cases.md` and `Development/example_data.md`.

---

## Phase Applicability

The PRD v2.0 (Section 3) defines three build horizons with distinct definitions of done. Evals are gated accordingly.

| Phase | Timeline | Definition of Done | Modules in Scope |
| --- | --- | --- | --- |
| **MVP Prototype** | April 25, 2026 | End-to-end contract review flow works live in a demo. Validated by 3 planners + 3 couples. | **A, B, C, D** (fully functional AI) |
| **V1 Product Launch** | July 2026 | All core features functional. Paid tiers live. 3 cities active. | **A, B, C, D, E, F, G, H** (all modules) |
| **V2+** | Aug 2026+ | Defined during V1 retrospective. | Multilingual, mobile, marketplace |

### What This Means for Eval Gating

**MVP:** Modules A, B, C, and D are fully functional AI features in the prototype. All benchmarks for these modules must pass before the April 25 demo. Modules E, F, G, and H are **mocked or simplified** in the MVP (per PRD Section 3.3) — their evals are tracked but are not demo blockers.

**V1 Launch:** All 8 modules must pass their benchmarks before the July 2026 public launch. Any issues identified in mocked modules during MVP testing must be resolved before V1.

**V2+:** No new eval benchmarks are defined at this stage. Multilingual support and mobile-specific behavior will require new benchmark additions at that time.

### Quick-Reference: Benchmark Phase Map

| Module | Benchmarks | Required for MVP | Required for V1 |
| --- | --- | --- | --- |
| Universal | U1, U2, U3, U4, U5 | Yes — for A, B, C, D | Yes — for all modules |
| A — Contract Summary | A1, A2, A3, A4 | **Yes** | Yes |
| B — Clause Flagging | B1, B2, B3, B4 | **Yes** | Yes |
| C — Response Drafting | C1, C2, C3, C4 | **Yes** | Yes |
| D — Obligation Extraction | D1, D2, D3 | **Yes** | Yes |
| E — Vendor Outreach | E1, E2, E3 | No (mocked) | **Yes** |
| F — Budget Advisor | F1, F2, F3 | No (mocked) | **Yes** |
| G — Guest List Import | G1, G2, G3 | No (mocked) | **Yes** |
| H — Cultural Setup | H1, H2, H3 | No (simplified) | **Yes** |

---

## Confirmed Failures — Eval Run v1.0 (April 4, 2026)

Eight test cases were run against master_prompt_v1.0. Four blocking failures were identified. All four are prompt design issues — not model judgment failures. Full run details in `Development/example_data.md`.

### Blocking Failures

| # | Failure | Benchmark | Test Case | Root Cause | Phase Gate |
| --- | --- | --- | --- | --- | --- |
| F-R1 | Module D output schema has no `disclaimer` field | U5 | TC-4 (D-S1) | Prompt says "Append to all contract modules (A, B, C, D)" but Module D's JSON schema omits the field. Model correctly follows the schema and produces valid JSON with no disclaimer. | **MVP blocker** |
| F-R2 | `family_side: "bride"` invented from session context | G2 | TC-5 (G-E1) | Model populated `family_side` by inferring from "Priya" appearing in session context (planner name), treating her as the bride. Raw input doesn't state family side. | V1 blocker |
| F-R3 | Granthi missing from Anand Karaj vendor checklist; "halal" applied to Sikh wedding | H2 | TC-6 (H-S2) | Two separate issues: (1) officiant completeness gap — most important vendor for ceremony omitted; (2) cultural knowledge failure — "halal" is an Islamic dietary term misapplied to a Sikh context. Output scores 3/5, below ≥4.0 threshold. | V1 blocker |
| F-R4 | Budget reallocation proposed from a category with $0 slack | F2 | TC-8 (F-S1) | Prompt doesn't instruct the model to validate `(budgeted − actual) > 0` before naming a reallocation source. Model treats the budgeted amount as the availability ceiling, ignoring actual spend. | V1 blocker |

### Required Fixes Before MVP (F-R1)

1. **Add \****`disclaimer`**\*\* field to Module D output schema.** One-line fix. Module D must include `"disclaimer": "This analysis is for informational purposes only and is not legal advice. Have a qualified attorney review any contract before signing."` as the final field.

### Required Fixes Before V1 Launch (F-R2, F-R3, F-R4)

2. **Add rule to Module G:** `"Only populate family_side when explicitly stated in the raw input text. Do not infer family_side from session context, planner names, or relationship terms."` Correct output for "Rahul (Priya's cousin)" is `family_side: "unknown"` with a note asking the couple to confirm.

3. **Add Granthi explicitly to Anand Karaj vendor checklist in Module H.** Add a cultural knowledge block to the system prompt enumerating correct officiants by tradition: Granthi (Sikh), Pandit (Hindu), both for interfaith. Remove "halal" from Sikh dietary guidance — correct framing is vegetarian (and in some families, no beef or alcohol in Gurdwara contexts).

4. **Add slack-validation instruction to Module F.** Before recommending reallocation, the model must check: `available_slack = budgeted − actual`. Only categories where `available_slack > 0` are eligible sources. Add this rule explicitly to the Module F task description.

### Reliability Concerns (Passed in this run — not yet validated at threshold)

| Concern | Test Case | Risk |
| --- | --- | --- |
| Conflicting clause handling (A-E2): correct behavior depends on general uncertainty-flagging, not a specific prompt rule | TC-2 | Under prompt variation V8 (replacing explicit rules with general judgment), this case is at elevated risk of silently resolving the conflict. Add to regression suite with explicit pass/fail assertion before any system prompt changes. |
| Style profile "never start with I" (C-E1): constraint drifts at temperature 0.7 | TC-3 | Single-run pass ≠ ≥90% threshold for C3. Must be run 5+ times to establish reliability. |

---

## Evaluation Philosophy

Two types of quality matter for Shaadi AI:

**Objective quality** — Is the output correct, complete, and well-formed? These criteria have clear right/wrong answers and can be partially automated (JSON schema validation, field presence checks, date math verification).

**Subjective quality** — Does it read well? Does it sound like the right persona? Is it culturally accurate? These require a human reviewer familiar with Indian weddings and the Shaadi AI product.

All modules are scored on both dimensions. The minimum acceptable score to ship is defined per module below.

---

## Universal Benchmarks (All Modules)

These apply to every API call, regardless of task.

> **Phase note:** At MVP, universal benchmarks apply to Modules A–D only. At V1 launch, they apply to all 8 modules.

### U1 — Format Compliance
**Definition:** The output parses without errors as valid JSON (for modules A–G) or follows the defined conversational structure (module H).

| Score | Criteria |
| --- | --- |
| Pass | JSON is valid and parseable; all required top-level keys present |
| Fail | JSON is invalid, malformed, or contains text outside the JSON block |

**Automated:** Yes — run `JSON.parse()` on output; validate against schema.
**Threshold:** 100% pass rate. Zero tolerance. A malformed JSON breaks the Make automation pipeline.

---

### U2 — Field Completeness
**Definition:** All required fields in the output schema are present and non-empty. Fields may contain "Not specified in contract" or equivalent — but must not be null, missing, or empty string unless explicitly permitted.

| Score | Criteria |
| --- | --- |
| Pass | All required fields present with meaningful content |
| Partial | 1 optional field missing or empty |
| Fail | Any required field is null, missing, or an empty string |

**Automated:** Yes — check key presence and non-null values against schema.
**Threshold:** ≥ 95% full Pass. No Fail on required fields.

---

### U3 — Hallucination Avoidance
**Definition:** The output does not invent facts that are not present in the input. This includes: clauses not in the contract, vendor names, specific dollar amounts not stated, specific dates not calculable from the input, or invented market statistics.

| Score | Criteria |
| --- | --- |
| Pass | All factual claims traceable to input text or well-established general knowledge |
| Fail | Any invented clause, dollar figure, vendor detail, or fabricated statistic |

**Automated:** Partially — spot-check specific fields (amounts, dates) against input.
**Human review:** Required for market norm benchmarks and cultural notes.
**Threshold:** 100% pass rate. A hallucinated clause in a contract summary is a critical failure.

---

### U4 — Scope Discipline
**Definition:** The output addresses only the requested task. It does not volunteer unsolicited analysis, additional features, or content outside the task module's defined scope.

| Score | Criteria |
| --- | --- |
| Pass | Output contains only what the task schema requires |
| Fail | Output includes unrequested analysis, warnings, or content from another module |

**Automated:** No — requires human review.
**Threshold:** ≥ 95% pass rate.

---

### U5 — Disclaimer Presence (Contract Modules A, B, C, D only)
**Definition:** The legal disclaimer appears verbatim at the end of any contract-related output.

Expected text:
> "This analysis is for informational purposes only and is not legal advice. Have a qualified attorney review any contract before signing."

| Score | Criteria |
| --- | --- |
| Pass | Disclaimer present verbatim in the `disclaimer` field |
| Fail | Disclaimer missing, truncated, or paraphrased |

**Automated:** Yes — exact string match.
**Threshold:** 100% pass rate. Non-negotiable legal requirement.

> **Known failure — F-R1:** Module D's output schema was missing the `disclaimer` field in master_prompt_v1.0. Confirmed fail on TC-4. Fix must be applied before MVP demo.

---

## Module-Specific Benchmarks

---

### Module A — Contract Plain-Language Summary `[CAPSTONE]`

> **Phase:** Required for MVP demo (April 25, 2026). Must pass all benchmarks on the demo contract set before live presentation.

#### A1 — Clause Coverage (Accuracy)
**Definition:** Every clause present in the source contract is reflected in the correct summary field. No clause is silently omitted.

**How to test:** Human reviewer reads the source contract and checks each of the 8 fields. Any clause present in the contract but absent from the output = fail.

| Score | Criteria |
| --- | --- |
| 5 | All clauses captured; each field accurate to source |
| 4 | All clauses captured; 1 minor inaccuracy in phrasing |
| 3 | 1 clause missed or significantly misrepresented |
| 2 | 2 clauses missed or misrepresented |
| 1 | 3+ clauses missed; output is not reliable |

**Threshold:** Average ≥ 4.0 across golden test set. No output scoring 1 or 2 permitted.

---

#### A2 — Reading Level (Clarity)
**Definition:** Plain-language summaries are written at or below an 8th-grade reading level, as defined by the Flesch-Kincaid Grade Level score.

**How to test:** Run `payment_schedule`, `cancellation_policy`, and `force_majeure` fields through a Flesch-Kincaid calculator.

| Score | Criteria |
| --- | --- |
| Pass | FK Grade Level ≤ 8.0 |
| Marginal | FK Grade Level 8.1–10.0 |
| Fail | FK Grade Level > 10.0 |

**Threshold:** ≥ 90% Pass; no Fail permitted on the cancellation_policy field (highest user impact).

---

#### A3 — "Not Specified" Accuracy
**Definition:** When a clause is genuinely absent from the contract, the field correctly states "Not specified in contract" rather than fabricating a value or leaving the field blank.

| Score | Criteria |
| --- | --- |
| Pass | Missing clause correctly identified and labeled |
| Fail | Missing clause either fabricated or left empty |

**Automated:** Partially — compare fields against contracts known to lack certain clauses.
**Threshold:** 100% pass rate.

---

#### A4 — One-Sentence Summary Quality
**Definition:** The `one_sentence_summary` field is ≤ 30 words, captures the essential nature of the contract, and is understandable to a non-expert in 10 seconds.

| Score | Criteria |
| --- | --- |
| 3 | ≤ 30 words; captures vendor, event, and the most critical term (e.g., payment structure or key restriction) |
| 2 | ≤ 30 words; accurate but generic — could apply to any contract |
| 1 | > 30 words, or inaccurate, or meaningless |

**Threshold:** Average ≥ 2.5 across golden test set.

---

### Module B — Traffic Light Clause Flagging `[CAPSTONE]`

> **Phase:** Required for MVP demo (April 25, 2026). The highest-stakes benchmark in the system — a missed RED flag gives a user false confidence before signing a high-risk contract.

#### B1 — Flag Accuracy (vs. Expert Reviewer)
**Definition:** Each flag rating (GREEN / YELLOW / RED) matches the rating assigned by a human expert reviewer with Indian wedding contract experience. This is the most critical eval in the entire system.

**How to test:** Human reviewer (someone with real Indian wedding planner or legal experience) independently rates each clause in the golden contract set. Compare to AI output.

| Score | Criteria |
| --- | --- |
| 5 | AI rating matches expert on all clauses |
| 4 | AI rating off by one level on 1 clause (e.g., YELLOW vs. GREEN) |
| 3 | AI rating off by one level on 2 clauses |
| 2 | AI misses a RED flag (most serious failure mode) |
| 1 | AI misses 2+ RED flags |

**Threshold:** Average ≥ 4.0. Score of 1 or 2 is a critical failure — the product cannot ship until resolved.

---

#### B2 — False Negative Rate (Missed RED Flags)
**Definition:** Percentage of RED clauses present in the source contract that the AI correctly identifies as RED.

This is tracked separately from B1 because missing a RED flag is asymmetrically harmful — it gives the user false confidence.

| Rate | Interpretation |
| --- | --- |
| 0% | Perfect — no RED flags missed |
| 1–5% | Acceptable for launch |
| 6–15% | Needs prompt improvement before launch |
| > 15% | Blocking — do not launch |

**Threshold:** ≤ 5% false negative rate on RED flags in the golden test set.

> **Eval run result:** TC-1 passed (0% false negative rate on a defined RED scenario). This is a single data point — not sufficient to confirm the threshold holds across the full golden test set.

---

#### B3 — Market Norm Benchmark Quality
**Definition:** The `market_norm_benchmark` sentence for each flag accurately describes what is standard in the North American Indian wedding vendor market for that vendor category. Must not be generic, invented, or applicable to any vendor type regardless of category.

| Score | Criteria |
| --- | --- |
| 3 | Specific to vendor category; accurate; adds genuine context |
| 2 | Generic (applies to any contract) but not incorrect |
| 1 | Factually incorrect or hallucinated |

**Threshold:** Average ≥ 2.5; no score of 1 permitted.

---

#### B4 — Overall Risk Score Consistency
**Definition:** The `overall_risk_score` (LOW / MEDIUM / HIGH) is consistent with the distribution of GREEN / YELLOW / RED flags.

Consistency rules:
- Any RED flag = minimum MEDIUM risk score
- 2+ RED flags = HIGH risk score
- All GREEN = LOW risk score

| Score | Criteria |
| --- | --- |
| Pass | Risk score consistent with flag distribution per the rules above |
| Fail | Risk score contradicts flag distribution (e.g., HIGH score with all GREEN flags, or LOW score with a RED flag) |

**Automated:** Yes — can be rule-checked programmatically.
**Threshold:** 100% pass rate.

---

### Module C — AI Vendor Negotiation Response Drafting `[CAPSTONE]`

> **Phase:** Required for MVP demo (April 25, 2026). The response draft is the most user-visible output in the demo flow — poor tone or a style violation is immediately apparent to a reviewing planner.

#### C1 — Clause Specificity
**Definition:** The drafted email addresses the specific flagged clause — not a generic negotiation email that could apply to any contract issue.

| Score | Criteria |
| --- | --- |
| 3 | Email quotes or clearly paraphrases the specific clause and states the exact ask |
| 2 | Email addresses the general topic (e.g., cancellation) but not the specific language |
| 1 | Generic email with no clause-specific content |

**Threshold:** Average ≥ 2.8 across golden test set.

---

#### C2 — Tone Accuracy
**Definition:** The output matches the requested tone (`professional`, `warm`, or `formal`) as defined in the tone guidelines in the master prompt.

**How to test:** Human reviewer blind-rates the tone of three outputs (one per tone type) without knowing which tone was requested. Check for correct classification.

| Score | Criteria |
| --- | --- |
| Pass | Human reviewer correctly identifies the requested tone |
| Fail | Human reviewer mistakes the tone for a different category |

**Threshold:** ≥ 90% pass rate.

---

#### C3 — Style Profile Adherence (Planner only)
**Definition:** When a planner style profile is provided, the output matches the voice, sentence length, and vocabulary described. Explicitly excluded words/phrases do not appear.

**How to test:** Provide a style profile that includes specific vocabulary rules (e.g., "never use 'kindly'") and check the output for violations.

| Score | Criteria |
| --- | --- |
| Pass | No excluded words appear; sentence length and formality match profile |
| Partial | 1 minor style inconsistency; no excluded words |
| Fail | Excluded word appears, or tone is directly opposite to profile |

**Threshold:** ≥ 90% Pass; zero Fail.

> **Reliability concern:** At temperature 0.7, the "never start with I" constraint drifts across repeated runs. TC-3 passed in a single run — this does not constitute threshold validation. Must be tested across ≥ 5 runs before MVP. See Confirmed Failures section.

---

#### C4 — Send-Readiness
**Definition:** The drafted email could be sent to a vendor with minimal or no edits. It is professional, complete, and does not contain placeholder text, unfinished sentences, or obvious errors.

| Score | Criteria |
| --- | --- |
| 3 | Send as-is or with ≤ 1 minor word change |
| 2 | Requires light editing (1–2 sentences reworked) |
| 1 | Not usable without significant rewrite |

**Threshold:** Average ≥ 2.5.

---

### Module D — Post-Signing Obligation Extraction `[CAPSTONE]`

> **Phase:** Required for MVP demo (April 25, 2026). The obligation tracker is a live feature in the prototype — extracted obligations populate the UI directly. A missing disclaimer or wrong date is a visible error in the demo.

#### D1 — Obligation Completeness
**Definition:** All time-bound obligations present in the source contract are extracted. No obligation is silently omitted.

**How to test:** Human reviewer reads the source contract and creates a checklist of every date-specific obligation. Compare to AI output.

| Score | Criteria |
| --- | --- |
| 5 | All obligations captured |
| 4 | 1 minor obligation missed (e.g., a soft confirmation call vs. a hard payment deadline) |
| 3 | 1 payment or primary deadline missed |
| 2 | 2+ obligations missed |
| 1 | Critical payment deadline missed |

**Threshold:** Average ≥ 4.0. Score of 1 is a critical failure.

---

#### D2 — Date Calculation Accuracy
**Definition:** Absolute dates calculated from relative references (e.g., "30 days before the event") are arithmetically correct.

**How to test:** Automated — given a fixed wedding date and a set of relative date obligations, verify the calculated `due_date` values.

| Score | Criteria |
| --- | --- |
| Pass | All calculated dates are correct |
| Fail | Any calculated date is wrong by any amount |

**Threshold:** 100% pass rate. An incorrect payment reminder date is a direct user harm.

> **Eval run result:** TC-4 passed on date calculation. Aug 19 and Oct 11 both correct. Signing date correctly returned as `null` with a note when no anchor date existed.

---

#### D3 — Party Assignment Accuracy
**Definition:** Each obligation is correctly attributed to `client` or `vendor`.

| Score | Criteria |
| --- | --- |
| Pass | All parties correctly assigned |
| Fail | Any obligation assigned to the wrong party |

**Automated:** Partially — spot-check against known test cases.
**Threshold:** ≥ 98% pass rate.

---

### Module E — Vendor Outreach Draft `[V1 LAUNCH]`

> **Phase:** Mocked in the MVP prototype (pre-generated sample shown in UI). Full AI generation must pass all benchmarks before V1 launch (July 2026). Issues identified during pre-V1 testing must be resolved before enabling live generation.

#### E1 — Required Information Completeness
**Definition:** The email body includes all key logistics: event name, event date, guest count, venue (if provided), budget range, and any special requirements. None may be silently omitted.

| Score | Criteria |
| --- | --- |
| Pass | All provided input variables appear in the email body |
| Fail | Any provided variable is missing from the email body |

**Automated:** Yes — check for presence of each input variable value in the body string.
**Threshold:** ≥ 98% pass rate.

---

#### E2 — Indian Wedding Context Relevance
**Definition:** The email reflects knowledge of the Indian wedding context — it does not read as a generic Western wedding vendor inquiry. For example, a Sangeet DJ inquiry should reference the event type; a Mehndi artist inquiry should mention guest count and timing expectations relevant to that event.

| Score | Criteria |
| --- | --- |
| 3 | Email clearly written for the specific Indian wedding event type; culturally appropriate |
| 2 | Email is correct but generic — could be for any wedding event |
| 1 | Email contains a cultural error or clearly ignores the event context |

**Threshold:** Average ≥ 2.5; no score of 1 permitted.

---

#### E3 — Call to Action Clarity
**Definition:** The email closes with a clear, specific ask — either availability confirmation, a quote request, or a discovery call invitation. The vendor knows exactly what to do next.

| Score | Criteria |
| --- | --- |
| Pass | Clear, specific CTA present |
| Fail | Email ends without a clear next step |

**Threshold:** ≥ 98% pass rate.

---

### Module F — AI Budget Advisor `[V1 LAUNCH]`

> **Phase:** Mocked in the MVP prototype (budget dashboard shown with sample data; no live AI calculation). Full AI generation must pass all benchmarks before V1 launch (July 2026). F-R4 (confirmed blocker from eval run) must be fixed before enabling live generation.

#### F1 — Priority Alignment
**Definition:** Budget reallocation suggestions respect the couple's stated priorities. Categories the couple identifies as important are not suggested for reduction.

**How to test:** Provide a priority statement that explicitly protects a category (e.g., "Photography is most important") and verify it does not appear in any `reallocation_from` field.

| Score | Criteria |
| --- | --- |
| Pass | No suggestion reduces a category the couple explicitly prioritized |
| Fail | A suggestion reduces a stated priority category |

**Threshold:** 100% pass rate. Recommending the couple cut their stated priority is a trust-breaking failure.

> **Eval run result:** TC-8 passed on F1 — photography was not named as a reallocation source in any suggestion.

---

#### F2 — Math Validity
**Definition:** The suggested `reallocation_amount` values are drawn only from categories where `(budgeted − actual) > 0`. Suggestions must not propose reallocating from a category that has already met or exceeded its budget.

| Score | Criteria |
| --- | --- |
| Pass | All reallocation sources have positive slack; amounts are arithmetically coherent with input data |
| Fail | Any suggestion draws from a category with zero or negative slack, or amounts don't add up |

**Automated:** Yes — validate arithmetic against `current_allocations` input.
**Threshold:** 100% pass rate.

> **Known failure — F-R4:** TC-8 failed on F2. Model proposed reallocating $4,000 from Sangeet Florals ($6,000 budgeted, $6,000 actual — $0 slack). Root cause: prompt does not instruct the model to validate `budgeted − actual` before naming a reallocation source. Must be fixed before V1.

---

#### F3 — Trade-off Clarity
**Definition:** Each suggestion's `trade_off` field clearly explains what the couple gives up and what they gain — in plain language that a non-expert can act on.

| Score | Criteria |
| --- | --- |
| 3 | Specific, concrete trade-off stated; actionable |
| 2 | Trade-off mentioned but vague (e.g., "may reduce quality") |
| 1 | No meaningful trade-off articulated |

**Threshold:** Average ≥ 2.5.

---

### Module G — Natural Language Guest List Import `[V1 LAUNCH]`

> **Phase:** Mocked in the MVP prototype (sample guest list shown with per-event tags; import flow is UI-only). Full AI generation must pass all benchmarks before V1 launch (July 2026). F-R2 (confirmed blocker from eval run) must be fixed before enabling live generation.

#### G1 — Extraction Recall
**Definition:** The percentage of guests present in the raw input that appear as records in the output.

**How to test:** Use raw inputs with a known ground-truth count (manually counted). Calculate recall = (guests extracted / guests present in input).

| Rate | Interpretation |
| --- | --- |
| ≥ 97% | Acceptable |
| 90–96% | Needs improvement |
| < 90% | Blocking |

**Threshold:** ≥ 97% recall across golden test set.

---

#### G2 — No Invented Data
**Definition:** No field in any guest record contains data not present in the raw input. Names must not be completed, relationships must not be inferred beyond what is stated, and `family_side` must not be inferred from session context.

| Score | Criteria |
| --- | --- |
| Pass | All field values traceable to the raw input text |
| Fail | Any invented name, relationship, or family side assignment — including inference from session context |

**Threshold:** 100% pass rate.

> **Known failure — F-R2:** TC-5 failed on G2. Model assigned `family_side: "bride"` to a guest because "Priya" appeared in the session context (planner name). Correct output is `family_side: "unknown"`. Fix: add explicit rule that `family_side` must only be populated from raw input text, never inferred from session context.

---

#### G3 — Duplicate Detection Accuracy
**Definition:** Guests who appear twice in the raw input (same person, different format) are flagged as potential duplicates rather than creating two separate records.

**How to test:** Include known duplicate entries in golden test inputs (e.g., "Rahul Sharma" and "Rahul S.") and verify they appear in `potential_duplicates`.

| Rate | Interpretation |
| --- | --- |
| ≥ 85% of known duplicates caught | Acceptable |
| 70–84% | Needs improvement |
| < 70% | Blocking |

**Threshold:** ≥ 85% of known duplicates flagged.

> **Eval run result:** TC-5 passed on G3 — all 3 pairwise duplicate combinations correctly flagged. (G2 failed independently.)

---

### Module H — Cultural Wedding Setup Interview `[V1 LAUNCH]`

> **Phase:** Simplified in the MVP prototype (3-question setup flow; custom event generation uses a fixed sample output). Full conversational AI generation must pass all benchmarks before V1 launch (July 2026). F-R3 (confirmed blocker from eval run) must be fixed before enabling live generation.

#### H1 — Conversational Flow Quality
**Definition:** The AI asks questions in natural, manageable groups — not one by one (too slow) and not all at once (overwhelming). The user is not asked for information they already provided.

| Score | Criteria |
| --- | --- |
| 3 | Questions grouped logically (2–4 per turn); no repetition; feels like a real conversation |
| 2 | Mostly natural but one turn asks too many questions or repeats something already stated |
| 1 | All questions in one dump, or questions asked out of logical order |

**Threshold:** Average ≥ 2.5.

---

#### H2 — Cultural Accuracy of Output
**Definition:** The structured output (event list, vendor checklist, cultural notes) is accurate for the specific cultural combination reported by the couple. Regional and religious variations are respected.

Key failure modes to watch:
- Using "Saat Phere" for a Sikh wedding (should be "Anand Karaj")
- Listing "Pandit" as the officiant for a Sikh ceremony (should be "Granthi")
- Omitting the Granthi from the Anand Karaj vendor checklist entirely
- Including a "Baraat" for a Tamil Hindu wedding without flagging that this is not traditional
- Applying "halal" dietary terminology to a Sikh wedding context (correct framing: vegetarian; no beef in many families; no alcohol in Gurdwara)
- Missing the Nichayathartham for a Tamil Hindu wedding
- Assigning a Hindu Pandit for a Sikh ceremony

| Score | Criteria |
| --- | --- |
| 5 | Event list, vendor checklist, and cultural notes are accurate for the specific combination |
| 4 | 1 minor terminology error; no structural errors |
| 3 | 1 structural error (wrong event type for the cultural background) or 1 significant omission (e.g., Granthi missing) |
| 2 | 2+ structural errors |
| 1 | Output ignores cultural context and defaults to generic North Indian Hindu template |

**Threshold:** Average ≥ 4.0. Score of 1 is a trust-breaking failure for non-Hindu users.

> **Known failure — F-R3:** TC-6 scored 3/5 on H2, below the ≥ 4.0 threshold. Two issues: (1) Granthi missing from Anand Karaj vendor checklist — the most important vendor for a Sikh ceremony; (2) "halal" used incorrectly in a Sikh dietary context. Both must be fixed before V1. See Confirmed Failures section for root cause and fix.

---

#### H3 — Open Questions Usefulness
**Definition:** The "open questions for the couple to resolve" section raises genuinely important, non-obvious questions — not obvious ones the AI should already know the answer to.

| Score | Criteria |
| --- | --- |
| 3 | Questions are specific, wedding-stage-appropriate, and genuinely help the couple move forward |
| 2 | Questions are valid but generic — not tailored to the specific wedding context |
| 1 | Questions are trivial or already answered during the interview |

**Threshold:** Average ≥ 2.5.

---

## Scoring Summary Table

| Module | Benchmark | Type | Threshold | Phase |
| --- | --- | --- | --- | --- |
| All | U1 Format Compliance | Auto | 100% pass | MVP (A–D) / V1 (all) |
| All | U2 Field Completeness | Auto | ≥ 95% pass | MVP (A–D) / V1 (all) |
| All | U3 Hallucination Avoidance | Auto + Human | 100% pass | MVP (A–D) / V1 (all) |
| All | U4 Scope Discipline | Human | ≥ 95% pass | MVP (A–D) / V1 (all) |
| A, B, C, D | U5 Disclaimer Presence | Auto | 100% pass | **MVP** |
| A | A1 Clause Coverage | Human | Avg ≥ 4.0 / 5 | **MVP** |
| A | A2 Reading Level (FK) | Auto | ≥ 90% ≤ Grade 8 | **MVP** |
| A | A3 "Not Specified" Accuracy | Auto + Human | 100% pass | **MVP** |
| A | A4 One-Sentence Summary | Human | Avg ≥ 2.5 / 3 | **MVP** |
| B | B1 Flag Accuracy | Human | Avg ≥ 4.0 / 5 | **MVP** |
| B | B2 False Negative Rate (RED) | Human | ≤ 5% | **MVP** |
| B | B3 Market Norm Quality | Human | Avg ≥ 2.5 / 3 | **MVP** |
| B | B4 Risk Score Consistency | Auto | 100% pass | **MVP** |
| C | C1 Clause Specificity | Human | Avg ≥ 2.8 / 3 | **MVP** |
| C | C2 Tone Accuracy | Human | ≥ 90% pass | **MVP** |
| C | C3 Style Profile Adherence | Human | ≥ 90% pass | **MVP** |
| C | C4 Send-Readiness | Human | Avg ≥ 2.5 / 3 | **MVP** |
| D | D1 Obligation Completeness | Human | Avg ≥ 4.0 / 5 | **MVP** |
| D | D2 Date Calculation Accuracy | Auto | 100% pass | **MVP** |
| D | D3 Party Assignment | Auto + Human | ≥ 98% pass | **MVP** |
| E | E1 Required Info Completeness | Auto | ≥ 98% pass | V1 Launch |
| E | E2 Indian Wedding Relevance | Human | Avg ≥ 2.5 / 3 | V1 Launch |
| E | E3 CTA Clarity | Human | ≥ 98% pass | V1 Launch |
| F | F1 Priority Alignment | Auto + Human | 100% pass | V1 Launch |
| F | F2 Math Validity | Auto | 100% pass | V1 Launch |
| F | F3 Trade-off Clarity | Human | Avg ≥ 2.5 / 3 | V1 Launch |
| G | G1 Extraction Recall | Auto | ≥ 97% | V1 Launch |
| G | G2 No Invented Data | Human | 100% pass | V1 Launch |
| G | G3 Duplicate Detection | Auto | ≥ 85% | V1 Launch |
| H | H1 Conversational Flow | Human | Avg ≥ 2.5 / 3 | V1 Launch |
| H | H2 Cultural Accuracy | Human | Avg ≥ 4.0 / 5 | V1 Launch |
| H | H3 Open Questions | Human | Avg ≥ 2.5 / 3 | V1 Launch |

---

## Failure Mode Taxonomy

These are the failure modes that carry the most user harm. Treat as blockers if found in the golden test set. Phase column indicates when each mode must be eliminated.

| ID | Failure Mode | Module(s) | Why It Matters | Phase |
| --- | --- | --- | --- | --- |
| F1 | Missed RED flag | B | User signs a high-risk contract with false confidence | **MVP** |
| F2 | Hallucinated clause | A, B | User acts on a contract term that doesn't exist | **MVP** |
| F3 | Wrong date calculation | D | User misses a payment deadline; vendor cancels | **MVP** |
| F4 | Wrong cultural event term | H | Sikh couple sees "Saat Phere" or "Pandit"; Tamil couple sees "Baraat" — trust destroyed | V1 Launch |
| F5 | Style profile exclusion violated | C | Planner sends an email that doesn't sound like her — damages client relationship | **MVP** |
| F6 | Disclaimer missing | A, B, C, D | Legal liability exposure for Shaadi AI | **MVP** |
| F7 | Priority-violating budget suggestion | F | AI recommends cutting photography for a couple who said it's their top priority | V1 Launch |
| F8 | Invented guest | G | Fictional name added to guest list — causes real-world confusion | V1 Launch |
| F9 | Reallocation from zero-slack category | F | AI suggests pulling budget from a line item that's already fully spent | V1 Launch |
| F10 | Family_side inferred from session context | G | Guest record contains invented data from planner name, not raw input | V1 Launch |

> **F-R1 through F-R4 from the eval run map to:** F6 (F-R1), F10 (F-R2), F4 (F-R3), F9 (F-R4).

---

## Golden Test Set Requirements

Before each launch gate, the following inputs must be assembled and used to run all benchmarks.

### MVP (April 2026) — Minimum Test Set

| Asset | Count | Covers |
| --- | --- | --- |
| Real vendor contracts (varied categories) | 5 minimum | Photographer, venue, caterer — mix of risk levels. PRD Section 4.3 requires human review against 5 contracts for MVP sign-off. |
| Synthetic contracts with known RED flags | 3 | Force majeure missing; 100% cancellation; >50% upfront payment |
| Contracts with missing or ambiguous sections | 2 | A-E1, A-E3 |
| Style profiles for response drafting | 2 | Direct/short sentences; warm/long-form |

### V1 Launch (July 2026) — Full Test Set

| Asset | Count | Covers |
| --- | --- | --- |
| Real vendor contracts (varied categories) | 10 minimum | Photographer, venue, caterer, decorator, DJ, makeup artist; mix of risk levels |
| Synthetic contracts with known RED flags | 5 | Force majeure missing, 100% cancellation, >50% upfront payment |
| Contracts with missing or ambiguous sections | 4 | A-E1, A-E3, A-E6, D-E4 |
| Contracts with staged payment schedules | 3 | D-S1, D-S3, D-S4 |
| Guest list raw inputs (varied formats) | 5 | G-S1, G-S2, G-E1, G-E2, G-E4 |
| Budget scenarios with stated priorities | 3 | F-S1, F-E1, F-N1 |
| Cultural interview transcripts | 4 | H-S1 (North Indian Hindu), H-S2 (Punjabi Sikh), H-E1 (interfaith), H-E4 (Tamil Hindu) |
| Style profiles for response drafting | 3 | Direct/short sentences, warm/long-form, formal/corporate |
| Scanned / degraded PDFs | 2 | A-N1 |
| Vendor outreach pairs (formality contrast) | 1 pair | E-E5 |

**Long-term target:** 50+ real Indian wedding vendor contracts collected before public launch to validate and improve Module B flag accuracy and market norm benchmarks.

---

## Eval Cadence

### Quick-reference table

| When | What | Applies To |
| --- | --- | --- |
| Before MVP demo (June 15, 2026) | Run Modules A, B, C, D on 5 real contracts. Confirm 4 blockers from eval run are resolved. | **MVP gate** |
| Before V1 launch (July 2026) | Run full golden test set on all 8 modules. All benchmarks must pass. | **V1 gate** |
| Before any prompt change goes to production | Run full golden test set on all affected modules | Ongoing |
| Weekly during private beta (May–July 2026) | Run Modules A and B only (highest risk) | Beta monitoring |
| After each 25 new contracts added to the benchmark library | Re-run Module B | Ongoing |
| Before any model upgrade (new Claude version) | Full suite | Model changes |
| User-reported failure in production | Affected module only | Targeted run |
| Monthly post-launch | All 8 modules | Production monitoring |

---

### Cadence reasoning — by trigger

#### Core principle: trigger-based, not calendar-based

Most evals should fire when something changes, not on a fixed schedule. A weekly eval run when nothing changed wastes time; skipping an eval after a prompt change is how silent regressions ship. The three main triggers — new data, prompt changes, and post-launch monitoring — map to different cadences for different reasons.

---

#### Trigger 1 — New data (contracts added to corpus)

**Cadence: every 25 contracts added, re-run Module B only.**

Module B (clause flagging) is the only module whose accuracy directly depends on the size and quality of the contract corpus — it is the one being calibrated against real market norms. Adding 25 contracts is enough to potentially shift what "standard" looks like for a vendor category without being so frequent that you are re-running constantly.

Modules A, C, D, and E do not depend on the corpus — they depend on the prompt. Adding contracts does not change how well Claude summarizes text or drafts emails. Running the full suite on every corpus update burns human review time for no signal gain.

The exception: if a new batch of contracts reveals a systematic failure mode in Module B (e.g., all Tamil caterer contracts get mis-flagged), that is a signal to fix the prompt — which then triggers a full affected-module eval run.

---

#### Trigger 2 — New or changed prompts

**Cadence: before every promotion to production, run the full golden test set on all affected modules.**

This is non-negotiable. The master prompt v2.0 document defines 15 variations to test (V1–V15). Each one must be run against the full golden test set before being deployed — not just the module it targets. A change to the core system prompt (V1–V4) affects all 8 modules simultaneously. A change to Module B's flag rules (V8–V10) might indirectly affect Module A outputs if the two share a combined API call (which they do in the current implementation).

The practical workflow:
- Make a prompt change on a branch
- Run the full golden test set — automated Tier 1 checks first (fast, free), then model grader calls (Tier 2), then human review only where needed (Tier 3)
- Compare scores against the baseline run
- Any module that regresses below its threshold blocks the change

The 15 variations in master_prompt_v2.md should be treated as a backlog of A/B tests — run one at a time, eval before promoting, never stack two untested changes.

---

#### Trigger 3 — Post-launch monitoring

**Cadence: weekly (Modules A and B) during private beta; monthly (full suite) post-launch; immediately on any model upgrade.**

**Private beta (now through July 2026):**
Weekly runs on Modules A and B — the highest-risk modules where a failure (missed RED flag, hallucinated clause) causes direct user harm. Lightweight: 5 contracts through the golden test set, automated checks only. Takes under an hour if Tier 1 is scripted.

**Post-launch (July 2026 onward):**
Monthly full suite. The signal to watch for is distributional shift — real user contracts are more diverse than the golden test set. Once production data flows, add the most unusual contracts to the golden set and re-run. This is how the benchmark library grows from 56 to 200+ contracts.

**Model upgrades (any new Claude version):**
Full suite immediately before switching. Anthropic releases new model versions periodically and behavior changes — even within the same model family. A new version that improves response drafting might subtly change how it handles ambiguous clauses in Module B. Always verify before promoting a new model to production.

**Production signals that should trigger an unscheduled run:**
- High user edit rate on AI-generated response drafts → Module C may be off
- User-reported incorrect contract summaries → Module A failure
- Obligation dates that do not match the contract → Module D failure

These are leading indicators that a formal eval run is needed before the next scheduled one.

---

### Numbered summary

1. **Core principle** | Trigger-based, not calendar-based | Running evals when nothing changed wastes time; skipping them after a change is how regressions ship
2. **New data trigger** | Re-run Module B only after every 25 contracts added | Module B is the only module calibrated against the corpus; other modules depend on the prompt, not the data
3. **Prompt change trigger** | Full golden test set on all affected modules before any promotion to production | A core system prompt change (V1–V4) affects all 8 modules; a combined A+B+D call means Module B changes can silently affect A and D outputs
4. **Prompt A/B testing** | One variation at a time; eval before promoting; never stack untested changes | Stacking changes makes it impossible to attribute a regression to a specific variation
5. **Private beta monitoring** | Weekly runs on Modules A and B only | These are the highest-risk modules where a failure causes direct user harm; weekly cadence is lightweight if Tier 1 is scripted
6. **Post-launch monitoring** | Monthly full suite | Real user contracts are more diverse than the golden test set; monthly cadence catches distributional shift before it becomes a user-visible problem
7. **Model upgrade trigger** | Full suite immediately before switching to any new Claude version | Model behavior changes even within the same family; verify before promoting a new model to production
8. **Production failure signal** | Unscheduled targeted run on the affected module | High edit rate on drafts (Module C), user-reported wrong summaries (Module A), or wrong obligation dates (Module D) are leading indicators that a formal run is needed now, not at the next scheduled interval

---

## Known Limitations

1. **Module D disclaimer gap confirmed.** Master prompt v1.0's Module D schema omits the `disclaimer` field. Confirmed blocking failure (F-R1, TC-4). Fix is a one-line addition to the schema. Must be resolved before MVP demo.

2. **Module F slack validation gap confirmed.** Module F does not instruct the model to validate `(budgeted − actual) > 0` before naming a reallocation source. Confirmed blocking failure (F-R4, TC-8). Must be resolved before V1. Not a MVP blocker because the budget advisor is mocked in the prototype.

3. **Module H cultural knowledge gaps confirmed.** Granthi omitted from Anand Karaj checklist; "halal" misapplied to Sikh dietary context. Confirmed blocking failure on H2 (F-R3, TC-6). Must be resolved before V1. Adding an explicit cultural knowledge block (Sikh, Tamil Hindu, Gujarati Hindu) to the system prompt is the recommended fix.

4. **Module G family\_side inference gap confirmed.** Model infers `family_side` from session context rather than restricting to raw input text. Confirmed blocking failure on G2 (F-R2, TC-5). Must be resolved before V1.

5. **Module B market norm benchmarks are unvalidated.** Until 50+ real contracts are collected and reviewed by an expert, Module B benchmarks should be treated as directional, not authoritative. The product UI should reflect this with a confidence indicator.

6. **Module H cultural accuracy has the highest human review burden.** Tamil Hindu and Gujarati Hindu combinations require reviewers with specific regional knowledge. Plan to recruit 1–2 community validators per cultural variation before V1 private beta.

7. **Style profile adherence (C3) degrades with short or vague style profiles.** Minimum viable style profile = 3 sample emails from the planner. Flag this in the onboarding flow. C3 single-run pass at temp 0.7 does not constitute threshold validation — requires ≥ 5 runs.

8. **PDF text extraction quality affects Module A and B accuracy.** If the extracted text is degraded (scanned PDFs, image-based PDFs), hallucination risk increases. Evals should include degraded-text test cases after the Make + PDF.co integration is built.

---

## Version Log

| Version | Date | Changes |
| --- | --- | --- |
| v1.0 | April 2026 | Initial framework — 8 modules, universal benchmarks, scoring summary, failure mode taxonomy, golden test set requirements, eval cadence |
| v2.0 | April 2026 | Added Phase Applicability section mapping all benchmarks to MVP / V1 / V2+. Added Confirmed Failures section documenting 4 blockers and 2 reliability concerns from eval run on master_prompt_v1.0 (April 4, 2026). Added F9 and F10 to failure mode taxonomy. Updated scoring summary table with Phase column. Updated Known Limitations with confirmed evidence. |
| v3.0 | June 2026 | Updated MVP demo date to June 15. Added monthly post-launch monitoring row and user-reported failure row to cadence table. Expanded Eval Cadence section with full trigger-based reasoning for new data, prompt changes, and post-launch monitoring. Added numbered summary. |

---

*Last updated: June 2026 | Author: Varun Maryada*
*Companion documents: Design/master\_prompt\_v1.md, Development/master\_prompt\_v2.md, Development/example\_data.md, Design/use\_cases.md*
