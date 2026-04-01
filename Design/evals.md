# Shaadi AI — Prompt Evaluation Framework

**Author:** Varun Maryada
**Version:** 1.0
**Date:** April 2026
**Applies to:** Master Prompt v1.0 — all 8 task modules (A–H)

---

## Purpose

This document defines what "good" looks like for every AI output in Shaadi AI. It is the benchmark used to:
- Validate the prompt before launch
- Detect regressions when the prompt is updated
- Score outputs during human review sessions
- Prioritize prompt improvement work by failure mode

Evaluations are run on a **golden test set** — a fixed collection of realistic inputs with known expected outputs. The golden set is maintained separately and referenced at the end of this document.

---

## Evaluation Philosophy

Two types of quality matter for Shaadi AI:

**Objective quality** — Is the output correct, complete, and well-formed? These criteria have clear right/wrong answers and can be partially automated (JSON schema validation, field presence checks, date math verification).

**Subjective quality** — Does it read well? Does it sound like the right persona? Is it culturally accurate? These require a human reviewer familiar with Indian weddings and the Shaadi AI product.

All modules are scored on both dimensions. The minimum acceptable score to ship is defined per module below.

---

## Universal Benchmarks (All Modules)

These apply to every API call, regardless of task.

### U1 — Format Compliance
**Definition:** The output parses without errors as valid JSON (for modules A–G) or follows the defined conversational structure (module H).

| Score | Criteria |
|-------|----------|
| Pass | JSON is valid and parseable; all required top-level keys present |
| Fail | JSON is invalid, malformed, or contains text outside the JSON block |

**Automated:** Yes — run `JSON.parse()` on output; validate against schema.
**Threshold:** 100% pass rate. Zero tolerance. A malformed JSON breaks the Make automation pipeline.

---

### U2 — Field Completeness
**Definition:** All required fields in the output schema are present and non-empty. Fields may contain "Not specified in contract" or equivalent — but must not be null, missing, or empty string unless explicitly permitted.

| Score | Criteria |
|-------|----------|
| Pass | All required fields present with meaningful content |
| Partial | 1 optional field missing or empty |
| Fail | Any required field is null, missing, or an empty string |

**Automated:** Yes — check key presence and non-null values against schema.
**Threshold:** ≥ 95% full Pass. No Fail on required fields.

---

### U3 — Hallucination Avoidance
**Definition:** The output does not invent facts that are not present in the input. This includes: clauses not in the contract, vendor names, specific dollar amounts not stated, specific dates not calculable from the input, or invented market statistics.

| Score | Criteria |
|-------|----------|
| Pass | All factual claims traceable to input text or well-established general knowledge |
| Fail | Any invented clause, dollar figure, vendor detail, or fabricated statistic |

**Automated:** Partially — spot-check specific fields (amounts, dates) against input.
**Human review:** Required for market norm benchmarks and cultural notes.
**Threshold:** 100% pass rate on hallucination check. A hallucinated clause in a contract summary is a critical failure.

---

### U4 — Scope Discipline
**Definition:** The output addresses only the requested task. It does not volunteer unsolicited analysis, additional features, or content outside the task module's defined scope.

| Score | Criteria |
|-------|----------|
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
|-------|----------|
| Pass | Disclaimer present verbatim in the `disclaimer` field |
| Fail | Disclaimer missing, truncated, or paraphrased |

**Automated:** Yes — exact string match.
**Threshold:** 100% pass rate. Non-negotiable legal requirement.

---

## Module-Specific Benchmarks

---

### Module A — Contract Plain-Language Summary

#### A1 — Clause Coverage (Accuracy)
**Definition:** Every clause present in the source contract is reflected in the correct summary field. No clause is silently omitted.

**How to test:** Human reviewer reads the source contract and checks each of the 8 fields. Any clause present in the contract but absent from the output = fail.

| Score | Criteria |
|-------|----------|
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
|-------|----------|
| Pass | FK Grade Level ≤ 8.0 |
| Marginal | FK Grade Level 8.1–10.0 |
| Fail | FK Grade Level > 10.0 |

**Threshold:** ≥ 90% Pass; no Fail permitted on the cancellation_policy field (highest user impact).

---

#### A3 — "Not Specified" Accuracy
**Definition:** When a clause is genuinely absent from the contract, the field correctly states "Not specified in contract" rather than fabricating a value or leaving the field blank.

| Score | Criteria |
|-------|----------|
| Pass | Missing clause correctly identified and labeled |
| Fail | Missing clause either fabricated or left empty |

**Automated:** Partially — compare fields against contracts known to lack certain clauses.
**Threshold:** 100% pass rate.

---

#### A4 — One-Sentence Summary Quality
**Definition:** The `one_sentence_summary` field is ≤ 30 words, captures the essential nature of the contract, and is understandable to a non-expert in 10 seconds.

| Score | Criteria |
|-------|----------|
| 3 | ≤ 30 words; captures vendor, event, and the most critical term (e.g., payment structure or key restriction) |
| 2 | ≤ 30 words; accurate but generic — could apply to any contract |
| 1 | > 30 words, or inaccurate, or meaningless |

**Threshold:** Average ≥ 2.5 across golden test set.

---

### Module B — Traffic Light Clause Flagging

#### B1 — Flag Accuracy (vs. Expert Reviewer)
**Definition:** Each flag rating (GREEN / YELLOW / RED) matches the rating assigned by a human expert reviewer with Indian wedding contract experience. This is the most critical eval in the entire system.

**How to test:** Human reviewer (someone with real Indian wedding planner or legal experience) independently rates each clause in the golden contract set. Compare to AI output.

| Score | Criteria |
|-------|----------|
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
|------|---------------|
| 0% | Perfect — no RED flags missed |
| 1–5% | Acceptable for launch |
| 6–15% | Needs prompt improvement before launch |
| > 15% | Blocking — do not launch |

**Threshold:** ≤ 5% false negative rate on RED flags in the golden test set.

---

#### B3 — Market Norm Benchmark Quality
**Definition:** The `market_norm_benchmark` sentence for each flag accurately describes what is standard in the North American Indian wedding vendor market for that vendor category. Must not be generic, invented, or applicable to any vendor type regardless of category.

| Score | Criteria |
|-------|----------|
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
|-------|----------|
| Pass | Risk score consistent with flag distribution per the rules above |
| Fail | Risk score contradicts flag distribution (e.g., HIGH score with all GREEN flags, or LOW score with a RED flag) |

**Automated:** Yes — can be rule-checked programmatically.
**Threshold:** 100% pass rate.

---

### Module C — AI Vendor Negotiation Response Drafting

#### C1 — Clause Specificity
**Definition:** The drafted email addresses the specific flagged clause — not a generic negotiation email that could apply to any contract issue.

| Score | Criteria |
|-------|----------|
| 3 | Email quotes or clearly paraphrases the specific clause and states the exact ask |
| 2 | Email addresses the general topic (e.g., cancellation) but not the specific language |
| 1 | Generic email with no clause-specific content |

**Threshold:** Average ≥ 2.8 across golden test set.

---

#### C2 — Tone Accuracy
**Definition:** The output matches the requested tone (`professional`, `warm`, or `formal`) as defined in the tone guidelines in the master prompt.

**How to test:** Human reviewer blind-rates the tone of three outputs (one per tone type) without knowing which tone was requested. Check for correct classification.

| Score | Criteria |
|-------|----------|
| Pass | Human reviewer correctly identifies the requested tone |
| Fail | Human reviewer mistakes the tone for a different category |

**Threshold:** ≥ 90% pass rate.

---

#### C3 — Style Profile Adherence (Planner only)
**Definition:** When a planner style profile is provided, the output matches the voice, sentence length, and vocabulary described. Explicitly excluded words/phrases do not appear.

**How to test:** Provide a style profile that includes specific vocabulary rules (e.g., "never use 'kindly'") and check the output for violations.

| Score | Criteria |
|-------|----------|
| Pass | No excluded words appear; sentence length and formality match profile |
| Partial | 1 minor style inconsistency; no excluded words |
| Fail | Excluded word appears, or tone is directly opposite to profile |

**Threshold:** ≥ 90% Pass; zero Fail.

---

#### C4 — Send-Readiness
**Definition:** The drafted email could be sent to a vendor with minimal or no edits. It is professional, complete, and does not contain placeholder text, unfinished sentences, or obvious errors.

| Score | Criteria |
|-------|----------|
| 3 | Send as-is or with ≤ 1 minor word change |
| 2 | Requires light editing (1–2 sentences reworked) |
| 1 | Not usable without significant rewrite |

**Threshold:** Average ≥ 2.5.

---

### Module D — Post-Signing Obligation Extraction

#### D1 — Obligation Completeness
**Definition:** All time-bound obligations present in the source contract are extracted. No obligation is silently omitted.

**How to test:** Human reviewer reads the source contract and creates a checklist of every date-specific obligation. Compare to AI output.

| Score | Criteria |
|-------|----------|
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
|-------|----------|
| Pass | All calculated dates are correct |
| Fail | Any calculated date is wrong by any amount |

**Threshold:** 100% pass rate. An incorrect payment reminder date is a direct user harm.

---

#### D3 — Party Assignment Accuracy
**Definition:** Each obligation is correctly attributed to `client` or `vendor`.

| Score | Criteria |
|-------|----------|
| Pass | All parties correctly assigned |
| Fail | Any obligation assigned to the wrong party |

**Automated:** Partially — spot-check against known test cases.
**Threshold:** ≥ 98% pass rate.

---

### Module E — Vendor Outreach Draft

#### E1 — Required Information Completeness
**Definition:** The email body includes all key logistics: event name, event date, guest count, venue (if provided), budget range, and any special requirements. None may be silently omitted.

| Score | Criteria |
|-------|----------|
| Pass | All provided input variables appear in the email body |
| Fail | Any provided variable is missing from the email body |

**Automated:** Yes — check for presence of each input variable value in the body string.
**Threshold:** ≥ 98% pass rate.

---

#### E2 — Indian Wedding Context Relevance
**Definition:** The email reflects knowledge of the Indian wedding context — it does not read as a generic Western wedding vendor inquiry. For example, a Sangeet DJ inquiry should reference the event type; a Mehndi artist inquiry should mention guest count and timing expectations relevant to that event.

| Score | Criteria |
|-------|----------|
| 3 | Email clearly written for the specific Indian wedding event type; culturally appropriate |
| 2 | Email is correct but generic — could be for any wedding event |
| 1 | Email contains a cultural error or clearly ignores the event context |

**Threshold:** Average ≥ 2.5; no score of 1 permitted.

---

#### E3 — Call to Action Clarity
**Definition:** The email closes with a clear, specific ask — either availability confirmation, a quote request, or a discovery call invitation. The vendor knows exactly what to do next.

| Score | Criteria |
|-------|----------|
| Pass | Clear, specific CTA present |
| Fail | Email ends without a clear next step |

**Threshold:** ≥ 98% pass rate.

---

### Module F — AI Budget Advisor

#### F1 — Priority Alignment
**Definition:** Budget reallocation suggestions respect the couple's stated priorities. Categories the couple identifies as important are not suggested for reduction.

**How to test:** Provide a priority statement that explicitly protects a category (e.g., "Photography is most important") and verify it does not appear in any `reallocation_from` field.

| Score | Criteria |
|-------|----------|
| Pass | No suggestion reduces a category the couple explicitly prioritized |
| Fail | A suggestion reduces a stated priority category |

**Threshold:** 100% pass rate. Recommending the couple cut their stated priority is a trust-breaking failure.

---

#### F2 — Math Validity
**Definition:** The suggested `reallocation_amount` values sum to an amount that covers the stated variance, without exceeding the total available slack in the budget.

| Score | Criteria |
|-------|----------|
| Pass | Reallocation amounts are arithmetically coherent with the input data |
| Fail | Amounts don't add up, exceed available budget, or don't cover the variance |

**Automated:** Yes — validate arithmetic against `current_allocations` input.
**Threshold:** 100% pass rate.

---

#### F3 — Trade-off Clarity
**Definition:** Each suggestion's `trade_off` field clearly explains what the couple gives up and what they gain — in plain language that a non-expert can act on.

| Score | Criteria |
|-------|----------|
| 3 | Specific, concrete trade-off stated; actionable |
| 2 | Trade-off mentioned but vague (e.g., "may reduce quality") |
| 1 | No meaningful trade-off articulated |

**Threshold:** Average ≥ 2.5.

---

### Module G — Natural Language Guest List Import

#### G1 — Extraction Recall
**Definition:** The percentage of guests present in the raw input that appear as records in the output.

**How to test:** Use raw inputs with a known ground-truth count (manually counted). Calculate recall = (guests extracted / guests present in input).

| Rate | Interpretation |
|------|---------------|
| ≥ 97% | Acceptable |
| 90–96% | Needs improvement |
| < 90% | Blocking |

**Threshold:** ≥ 97% recall across golden test set.

---

#### G2 — No Invented Data
**Definition:** No field in any guest record contains data not present in the raw input. Names must not be completed, relationships must not be inferred beyond what is stated, family sides must not be assumed without evidence.

| Score | Criteria |
|-------|----------|
| Pass | All field values traceable to the raw input text |
| Fail | Any invented name, relationship, or family side assignment |

**Threshold:** 100% pass rate.

---

#### G3 — Duplicate Detection Accuracy
**Definition:** Guests who appear twice in the raw input (same person, different format) are flagged as potential duplicates rather than creating two separate records.

**How to test:** Include known duplicate entries in golden test inputs (e.g., "Rahul Sharma" and "Rahul S.") and verify they appear in `potential_duplicates`.

| Rate | Interpretation |
|------|---------------|
| ≥ 85% of known duplicates caught | Acceptable |
| 70–84% | Needs improvement |
| < 70% | Blocking |

**Threshold:** ≥ 85% of known duplicates flagged.

---

### Module H — Cultural Wedding Setup Interview

#### H1 — Conversational Flow Quality
**Definition:** The AI asks questions in natural, manageable groups — not one by one (too slow) and not all at once (overwhelming). The user is not asked for information they already provided.

| Score | Criteria |
|-------|----------|
| 3 | Questions grouped logically (2–4 per turn); no repetition; feels like a real conversation |
| 2 | Mostly natural but one turn asks too many questions or repeats something already stated |
| 1 | All questions in one dump, or questions asked out of logical order |

**Threshold:** Average ≥ 2.5.

---

#### H2 — Cultural Accuracy of Output
**Definition:** The structured output (event list, vendor checklist, cultural notes) is accurate for the specific cultural combination reported by the couple. Regional and religious variations are respected.

Key failure modes to watch:
- Using "Saat Phere" for a Sikh wedding (should be "Anand Karaj")
- Including a "Baraat" for a Tamil Hindu wedding without flagging that this is not traditional
- Assigning a Hindu pandit for a Sikh ceremony
- Missing the Granthi for a Sikh ceremony

| Score | Criteria |
|-------|----------|
| 5 | Event list, vendor checklist, and cultural notes are accurate for the specific combination |
| 4 | 1 minor terminology error; no structural errors |
| 3 | 1 structural error (wrong event type for the cultural background) |
| 2 | 2+ structural errors |
| 1 | Output ignores cultural context and defaults to generic North Indian Hindu template |

**Threshold:** Average ≥ 4.0. Score of 1 is a trust-breaking failure for non-Hindu users.

---

#### H3 — Open Questions Usefulness
**Definition:** The "open questions for the couple to resolve" section raises genuinely important, non-obvious questions — not obvious ones the AI should already know the answer to.

| Score | Criteria |
|-------|----------|
| 3 | Questions are specific, wedding-stage-appropriate, and genuinely help the couple move forward |
| 2 | Questions are valid but generic — not tailored to the specific wedding context |
| 1 | Questions are trivial or already answered during the interview |

**Threshold:** Average ≥ 2.5.

---

## Scoring Summary Table

| Module | Benchmark | Type | Threshold |
|--------|-----------|------|-----------|
| All | U1 Format Compliance | Auto | 100% pass |
| All | U2 Field Completeness | Auto | ≥ 95% pass |
| All | U3 Hallucination Avoidance | Auto + Human | 100% pass |
| All | U4 Scope Discipline | Human | ≥ 95% pass |
| A, B, C, D | U5 Disclaimer Presence | Auto | 100% pass |
| A | A1 Clause Coverage | Human | Avg ≥ 4.0 / 5 |
| A | A2 Reading Level (FK) | Auto | ≥ 90% ≤ Grade 8 |
| A | A3 "Not Specified" Accuracy | Auto + Human | 100% pass |
| A | A4 One-Sentence Summary | Human | Avg ≥ 2.5 / 3 |
| B | B1 Flag Accuracy | Human | Avg ≥ 4.0 / 5 |
| B | B2 False Negative Rate (RED) | Human | ≤ 5% |
| B | B3 Market Norm Quality | Human | Avg ≥ 2.5 / 3 |
| B | B4 Risk Score Consistency | Auto | 100% pass |
| C | C1 Clause Specificity | Human | Avg ≥ 2.8 / 3 |
| C | C2 Tone Accuracy | Human | ≥ 90% pass |
| C | C3 Style Profile Adherence | Human | ≥ 90% pass |
| C | C4 Send-Readiness | Human | Avg ≥ 2.5 / 3 |
| D | D1 Obligation Completeness | Human | Avg ≥ 4.0 / 5 |
| D | D2 Date Calculation Accuracy | Auto | 100% pass |
| D | D3 Party Assignment | Auto + Human | ≥ 98% pass |
| E | E1 Required Info Completeness | Auto | ≥ 98% pass |
| E | E2 Indian Wedding Relevance | Human | Avg ≥ 2.5 / 3 |
| E | E3 CTA Clarity | Human | ≥ 98% pass |
| F | F1 Priority Alignment | Auto + Human | 100% pass |
| F | F2 Math Validity | Auto | 100% pass |
| F | F3 Trade-off Clarity | Human | Avg ≥ 2.5 / 3 |
| G | G1 Extraction Recall | Auto | ≥ 97% |
| G | G2 No Invented Data | Human | 100% pass |
| G | G3 Duplicate Detection | Auto | ≥ 85% |
| H | H1 Conversational Flow | Human | Avg ≥ 2.5 / 3 |
| H | H2 Cultural Accuracy | Human | Avg ≥ 4.0 / 5 |
| H | H3 Open Questions | Human | Avg ≥ 2.5 / 3 |

---

## Failure Mode Taxonomy

These are the failure modes that carry the most user harm. Treat as blockers if found in the golden test set.

| ID | Failure Mode | Module(s) | Why It Matters |
|----|-------------|-----------|----------------|
| F1 | Missed RED flag | B | User signs a high-risk contract with false confidence |
| F2 | Hallucinated clause | A, B | User acts on a contract term that doesn't exist |
| F3 | Wrong date calculation | D | User misses a payment deadline; vendor cancels |
| F4 | Wrong cultural event term | H | Sikh couple sees "Saat Phere"; Tamil couple sees "Baraat" — trust destroyed |
| F5 | Style profile exclusion violated | C | Planner sends an email that doesn't sound like her — damages client relationship |
| F6 | Disclaimer missing | A, B, C, D | Legal liability exposure for Shaadi AI |
| F7 | Priority-violating budget suggestion | F | AI recommends cutting photography for a couple who said it's their top priority |
| F8 | Invented guest | G | Fictional name added to guest list — causes real-world confusion |

---

## Golden Test Set Requirements

Before launch, the following inputs must be assembled and used to run all benchmarks:

| Test Set Component | Quantity | Notes |
|-------------------|----------|-------|
| Real vendor contracts (varied categories) | 10 minimum | Photographer, venue, caterer, decorator, DJ, makeup artist; mix of risk levels |
| Synthetic contracts with known RED flags | 5 | Force majeure missing, 100% cancellation, >50% upfront payment |
| Guest list raw inputs (varied formats) | 5 | WhatsApp dumps, spreadsheet rows, typed notes, mixed formats |
| Budget scenarios with variance | 3 | One per priority profile (photography-first, florals-flexible, venue-priority) |
| Cultural combinations for setup interview | 4 | North Indian Hindu, Punjabi Sikh, Gujarati Hindu, interfaith (Sikh + Hindu) |
| Style profiles for response drafting | 3 | Direct/short sentences, warm/long-form, formal/corporate |

Target: **50+ real Indian wedding vendor contracts** collected before public launch to validate and improve Module B flag accuracy and market norm benchmarks.

---

## Eval Cadence

| When | What |
|------|------|
| Before any prompt change goes to production | Run full golden test set on all affected modules |
| Weekly during private beta (May–June 2026) | Run Modules A and B only (highest risk) |
| After each 25 new contracts added to the benchmark library | Re-run Module B |
| Before any model upgrade (new Claude version) | Full suite |

---

## Known Limitations (v1.0)

1. **Market norm benchmarks are based on general Indian wedding industry knowledge, not a validated contract database.** Until 50+ real contracts are collected and reviewed by an expert, Module B benchmarks should be treated as directional, not authoritative. The product UI should reflect this with a confidence indicator.

2. **Module H (Cultural Setup) has the highest human review burden.** Cultural accuracy for Tamil Hindu, Gujarati Hindu, and interfaith combinations requires reviewers with specific regional knowledge. Plan to recruit 1–2 community validators before launch.

3. **Style profile adherence (C3) degrades with short or vague style profiles.** Minimum viable style profile = 3 sample emails from the planner. Flag this in the onboarding flow.

4. **PDF text extraction quality (from PDF.co) affects Module A and B accuracy.** If the extracted text is degraded (scanned PDFs, image-based PDFs), hallucination risk increases. Evals should include degraded-text test cases post-integration.

---

*Last updated: April 2026 | Author: Varun Maryada*
*This document is the companion to Design/master_prompt_v1.md*
