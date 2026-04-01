# Shaadi AI — Output Quality Criteria

**Author:** Varun Maryada
**Version:** 1.0
**Date:** April 2026
**Purpose:** Define the qualitative criteria a human reviewer uses to judge whether an AI output is good — distinct from evals.md, which defines thresholds and measurement methods

---

## How This Relates to evals.md

`evals.md` defines *how to measure* — numeric thresholds, rubrics, test cases, pass/fail rules.

This document defines *what to look for* — the judgment criteria applied when a human reads an output and decides if it is good. Both documents are needed: evals.md without this document produces scores without understanding; this document without evals.md produces understanding without accountability.

---

## The Ten Criteria

---

### 1. Factual Accuracy
**The primary criterion.** Every fact in the output must be traceable to the input. For contract tasks: clause text, payment amounts, dates, and market benchmarks must come from the contract or from the prompt's defined norms — not from the model's best guess. For cultural tasks: event names, officiants, and rituals must be correct for the specific tradition stated.

A factually wrong output is always bad, regardless of how well-written it is. This criterion takes precedence over every other criterion on this list.

---

### 2. Structure and Format Compliance
Output must match the defined JSON schema exactly — correct keys, correct nesting, no extra fields, no text outside the JSON block. For conversational outputs (Module H), structure means asking questions in coherent groups and producing the structured summary only after the interview is complete.

Structure is binary: it either parses and validates, or it does not. A well-written clause summary inside a malformed JSON block fails.

---

### 3. Completeness
All required fields populated. All clauses present in the contract addressed. All guests in a raw list extracted. All obligations captured — including those buried in appendices. All input variables surfaced in the output (e.g., every field passed to Module E appears in the email body).

The specific failure mode to watch: **silent omission**. The output looks complete but a clause, obligation, or guest was quietly dropped. Completeness checks require comparing output against the source input, not just reading the output on its own.

---

### 4. Relevance and Specificity
The output must be specific to *this* vendor, *this* event, *this* couple — not generic advice that could apply to any wedding. A RED flag explanation that says "this cancellation policy is unusual" without naming the specific clause or proposing a concrete alternative is not good. A vendor outreach email that does not mention the Sangeet by name, or a budget suggestion that does not reference the couple's stated priority, is not good.

**The test:** Could this output have been generated without the specific inputs provided? If yes, it is too generic.

---

### 5. Cultural Accuracy
Correct terminology for the specific cultural and religious context stated by the user.

- Sikh wedding: Anand Karaj, Granthi — not Saat Phere or Pandit
- Tamil Hindu wedding: correct ceremony structure, no default Baraat
- Interfaith: both traditions acknowledged explicitly, neither defaulted to

Cultural errors are not minor quality issues — they are trust-breaking failures. A Sikh couple seeing "Pandit" in their vendor checklist will not use the product. This criterion is pass/fail for non-Hindu traditions.

---

### 6. Tone and Voice Match
For drafting tasks (Modules C and E): the output must match the requested tone (professional / warm / formal) and, when a style profile is provided, the planner's actual voice.

**The practical test:** Would the planner send this email without rewriting it? Would a couple read this summary without feeling talked down to or overwhelmed?

Negative constraint adherence is the sharpest test of tone quality. If the style profile states "never use 'kindly'" and "kindly" appears in the output, this criterion fails — regardless of how natural the rest of the email reads.

---

### 7. Clarity and Reading Level
Contract summaries and flag explanations must read at or below an 8th-grade level (Flesch-Kincaid). Legal language must be translated — not paraphrased into slightly simpler legal language.

**The practical test:** Read the `cancellation_policy` field aloud. Would a first-time couple understand exactly what happens if they cancel three months before the wedding?

---

### 8. Uncertainty Calibration
When the model does not know something — a clause is absent, a date cannot be calculated, extracted text is ambiguous — it must say so explicitly. A field that states "Not specified in contract — clarify with vendor before signing" is better than a field that invents a plausible-sounding value. Good calibration means the user knows exactly when to verify something themselves.

The inverse failure is equally important: the model must not over-hedge on clauses that are clearly present and readable. Uncertainty flagging on a straightforward payment schedule erodes confidence in the summary.

---

### 9. Actionability
Every output must enable the user to do something immediately.

- A contract flag without a plain-language explanation of what it means in practice is not actionable
- A budget suggestion without a specific `reallocation_amount` is not actionable
- A vendor outreach email without a clear CTA is not actionable
- A cultural setup output without a confirmed event list is not actionable

**The test:** What does the user do next after reading this output? If the answer is "go figure it out elsewhere," the output is incomplete.

---

### 10. Consistency Across Runs
At extraction temperature settings (0.3), the same input must produce materially identical outputs on repeated runs. A clause rated RED in one run must not be rated YELLOW in another. The one-sentence contract summary must not contradict the clause-level detail in the same response. Module A and Module B outputs on the same contract must be coherent — no clause described as standard in the summary and high-risk in the flags.

---

## How the Criteria Stack

Not all criteria carry equal weight. When trade-offs arise:

| Priority | Criterion | Why |
| --- | --- | --- |
| 1 | Factual accuracy | A wrong fact causes real harm |
| 2 | Cultural accuracy | A cultural error breaks trust immediately |
| 3 | Completeness | A missed RED flag or obligation has direct consequences |
| 4 | Structure / format | A malformed output breaks the pipeline |
| 5 | Uncertainty calibration | Users must know when to verify |
| 6 | Relevance / specificity | Generic output has no product differentiation |
| 7 | Tone and voice match | Drives adoption but does not cause harm if imperfect |
| 8 | Clarity / reading level | Measurable and improvable through prompt iteration |
| 9 | Actionability | Refinement criterion — output is usable before it is optimal |
| 10 | Consistency | Stability criterion — validated through repeated test runs |

---

## Criteria Applied by Module

| Module | Most Critical Criteria | Why |
| --- | --- | --- |
| A — Contract Summary | Factual accuracy, Completeness, Clarity | A missed or misrepresented clause misleads the user before signing |
| B — Clause Flagging | Factual accuracy, Completeness, Uncertainty calibration | A missed RED flag is the highest-harm failure in the system |
| C — Response Drafting | Tone and voice match, Relevance, Actionability | Planner sends this to a client — generic or off-voice drafts damage her reputation |
| D — Obligation Extraction | Factual accuracy, Completeness, Consistency | A wrong date or missed obligation causes a missed payment |
| E — Vendor Outreach | Relevance, Tone and voice match, Actionability | Must name the specific event and include a clear CTA to be useful |
| F — Budget Advisor | Factual accuracy, Relevance, Actionability | Suggestions must respect stated priorities and be arithmetically valid |
| G — Guest List Import | Completeness, Factual accuracy, Structure | Silent guest omissions or invented names create real-world errors |
| H — Cultural Setup | Cultural accuracy, Completeness, Actionability | Cultural errors in the event structure undermine the entire planning framework |

---

---

## Criteria Requiring Human Judgment

Five of the ten criteria cannot be reliably assessed through automated checks alone. They require a human reviewer — ideally someone with domain knowledge of Indian weddings and professional communication standards.

---

### 1. Factual Accuracy — Human Review Required for Contract and Cultural Claims

**What automation can do:** Verify that dollar amounts and dates in the output match values present in the input text. Check that required fields are non-empty.

**What it cannot do:** Determine whether a clause was correctly interpreted. A contract might state "the retainer is non-refundable under all circumstances" and the model might summarise it as "the retainer may be withheld at the vendor's discretion" — both contain the right words, but the interpretation is wrong. Only a human reading the source contract alongside the summary can catch this.

**Who should review:** Someone who has read the actual contract. For market norm benchmarks in Module B, a reviewer with Indian wedding vendor contract experience is required to validate whether the benchmark cited reflects actual market practice.

---

### 2. Cultural Accuracy — Requires Domain Knowledge

**What automation can do:** Flag if a known prohibited term appears (e.g., "Saat Phere" in a Sikh wedding output) using keyword matching.

**What it cannot do:** Assess whether the overall event structure, vendor checklist, and cultural notes are accurate for a specific regional or religious combination. A Tamil Hindu wedding setup that lists the correct ceremony name but includes the wrong ritual sequence, misses the Nichayathartham, or assigns a North Indian musician would pass a keyword check but fail a cultural review.

**Who should review:** A community validator with firsthand knowledge of the specific tradition — not just general South Asian wedding knowledge. This is the hardest criterion to scale and the most important to get right before public launch. The evals.md recommends recruiting 1–2 community validators per cultural variation before the private beta.

---

### 3. Tone and Voice Match — Requires Subjective Judgment

**What automation can do:** Check that prohibited phrases from a style profile do not appear in the output. Verify that sentence length falls within the expected range for a given style.

**What it cannot do:** Assess whether the output actually *sounds like* the planner. Voice matching is a holistic judgment — it involves word choice, rhythm, level of formality within a register, and the emotional register of specific phrases. A planner who reads a draft and thinks "this doesn't sound like me" cannot always articulate why, but the judgment is real and consequential.

**How to assess:** The most reliable method is a blind review — show the planner three drafts (one from the AI, two from her own past emails, lightly edited) and ask her to identify which one she wrote. High voice match means she cannot reliably distinguish the AI draft from her own writing.

**When style profiles are absent:** Human judgment on tone becomes more important, not less. Without a profile to enforce, the output defaults to a professional neutral register that should be verified against the intended persona (planner vs. couple).

---

### 4. Relevance and Specificity — Requires Contextual Reading

**What automation can do:** Verify that specific input values (vendor name, event name, guest count, budget range) appear in the output text.

**What it cannot do:** Assess whether the output is substantively relevant to the situation — whether the flag explanation addresses the actual risk in this contract for this couple at this budget level, or whether the budget suggestion is meaningfully tailored to their wedding rather than a generic reallocation pattern.

**The key judgment:** Is the output specific enough to be useful, or is it generic enough to be useless? This distinction requires reading the output in the context of the full input — something a string-match check cannot replicate.

---

### 5. Actionability — Requires End-User Perspective

**What automation can do:** Verify that a CTA field is non-empty, or that a `key_ask` field contains a complete sentence.

**What it cannot do:** Assess whether a user reading the output would know what to do next. A `key_ask` field might state "Request that the vendor clarify the cancellation terms" — technically a complete sentence, but not specific enough for a couple who has never negotiated a contract to act on. A human reviewer reading from the user's perspective can identify when an output is technically complete but practically insufficient.

**Who should review:** For couple-facing outputs, a non-expert reader (someone unfamiliar with wedding contracts) is the most useful reviewer — they surface where the output assumes knowledge the user doesn't have. For planner-facing outputs, a reviewer who understands vendor communication norms in the Indian wedding market will catch where a draft undersells the ask or over-explains something a planner already knows.

---

## Automated vs. Human Assessment — Summary

| Criterion | Automated | Human Required | Notes |
| --- | --- | --- | --- |
| Factual accuracy | Partial | Yes | Automation catches value mismatches; human catches interpretation errors |
| Structure / format | Yes | No | JSON parsing and schema validation are fully automatable |
| Completeness | Yes | Partial | Field presence is automatable; clause coverage requires human check against source |
| Relevance / specificity | Partial | Yes | Value presence is automatable; substantive relevance requires human judgment |
| Cultural accuracy | Partial | Yes | Keyword flags automatable; structural and contextual accuracy requires domain expert |
| Tone and voice match | Partial | Yes | Prohibited phrase checks automatable; voice quality requires human reader |
| Clarity / reading level | Yes | No | Flesch-Kincaid scoring is fully automatable |
| Uncertainty calibration | No | Yes | Requires judgment about whether expressed confidence is appropriate |
| Actionability | Partial | Yes | CTA presence automatable; practical sufficiency requires human perspective |
| Consistency across runs | Yes | No | Diff of repeated outputs is fully automatable |

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Design/evals.md, Development/required\_input\_fields.md*
