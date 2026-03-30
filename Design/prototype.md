# Shaadi AI — Prototype: AI Demonstration Plan

**Version:** 1.0
**Author:** Varun Nair
**Date:** April 2026
**Scope:** AI Contract Intelligence Suite — primary capstone feature

---

## What AI Aspects Will the Prototype Demonstrate?

The prototype demonstrates the **AI Contract Intelligence Suite** end-to-end — the one feature with complete white space in the competitive landscape. Specifically:

### 1. Contract Text Extraction & Comprehension
- User uploads a vendor PDF contract
- Claude API reads and understands the full legal document
- Demonstrates AI's ability to parse dense legal language at scale

### 2. Structured Clause Analysis (Traffic Light Flagging)
- Claude evaluates 7 standard clause categories: payment schedule, cancellation policy, coverage/scope, overtime fees, exclusivity, liability, force majeure
- Each clause is rated Green / Amber / Red against **Indian wedding vendor market norms** — this is the cultural intelligence layer
- AI produces an overall Low / Medium / High risk score

### 3. Plain-Language Translation
- Claude converts legal clauses into 8th-grade reading level summaries
- Every flagged clause includes a one-sentence industry benchmark (e.g., *"90% of Indian wedding photographer contracts match or exceed the event duration"*)

### 4. AI Response Drafting
- For every Yellow/Red flag, Claude generates a professional vendor negotiation email
- Three tone options (Professional / Warm / Formal) that regenerate the draft in real time
- Demonstrates Claude's ability to adapt tone to context — a core pain point for planners

### 5. Obligation Extraction
- Once a contract is marked signed, Claude extracts all time-bound obligations (payment dates, confirmation calls, submission deadlines) into structured JSON
- Populates the Obligation Tracker with urgency-sorted cards and automated reminders

---

## How Are AI Inputs, Processing & Outputs Presented Visually?

### Input — Contract Upload Screen
- A clear drag-and-drop zone with a dashed purple border signals where the AI interaction begins
- Constraints are shown upfront (PDF only, 25MB max, text-based) so the user understands what the AI needs to work with
- A persistent warning about scanned PDFs sets honest expectations about AI limitations

### Processing — 3-Stage Progress Bar (same screen)
The upload zone transforms into a live progress view with three labeled stages:

```
[ Stage 1 ] Extracting text...        COMPLETE     ← green
[ Stage 2 ] Analyzing clauses...      IN PROGRESS  ← amber
[ Stage 3 ] Generating summary...     WAITING      ← grey
```

This makes the AI pipeline legible — users see exactly what Claude is doing at each step, not just a generic spinner.

### Output — Contract Summary Dashboard
- A full-width **Risk Score Banner** is the first thing users see — color-coded (green/amber/red) with a plain count of flagged clauses
- Each clause section is a color-coded card using the traffic light system — users can scan the entire contract risk at a glance in under 5 seconds
- Every Yellow/Red card includes a benchmark note showing whether the clause is normal for Indian wedding vendors — this is the cultural intelligence made visible

### Output — Flag Detail View
Three distinct visual zones per flag:
1. **Original Contract Language** — verbatim legal text in a traffic-light-colored box
2. **Plain Language Explanation** — Claude's translation in white, with a red warning sentence if action is required
3. **Industry Benchmark** — grey card with a one-sentence norm comparison

This three-layer structure shows the AI's reasoning transparently — not just *what* was flagged, but *why*, and *whether it's unusual*.

### Output — Draft Response Screen
- Subject line and full email body are pre-filled by Claude, editable in place
- Tone switching (Professional / Warm / Formal) triggers a live regeneration — making the AI's adaptability tangible to the user
- A "Copied!" / post-send confirmation closes the loop on the AI's work

### Output — Obligation Tracker
- Cards are urgency-sorted and color-coded (red ≤ 7 days, amber 8–21 days, grey 22+ days)
- Each card shows obligation type, vendor, event, amount, and reminder status — all extracted by Claude from the signed contract
- The reminder automation (14 / 7 / 1 day) is surfaced as visible system state, not hidden background logic

---

## Core Visual Principle

Every AI action is made transparent — users always see the input given to the AI, what it produced, and why, so trust is built through legibility rather than just results.

---

*Last updated: April 2026 | Version 1.0 | Shaadi AI Capstone Project*
