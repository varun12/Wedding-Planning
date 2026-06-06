# Shaadi AI — Evaluation Methods

**Author:** Varun Maryada
**Version:** 1.0
**Date:** April 2026
**Purpose:** Define the evaluation approach for all prompt benchmarks — which method (script, model grader, human) applies to each benchmark, how the system scales to diverse and large test sets, and the reasoning behind each decision.

---

## Design Principle

Front-load automation so that human effort is spent only where no script or model can match judgment quality. Every benchmark that has a deterministic answer is a script. Every benchmark that requires interpretation but can be expressed as a rubric is a model grader. Human review is reserved for the three cases where correctness genuinely cannot be articulated in words.

---

## The Three-Tier Framework

| Tier | Method | % of Benchmarks | When to Use |
|------|--------|-----------------|-------------|
| 1 | **Script** | ~40% | Output has a deterministic correct answer — math, format, string presence |
| 2 | **Model Grader** | ~45% | Output requires interpretation, but judgment can be encoded in a rubric |
| 3 | **Human** | ~15% | Requires lived experience — market norms, cultural fluency, professional voice |

---

## Tier 1 — Pure Script

These benchmarks have exact, computable answers. Running a script is faster, cheaper, and more reliable than any other method.

| Benchmark | What the Script Checks |
|-----------|----------------------|
| **U1** Format Compliance | `JSON.parse()` + schema key validation |
| **U2** Field Completeness | Key presence + non-null check against required field list |
| **U5** Disclaimer Presence | Exact string match against the required disclaimer text |
| **A2** Reading Level | Flesch-Kincaid Grade Level on `payment_schedule`, `cancellation_policy`, `force_majeure` fields |
| **A4** (word count only) | Word count of `one_sentence_summary` ≤ 30 |
| **B4** Risk Score Consistency | Rule check: any RED flag → score ≥ MEDIUM; 2+ RED → HIGH; all GREEN → LOW |
| **C3** (prohibited phrases) | String match for each excluded word from style profile — zero-tolerance check |
| **D2** Date Calculation Accuracy | Calculate expected dates from wedding date + relative references; diff against `due_date` fields |
| **D-S4** Reminder Intervals | Assert `reminder_days_before == [14, 7, 1]` on every obligation record |
| **E1** Required Info Completeness | Check that each input variable value (event name, guest count, budget range, etc.) appears in `body` string |
| **E3** CTA Clarity (presence) | Assert `key_ask` field is non-empty and ≥ 1 complete sentence |
| **F2** Math Validity | Compute `available_slack = budgeted − actual` per category; assert no `reallocation_amount` exceeds its source's slack |
| **G1** Extraction Recall | Compare `total_extracted` to ground-truth guest count in the test case |
| **G3** Duplicate Detection | Assert known duplicate pairs from the test case appear in `potential_duplicates` |

**Why script for these:** Every one of these has a single right answer that a `for` loop can verify in milliseconds. There is no judgment involved. Running these as scripts means they can be executed on every prompt change, on every test case, automatically — zero marginal cost per run.

---

## Tier 2 — Model Grader (LLM-as-Judge)

These benchmarks require interpretation — reading a contract and deciding if a clause was captured correctly, or checking if an email is specific to the event type. A human could do this well, but so can a Claude call given the right rubric. The key insight: **a grader prompt is a form of specification**. Writing it forces you to encode exactly what "good" means, which you need anyway.

### Grader Architecture

Each grader call takes three inputs and returns a structured JSON score with a numeric rating and a one-sentence justification. The justification is what makes the grader auditable and debuggable.

```
GRADER INPUT STRUCTURE
{
  "original_input": { ...the contract text, context, etc. },
  "shaadi_output":  { ...the JSON the prompt produced },
  "rubric":         "...",
  "expected_behavior": "..."
}

GRADER OUTPUT STRUCTURE
{
  "benchmark":    "A1",
  "score":        4,
  "max_score":    5,
  "pass":         true,
  "justification": "All 7 clauses captured. Minor phrasing inaccuracy in
                    force_majeure field — 'may' used where contract says 'shall'."
}
```

### Benchmark Assignments

| Benchmark | What the Grader Evaluates |
|-----------|--------------------------|
| **U3** Hallucination Avoidance | Compare every factual claim in the output against the input text. Flag any fact with no traceable source. |
| **U4** Scope Discipline | Check whether the output contains content outside what the task schema requires. |
| **A1** Clause Coverage | Read the contract; check each of the 8 summary fields against the source; score on the 1–5 rubric. |
| **A3** "Not Specified" Accuracy | For fields the grader confirms are absent from the contract, check whether the output says "Not specified" or invents a value. |
| **A4** Summary Quality (content) | Assess whether `one_sentence_summary` captures vendor, event, and the most critical term — not just word count. |
| **B1** Flag Accuracy | Apply the prompt's explicit RED/YELLOW/GREEN rules to each clause; compare to the output's ratings. |
| **B2** False Negative Rate | Independently identify all RED-worthy clauses in the contract; calculate what fraction the output correctly flagged RED. |
| **B3** Market Norm Quality | Rate each `market_norm_benchmark` for vendor-category specificity on the 1–3 rubric. |
| **C1** Clause Specificity | Check whether the email quotes or clearly paraphrases the specific flagged clause. |
| **C2** Tone Accuracy | Classify the tone of the email body (professional / warm / formal) without knowing what was requested; compare. |
| **C4** Send-Readiness | Rate the email on the 1–3 rubric — placeholder text, incomplete sentences, professional register. |
| **D1** Obligation Completeness | Read the contract; identify every time-bound obligation; compare to the extracted list. |
| **D3** Party Assignment | Verify each obligation is attributed to the correct party based on the contract language. |
| **E2** Indian Wedding Context | Rate whether the email is specific to the event type or generic. |
| **F1** Priority Alignment | Check whether any `reallocation_from` field names a category the couple's priority statement protects. |
| **F3** Trade-off Clarity | Rate each `trade_off` field on the 1–3 actionability rubric. |
| **G2** No Invented Data | Trace every field value in every guest record back to the raw input text. Flag any that cannot be traced. |
| **H1** Conversational Flow | Rate question grouping on the 1–3 rubric — number of questions per turn, no repetition. |
| **H2** Cultural Accuracy | Apply the cultural knowledge block from the system prompt as the reference; score on the 1–5 rubric. |
| **H3** Open Questions | Rate whether open questions are specific and non-obvious on the 1–3 rubric. |

### Why Model Grader for These

The judgment required is largely rule-following at scale — "does this summary capture what the contract says?" is a reading comprehension task that a capable LLM handles well, especially when the rubric is explicit. The grader does not need to know Indian wedding norms from training; it is given the contract as input and told to check against it. The benchmarks where graders work best are ones where the correctness criteria can be fully articulated in words, which covers most of the list above.

### Grader Calibration

Grader scores will drift if never validated against human judgment. Run a calibration check quarterly: take 10 randomly sampled outputs from production, grade them with the model grader, then have one human reviewer grade the same outputs independently. If agreement is < 85% on any benchmark, update the grader prompt for that benchmark. This keeps the grader aligned with human intent at minimal ongoing cost.

---

## Tier 3 — Human (Targeted, Minimal)

Three tasks genuinely require humans. The discipline is **not expanding this list** — every benchmark that can be handled by script or grader should be, because human review is the bottleneck that breaks scaling.

| Benchmark | Why Human Is Required | Who | Cadence |
|-----------|----------------------|-----|---------|
| **B1/B2/B3** Market norm benchmarks | The grader's B1/B2 scores are only as good as the rubric. The rubric says "evaluate against Indian wedding vendor contract norms" — but those norms are not fully enumerated. A human reviewer with actual Indian wedding vendor contract experience needs to annotate the initial golden test set outputs once, and those annotations become the grader's reference answers. After that, the grader uses these as ground truth rather than generating norms from scratch. | 1–2 Indian wedding planners or contract attorneys | One-time, before V1 private beta |
| **H2** Cultural accuracy for Tamil Hindu and interfaith | The model grader handles North Indian Hindu and Punjabi Sikh accurately because the cultural knowledge block enumerates these explicitly. Tamil Hindu and interfaith combinations involve ceremony sequencing and regional terminology that are harder to fully enumerate in a prompt. For these specific combinations, a community validator spot-check is required. | 1 Tamil Hindu community validator, 1 interfaith (Sikh + Hindu) reviewer | One-time before V1 launch |
| **C3** Voice match quality (beyond prohibited phrases) | The script catches prohibited phrases exactly. The model grader assesses sentence length and formality level. But whether an email actually sounds like a specific planner is a holistic judgment that requires the planner herself. This is handled at onboarding — the planner reads 3 AI-generated drafts and rates them. This is not a per-eval-run check; it is a one-time style profile validation per planner. | Each planner, at onboarding | Per planner, once at setup |

---

## Scaling to Diverse and Large Test Sets

### Synthetic Contract Generation

Real contracts are scarce before launch. Until 50+ real contracts are collected (the PRD target), synthetic contracts fill the gap. A contract generator produces contracts with known properties, enabling automatic ground-truth verification.

```python
def generate_contract(
    vendor_category,       # "Photographer" | "Caterer" | "DJ" | etc.
    has_force_majeure,     # bool
    cancellation_type,     # "sliding_scale" | "full_forfeiture" | "none"
    upfront_percent,       # int: 25, 50, 75
    has_liability_cap,     # bool
    liability_cap_amount,  # int, or None
    has_overtime_clause    # bool
):
```

Each generated contract has a pre-computed set of expected flags. The script tier checks actual flags against expected flags automatically. This allows B1/B2/B4 to be run across hundreds of contract variations without a human reading any of them.

### Cultural Combination Matrix (Module H)

Create a matrix covering the 4 required traditions × interfaith permutations × edge cases (civil ceremony only, traditional + modern blend). The matrix is small (< 20 combinations), but each can be run automatically and scored by the model grader using the cultural knowledge block as the reference answer.

| Tradition | Standard | Edge Case |
|-----------|----------|-----------|
| North Indian Hindu | Both sides Hindu | One side non-practicing |
| Punjabi Sikh | Gurdwara ceremony | Civil + cultural celebration only |
| Gujarati Hindu | Full event sequence | Garba night separate from Sangeet |
| Tamil Hindu | Nichayathartham through Reception | NRI family, Chennai heritage |
| Interfaith Sikh + Hindu | Sequential ceremonies | One ceremony, blended traditions |
| No religious ceremony | Civil only | Family pressure scenario |

### Batch Execution and Reporting

Run the full test suite as a batch job: loop through every test case in the golden set, call the Shaadi AI prompt, collect outputs, run all Tier 1 scripts, fan out Tier 2 grader calls in parallel, aggregate scores. Output a single summary report:

```
MODULE   BENCHMARK   CASES   PASS   FAIL   SCORE   THRESHOLD   STATUS
A        A1          10      9      1      4.1     ≥ 4.0       PASS
A        A2          10      9      1      88%     ≥ 90%       FAIL  ← reading level
B        B2          15      14     1      6.7%    ≤ 5%        FAIL  ← 1 RED missed
D        D2          12      12     0      100%    100%        PASS
...
```

Any `FAIL` row blocks promotion of the prompt change. This makes the eval gate machine-enforced, not a reminder on someone's calendar.

### Regression Protection

The golden test set must include at least one instance of every confirmed failure mode (F-R1 through F-R4 from the April 4 eval run, plus the 10 taxonomy entries in `Design/evals.md`). These cases never rotate out. New cases are added; old cases are never removed. This ensures that fixing a bug in one prompt update cannot silently reintroduce a past failure.

---

## Why Not More Human Evaluation

The benchmarks that feel like they need a human often just need a well-written rubric. A1 (clause coverage) feels like it requires someone to "read" the contract — but what that means is: compare field X to section Y of the contract and check for accuracy. A language model with the contract in context does this reliably when given explicit criteria.

The only cases where human judgment is genuinely irreplaceable are the ones in Tier 3 — where the correctness criterion cannot be fully articulated in words (cultural fluency, voice match, market norm validation). For everything else, encoding the criterion as a rubric and running it as a grader call produces scalable, auditable, and repeatable evaluation at near-zero marginal cost per run.

---

## Summary — Benchmark-to-Method Map

| Benchmark | Method | Phase |
|-----------|--------|-------|
| U1 Format Compliance | Script | MVP |
| U2 Field Completeness | Script | MVP |
| U3 Hallucination Avoidance | Model Grader | MVP |
| U4 Scope Discipline | Model Grader | MVP |
| U5 Disclaimer Presence | Script | MVP |
| A1 Clause Coverage | Model Grader | MVP |
| A2 Reading Level | Script | MVP |
| A3 "Not Specified" Accuracy | Model Grader | MVP |
| A4 One-Sentence Summary | Script (word count) + Model Grader (content) | MVP |
| B1 Flag Accuracy | Model Grader + Human calibration (one-time) | MVP |
| B2 False Negative Rate | Model Grader + Human calibration (one-time) | MVP |
| B3 Market Norm Quality | Model Grader + Human calibration (one-time) | MVP |
| B4 Risk Score Consistency | Script | MVP |
| C1 Clause Specificity | Model Grader | MVP |
| C2 Tone Accuracy | Model Grader | MVP |
| C3 Style Profile Adherence | Script (prohibited phrases) + Human (voice, at onboarding) | MVP |
| C4 Send-Readiness | Model Grader | MVP |
| D1 Obligation Completeness | Model Grader | MVP |
| D2 Date Calculation Accuracy | Script | MVP |
| D3 Party Assignment | Model Grader | MVP |
| E1 Required Info Completeness | Script | V1 |
| E2 Indian Wedding Context | Model Grader | V1 |
| E3 CTA Clarity | Script | V1 |
| F1 Priority Alignment | Model Grader | V1 |
| F2 Math Validity | Script | V1 |
| F3 Trade-off Clarity | Model Grader | V1 |
| G1 Extraction Recall | Script | V1 |
| G2 No Invented Data | Model Grader | V1 |
| G3 Duplicate Detection | Script | V1 |
| H1 Conversational Flow | Model Grader | V1 |
| H2 Cultural Accuracy | Model Grader + Human (Tamil Hindu / interfaith only) | V1 |
| H3 Open Questions | Model Grader | V1 |

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Design/evals.md, Development/example\_data.md, Design/use\_cases.md*
