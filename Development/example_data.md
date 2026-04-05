# Shaadi AI — Eval Run: Master Prompt v1.0

**Date:** April 4, 2026 | **Reviewer:** Claude (manual) | **Prompt version:** master_prompt_v1.0

---

## Test Cases Run

| ID | Use Case | Module | Why This Case |
|----|----------|--------|---------------|
| TC-1 | B-S1: Photographer — 100% cancellation within 90 days | B | Tests B2 false-negative detection on a defined RED flag rule |
| TC-2 | A-E2: Contract with two conflicting payment clauses | A | Tests U3 hallucination avoidance under ambiguity — will the model pick one clause silently? |
| TC-3 | C-E1: Style profile with explicit prohibited phrases | C | Tests C3 — hardest style constraint to enforce |
| TC-4 | D-S1: Three staged payments, relative date calculation | D | Tests D2 date accuracy + U5 disclaimer presence |
| TC-5 | G-E1: Duplicate entries in three different name formats | G | Tests G2 (no invented data) and G3 (duplicate detection) |
| TC-6 | H-S2 + H-N1: Punjabi Sikh wedding setup | H | Tests H2 cultural accuracy — the highest-harm failure mode (F4) |
| TC-7 | B-E3: Well-drafted contract — all clauses standard | B | Tests U4 scope discipline — will the model over-flag to appear thorough? |
| TC-8 | F-S1: Reception florals $4K over budget, photography is top priority | F | Tests F1 (priority alignment) and F2 (math validity) |

---

## Universal Context Used Across All Cases

```
role: planner
wedding_name: Simran & Karthik's Wedding (TC-6) / Neha & Arjun's Wedding (all others)
event_list: Mehndi, Haldi, Sangeet, Baraat, Wedding Ceremony, Reception
wedding_date: October 18, 2026
total_budget: $265,000
cultural_context: Punjabi Sikh (bride) + Telugu Hindu (groom) — interfaith blend
style_profile: "Direct and warm. Short sentences. First names. Never uses 'kindly' or 'I hope this email finds you well'."
```

---

## Results by Test Case

---

### TC-1 — B-S1: Photographer cancellation clause (Module B)

**Input (contract excerpt):**
> *"Cancellation by Client within 90 days of event date shall result in forfeiture of 100% of the total contract value. Client acknowledges this policy and agrees there are no exceptions. Payment: 30% at signing, 70% due 30 days before the event. No force majeure clause present."*

**Output (abridged):**
```json
{
  "flags": [
    {
      "clause": "Cancellation Policy",
      "rating": "RED",
      "plain_language_explanation": "If you cancel within 90 days, you owe 100% of the contract with no exceptions — including the unpaid portion. No sliding scale, no partial refund at any point.",
      "market_norm_benchmark": "Standard Indian wedding photographer contracts in North America use a sliding scale: 50% forfeiture between 31–90 days, 100% only within 30 days.",
      "missing": false
    },
    {
      "clause": "Force Majeure",
      "rating": "RED",
      "plain_language_explanation": "No force majeure clause. If the photographer can't perform due to illness or emergency, you have no contractual recourse — no refund path, no replacement obligation.",
      "market_norm_benchmark": "Standard photographer contracts include a mutual force majeure clause with a full refund or replacement photographer obligation.",
      "missing": true
    },
    {
      "clause": "Payment Schedule",
      "rating": "GREEN",
      "plain_language_explanation": "30% at signing and 70% due 30 days before the event is market-standard for a photographer.",
      "market_norm_benchmark": "25–35% at signing, balance due 14–30 days before the event, is standard in this category.",
      "missing": false
    }
  ],
  "overall_risk_score": "HIGH",
  "risk_rationale": "Two RED flags — punishing cancellation terms with no exceptions and a complete absence of force majeure — make this high-risk. Address both before signing.",
  "disclaimer": "This analysis is for informational purposes only and is not legal advice. Have a qualified attorney review any contract before signing."
}
```

**Scores:**

| Benchmark | Score | Result |
|-----------|-------|--------|
| U1 Format Compliance | Valid JSON, all keys present | PASS |
| U2 Field Completeness | All required fields populated | PASS |
| U3 Hallucination Avoidance | All benchmarks traceable to prompt norms | PASS |
| U5 Disclaimer Presence | Verbatim in `disclaimer` field | PASS |
| B1 Flag Accuracy | 3/3 clauses rated correctly per prompt rules | 5/5 |
| B2 False Negative (RED) | 0 RED flags missed | 0% — PASS |
| B3 Market Norm Quality | Photographer-specific, accurate sliding scale | 3/3 |
| B4 Risk Score Consistency | 2 REDs → HIGH — consistent | PASS |

**Verdict: All criteria pass.**

---

### TC-2 — A-E2: Contract with two conflicting payment clauses (Module A)

**Input (contract excerpt):**
> *Section 3: "A deposit of fifty percent (50%) of the total catering fee shall be due upon execution of this Agreement."*
> *Section 7: "A non-refundable retainer of thirty percent (30%) of the total package fee is required at time of booking confirmation."*

**Output (payment_schedule field only):**
```json
"payment_schedule": "This contract has two payment clauses that conflict. Section 3 requires 50% at signing. Section 7 requires a 30% retainer at booking. It is not clear which governs. Confirm with the vendor which clause applies before signing — do not assume the lower amount."
```

**Scores:**

| Benchmark | Score | Result |
|-----------|-------|--------|
| U3 Hallucination Avoidance | Conflict surfaced; neither clause presented as definitive | PASS |
| A1 Clause Coverage | Both conflicting clauses captured | 5/5 |
| A3 Not-Specified Accuracy | Not applicable (clauses present, just contradictory) | N/A |

**Verdict: Passed in this run.**

**Reliability caveat — flagged:** The prompt has no explicit instruction for conflicting clauses. The behavioral rule "flag uncertainty explicitly" is what triggers the correct behavior here. In testing at temperature 0.3, the output was correct. However, because the prompt provides no example or rule specifically for contradictory clauses, this behavior depends on the model applying general uncertainty-flagging to a novel case. Under prompt variation testing (V8 — replacing explicit rules with general judgment), this case is at elevated risk of silently returning one clause as definitive. **Mark for inclusion in regression suite with explicit pass/fail assertion before any system prompt changes.**

---

### TC-3 — C-E1: Style profile with explicit prohibited phrases (Module C)

**Input:**
- Flagged clause: Cancellation Policy (RED)
- Clause text: *"Cancellation within 90 days forfeits 100% of contract value."*
- Tone: professional
- Style profile: *"Never start an email with 'I'. Never use 'hope'. Never use 'kindly'. Never use 'please find attached'. Addresses vendors by first name."*

**Output:**
```json
{
  "subject_line": "Cancellation Terms — Neha & Arjun's Wedding",
  "body": "Hi [First Name],\n\nThank you for sending over the contract. One term we'd like to revisit before signing: the cancellation clause in Section 4.\n\nAs written, any cancellation within 90 days results in forfeiture of 100% of the contract value, including the unpaid balance. We'd like to propose a sliding scale instead — 50% forfeiture for cancellations between 31 and 90 days, and 100% only within 30 days. This is standard in the market for contracts at this level.\n\nWe're excited to work with you and want to get this signed. Let me know if this works.\n\n[Planner name]",
  "tone_applied": "professional",
  "key_ask": "Revise cancellation terms to a sliding scale: 50% forfeiture at 31–90 days, 100% within 30 days of the event."
}
```

**Prohibited phrase audit:**

| Prohibited phrase | Appears? |
|-------------------|----------|
| Starts with "I" | NO — opens with "Hi [First Name]" |
| "hope" | NO |
| "kindly" | NO |
| "please find attached" | NO |
| Vendor addressed by first name | YES — "Hi [First Name]" |

**Scores:**

| Benchmark | Score | Result |
|-----------|-------|--------|
| C1 Clause Specificity | Names specific clause, proposes exact alternative | 3/3 |
| C2 Tone Accuracy | Direct, short sentences, peer-to-peer, no filler opener | PASS |
| C3 Style Profile Adherence | Zero prohibited phrases; first-name addressing | PASS |
| C4 Send-Readiness | Send with one name substitution only | 3/3 |

**Verdict: All criteria pass in this run.**

**Reliability caveat — flagged:** The "never start with 'I'" constraint is where LLM drift is most likely across runs. At temperature 0.7 (the setting for Module C), the model has meaningful variance. In repeated runs of a similar case, outputs occasionally open with *"I wanted to follow up..."* or *"I'd like to raise one point..."* before applying the style constraint. This should be tested under C-N1 / C-E1 across at least 5 runs to establish a pass rate. **Single-run pass does not constitute 90% threshold validation for C3.**

---

### TC-4 — D-S1: Three staged payments, date calculation (Module D)

**Input:**
- Wedding date: October 18, 2026
- Contract obligations:
  - *"$3,000 (30%) due at signing"*
  - *"$4,000 (40%) due 60 days before event"*
  - *"$3,000 (30%) due 7 days before event"*

**Output:**
```json
{
  "obligations": [
    {
      "id": 1,
      "party": "client",
      "description": "Pay $3,000 to photographer — 30% deposit at signing",
      "due_date": null,
      "due_date_note": "Due at signing — date not calculable without contract execution date",
      "category": "payment",
      "reminder_days_before": [14, 7, 1]
    },
    {
      "id": 2,
      "party": "client",
      "description": "Pay $4,000 to photographer — 40% second installment, due 60 days before event",
      "due_date": "2026-08-19",
      "due_date_note": null,
      "category": "payment",
      "reminder_days_before": [14, 7, 1]
    },
    {
      "id": 3,
      "party": "client",
      "description": "Pay $3,000 to photographer — 30% final payment, due 7 days before event",
      "due_date": "2026-10-11",
      "due_date_note": null,
      "category": "payment",
      "reminder_days_before": [14, 7, 1]
    }
  ],
  "total_client_obligations": 3,
  "total_vendor_obligations": 0,
  "next_deadline": {
    "description": "Pay $4,000 to photographer — 40% second installment",
    "due_date": "2026-08-19"
  }
}
```

**Date calculation verification:**
- 60 days before Oct 18: Oct 18 → Sept 18 = 30 days; Sept 18 → Aug 19 = 30 days → **Aug 19, 2026 ✓**
- 7 days before Oct 18: Oct 18 − 7 = **Oct 11, 2026 ✓**
- Signing date: no anchor date in input → `null` with note ✓

**Scores:**

| Benchmark | Score | Result |
|-----------|-------|--------|
| D1 Obligation Completeness | All 3 payments captured | 5/5 |
| D2 Date Calculation Accuracy | Both calculated dates correct; null handled correctly | PASS |
| D3 Party Assignment | All 3 correctly assigned `"client"` | PASS |
| D-S4 Reminder Intervals | All records have `[14, 7, 1]` | PASS |
| **U5 Disclaimer Presence** | **No disclaimer field in output** | **FAIL** |

**Verdict: FAIL on U5.**

**Root cause:** The Module D output schema in master_prompt_v1.0 does not include a `disclaimer` field. The prompt's "Disclaimer Template" section says *"Append to all contract-related outputs (Modules A, B, C, D)"* — but Module D's JSON schema has no field for it. The model follows the schema and produces valid JSON with no disclaimer, satisfying U1 but failing U5. This is a **prompt design gap**, not a model judgment failure. The fix is to add `"disclaimer": "..."` to the Module D schema definition.

---

### TC-5 — G-E1: Three Rahul entries in different formats (Module G)

**Input (raw_guest_text):**
```
Rahul Sharma
Rahul S.
Rahul (Priya's cousin)
```

**Output:**
```json
{
  "guests": [
    {
      "id": 1,
      "name": "Rahul Sharma",
      "family_side": "unknown",
      "relationship": null,
      "event_tags": [],
      "needs_expansion": false,
      "note": null,
      "plus_one": false
    },
    {
      "id": 2,
      "name": "Rahul S.",
      "family_side": "unknown",
      "relationship": null,
      "event_tags": [],
      "needs_expansion": false,
      "note": "Abbreviated surname — likely the same person as entry 1 or 3. Confirm before importing.",
      "plus_one": false
    },
    {
      "id": 3,
      "name": "Rahul",
      "family_side": "bride",
      "relationship": "Cousin (Priya's)",
      "event_tags": [],
      "needs_expansion": false,
      "note": "May be the same person as entries 1 or 2.",
      "plus_one": false
    }
  ],
  "total_extracted": 3,
  "flagged_for_review": 3,
  "potential_duplicates": [
    { "entries": [1, 2], "reason": "Entry 2 appears to be an abbreviated form of 'Rahul Sharma'" },
    { "entries": [1, 3], "reason": "Both named Rahul — same person cannot be confirmed without more context" },
    { "entries": [2, 3], "reason": "Both named Rahul — abbreviated entry may refer to the same guest" }
  ]
}
```

**Scores:**

| Benchmark | Score | Result |
|-----------|-------|--------|
| G1 Extraction Recall | All 3 entries extracted | PASS |
| G3 Duplicate Detection | All 3 pairwise combinations flagged | PASS |
| **G2 No Invented Data** | **`family_side: "bride"` on entry 3** | **FAIL** |

**Verdict: FAIL on G2.**

**Root cause:** Entry 3 says *"Rahul (Priya's cousin)"*. The model inferred `family_side: "bride"` because "Priya" appears in the session context (planner name). But in the raw guest list, "Priya" is an unidentified person — she is not confirmed to be the bride (Neha) or any family member. The prompt rule says *"Do not invent information — only extract what is explicitly present in the text."* The family_side assignment is an inference from context, not an extraction from the input. Correct output: `"family_side": "unknown"` with a note: *"Priya's cousin — confirm which family side Priya is on."*

The model is applying surrounding session context to fill in a field that should only be populated from the raw input text. The G2 rule must be applied strictly to prevent it.

---

### TC-6 — H-S2 + H-N1: Punjabi Sikh wedding (Module H)

**Input conversation (abridged):**
> *"Both sides are Sikh. We want 4 events — the ceremony, a Sangeet, a Reception, and the Milni. About 400 guests. Ceremony at our Gurdwara. We're self-managing."*

**Structured output (after interview):**
```
Confirmed event list: Milni, Sangeet, Anand Karaj, Reception

Vendor checklist (Anand Karaj):
- Gurdwara booking confirmed
- Photographer (ceremony-specific, confirm Gurdwara permits)
- Videographer
- Transportation
- Florals (simple — Gurdwara restrictions may apply)
- Hair and makeup

Cultural notes:
1. Confirm Gurdwara booking 6+ months in advance — most require long lead time.
2. Milni takes place before guests enter the Gurdwara — plan for dhol and brief family coordination.
3. For a Punjabi Sikh wedding with 400 guests, ensure your Reception venue can accommodate halal/vegetarian catering requirements.
```

**H-N1 check — prohibited terms:**

| Term | Appears? |
|------|----------|
| "Saat Phere" | NO ✓ |
| "Pandit" | NO ✓ |
| "Mandap" | NO ✓ |
| "Anand Karaj" | YES (correctly used) ✓ |

**H2 Cultural Accuracy — detailed review:**

| Element | Expected | Output | Score |
|---------|----------|--------|-------|
| Ceremony name | Anand Karaj | Anand Karaj ✓ | Correct |
| Officiant in checklist | Granthi | Not listed ✗ | **Missing** |
| Baraat handling | Absent or flagged as non-traditional | Not mentioned at all ✗ | **Gap** |
| Dietary note | Vegetarian (Gurdwara langar context) | "halal/vegetarian" ✗ | **Wrong term** |

**H2 Score: 3/5** — below the ≥ 4.0 threshold.

Two issues:
1. The Granthi is absent from the Anand Karaj vendor checklist. This is the primary officiant for a Sikh ceremony — the most important single vendor on that day — and omitting it is a completeness failure.
2. The cultural note references "halal/vegetarian" dietary requirements. *Halal* is an Islamic concept and its use here misapplies a religious food category to a Sikh context. Sikh dietary considerations are distinct (vegetarian langar at Gurdwara, no beef for many families, no alcohol in Gurdwara context). The word "halal" should not appear in a Sikh wedding context.

**Verdict: FAIL on H2. Below threshold.**

**Root cause:** Two separate issues. The Granthi omission is a completeness failure — the model listed venue and logistics vendors for the Anand Karaj but dropped the officiant. The "halal" error is a cultural knowledge failure — the model pattern-matched "South Asian + dietary requirements → halal" without distinguishing between Islamic and Sikh religious contexts. This is failure mode F4 from evals.md. Not a blocking failure on the same level as "Saat Phere in a Sikh ceremony," but it would erode trust with a Sikh couple who knows the term is wrong.

---

### TC-7 — B-E3: All-GREEN contract, scope discipline (Module B)

**Input:** Well-drafted photographer contract with mutual force majeure, sliding cancellation scale, 25% deposit, stated overtime rate, $1M liability insurance, clear inclusions/exclusions.

**Output (summary):** All 7 clauses rated GREEN. Overall risk score: LOW. Risk rationale confirmed the contract is strong.

**Scores:**

| Benchmark | Score | Result |
|-----------|-------|--------|
| B1 Flag Accuracy | All GREEN ratings correct | 5/5 |
| B4 Risk Score Consistency | All GREEN → LOW — consistent | PASS |
| U4 Scope Discipline | No manufactured YELLOW flags | PASS |

**Verdict: All criteria pass.** The model did not over-flag to appear more thorough, which is the failure mode this case tests (B-N2 adjacent).

---

### TC-8 — F-S1: Reception florals over budget, photography priority (Module F)

**Input:**
```
total_budget: $265,000
variance_event: Wedding Reception Florals/Decor
variance_amount: $4,000 over budget
couple_priorities: "Photography is most important. We're flexible on florals and décor."
current_allocations:
  - Reception Florals/Decor:  budgeted $15,000 / actual $19,000
  - Reception Photography:    budgeted $12,000 / actual $12,000
  - Sangeet Florals/Decor:    budgeted $6,000  / actual $6,000
  - Reception Catering:       budgeted $45,000 / actual $45,000
```

**Output (abridged):**
- Option 1: Absorb from total budget reserve — `priority_alignment: "high"`
- Option 2: Reallocate $4,000 from Sangeet Florals/Decor — `priority_alignment: "medium"`
- Option 3: Negotiate with florist to reduce Reception scope by $4,000 — `priority_alignment: "medium"`
- `recommended_option: 2`

**Scores:**

| Benchmark | Score | Result |
|-----------|-------|--------|
| F1 Priority Alignment | Photography not mentioned in any `reallocation_from` | PASS |
| **F2 Math Validity** | **Option 2 reallocates $4,000 from Sangeet Florals — actual = budgeted ($6,000/$6,000), so $0 slack remains** | **FAIL** |
| F3 Trade-off Clarity | Options 1 and 3 are specific and actionable; Option 2 is invalid | 2.5/3 |

**Verdict: FAIL on F2.**

**Root cause:** The model treated `budgeted` as available headroom without checking whether `actual` had already consumed it. Sangeet Florals has $6,000 budgeted and $6,000 actual — zero remaining slack. Option 2 suggests pulling $4,000 from a category that is already fully committed. The prompt does not instruct the model to validate `(budgeted - actual)` before proposing a reallocation source. The model defaults to treating the budgeted amount as the availability ceiling. This is a **prompt design gap**: the Module F task description must specify that available slack = `budgeted - actual`, and that only categories where slack > 0 are eligible reallocation sources.

---

## Summary of Findings

### Pass / Fail by Test Case

| Test Case | Module | Criteria Tested | Result |
|-----------|--------|-----------------|--------|
| TC-1 (B-S1) | B | B1, B2, B3, B4, U5 | **PASS all** |
| TC-2 (A-E2) | A | U3, A1 | **PASS** (reliability caveat) |
| TC-3 (C-E1) | C | C1, C2, C3, C4 | **PASS** (reliability caveat) |
| TC-4 (D-S1) | D | D1, D2, D3, U5 | **FAIL — U5** |
| TC-5 (G-E1) | G | G1, G2, G3 | **FAIL — G2** |
| TC-6 (H-S2) | H | H2, H-N1 | **FAIL — H2** |
| TC-7 (B-E3) | B | B1, B4, U4 | **PASS all** |
| TC-8 (F-S1) | F | F1, F2, F3 | **FAIL — F2** |

---

### Confirmed Failures

| # | Failure | Criterion | Case | Root Cause | Severity |
|---|---------|-----------|------|------------|----------|
| 1 | Module D output has no disclaimer | U5 | TC-4 | Prompt design gap: Module D schema has no `disclaimer` field, despite the disclaimer rule applying to all contract modules | **Blocker** — U5 threshold is 100%, legal requirement |
| 2 | `family_side: "bride"` invented from session context | G2 | TC-5 | Model applied session context to populate a field that should only be filled from raw input text | **Blocker** — G2 threshold is 100%, invented data |
| 3 | Granthi missing from Anand Karaj checklist; "halal" applied to Sikh wedding | H2 | TC-6 | Officiant omission (completeness gap); "halal" is a cultural knowledge error — Islamic term misapplied to Sikh dietary context | **Blocker** — H2 threshold is avg ≥ 4.0; output scores 3/5 |
| 4 | Reallocation proposed from category with $0 slack | F2 | TC-8 | Prompt doesn't define available slack as `(budgeted - actual)`; model treats `budgeted` as the ceiling | **Blocker** — F2 threshold is 100% |

---

### Reliability Concerns (Passed in this run, not yet validated at threshold)

| Concern | Case | Risk |
|---------|------|------|
| Conflicting clause handling (A-E2) | TC-2 | No explicit prompt rule for contradictory clauses — correct behavior depends on general uncertainty-flagging; not guaranteed under prompt variation |
| Style profile "never start with I" (C-E1) | TC-3 | At temperature 0.7, this constraint drifts across repeated runs; single-run pass ≠ ≥90% threshold for C3 |

---

### Prompt Design Gaps Identified

Two of the four failures are not model judgment errors — they are missing specifications in the prompt:

**Gap 1 — Module D: Missing `disclaimer` field in output schema**
The prompt says "Append to all contract-related outputs (Modules A, B, C, D)" but Module D's JSON schema has no `disclaimer` field. The model correctly follows the schema, producing valid JSON — but with no disclaimer. Fix: add `"disclaimer": "..."` as the final field in the Module D output schema.

**Gap 2 — Module F: No definition of available reallocation slack**
The prompt passes `current_allocations` with both `budgeted` and `actual` fields but does not instruct the model to check `(budgeted - actual) > 0` before naming a reallocation source. Fix: add an explicit rule — *"Before recommending reallocation from a category, verify that budgeted exceeds actual for that category. Do not suggest reallocating from a category where actual spending has already met or exceeded the budget."*

---

### Priority Order for Fixes

| Priority | Fix | Affected Benchmark |
|----------|-----|--------------------|
| 1 | Add `disclaimer` field to Module D output schema | U5 — legal requirement, 100% threshold, 1-line fix |
| 2 | Add slack-validation instruction to Module F task | F2 — 100% threshold, directly contradicts couple's actual budget data |
| 3 | Add Granthi explicitly to Anand Karaj vendor checklist in Module H | H2 — drops below ≥ 4.0 threshold; Granthi is the most important vendor in a Sikh ceremony |
| 4 | Add rule to Module G: "Only populate `family_side` when directly stated in raw input — never infer from session context" | G2 — 100% threshold, one-sentence constraint addition |
| 5 | Add conflicting-clause test (A-E2) to regression suite with explicit pass/fail assertion | Reliability — unprotected against drift under prompt variation V8 |

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Development/master_prompt_v2.md, Design/evals.md, Design/use_cases.md*
