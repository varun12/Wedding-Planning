# Shaadi AI — Required Input Fields

**Author:** Varun Maryada
**Version:** 1.0
**Date:** April 2026
**Purpose:** Define every input field passed to the Claude API — format, source, and whether required — across all 8 task modules

---

## Structure

Inputs break into two layers:
- **Universal context fields** — sent on every API call regardless of task
- **Module-specific fields** — vary by task module

---

## Universal Context Fields (All Modules)

Injected into every API call from the Bubble database via Make.

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `role` | String enum: `"planner"` \| `"couple"` \| `"parent"` | Bubble auth session | Yes |
| `wedding_name` | String (e.g., `"Neha & Arjun's Wedding"`) | Bubble database | Yes |
| `event_list` | Comma-separated string (e.g., `"Mehndi, Sangeet, Reception"`) | Bubble database | Yes |
| `wedding_date` | Date string (e.g., `"October 18, 2026"`) | Bubble database | Yes |
| `total_budget` | Currency string (e.g., `"$265,000"`) | Bubble database | Yes |
| `cultural_context` | Free text (e.g., `"Punjabi Sikh (bride) + Telugu Hindu (groom)"`) | Bubble database — set during Module H interview | Yes |
| `style_profile` | Free text — extracted from planner's sample emails | Bubble database — set during planner onboarding | Optional — omit field entirely if not set up |

---

## Module-Specific Fields

---

### Module A — Contract Summary

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `contract_text` | Long string — raw extracted text | PDF.co → Make (extraction pipeline) | Yes |
| `vendor_name` | String (e.g., `"Visions by Rahul Photography"`) | User input in Bubble vendor profile | Yes |
| `vendor_category` | String enum: `"Photographer"` \| `"Caterer"` \| `"Venue"` \| `"Decorator"` \| `"DJ/Band"` \| `"Makeup Artist"` \| `"Pandit"` | User selection in Bubble UI | Yes |
| `event_name` | String (e.g., `"Wedding Ceremony + Reception"`) | User selection in Bubble UI | Yes |

---

### Module B — Clause Flagging

Same input fields as Module A. Runs as a separate API call on the same contract text immediately after Module A completes.

---

### Module C — Response Drafting

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `flagged_clause` | String — clause category name (e.g., `"Cancellation Policy"`) | Module B JSON output — passed by Make | Yes |
| `flag_rating` | String enum: `"YELLOW"` \| `"RED"` | Module B JSON output | Yes |
| `clause_text` | String — exact original contract language | Module B JSON output | Yes |
| `plain_language_explanation` | String — Module B's explanation of the flag | Module B JSON output | Yes |
| `vendor_name` | String | Bubble database | Yes |
| `vendor_category` | String | Bubble database | Yes |
| `tone` | String enum: `"professional"` \| `"warm"` \| `"formal"` | User selection in Bubble UI | Yes |
| `style_profile` | Free text | Bubble database | Optional |

---

### Module D — Obligation Extraction

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `contract_text` | Long string — same raw text as Module A | PDF.co → Make | Yes |
| `vendor_name` | String | Bubble database | Yes |
| `vendor_category` | String | Bubble database | Yes |
| `event_name` | String | Bubble database | Yes |
| `wedding_date` | Date string — used for absolute date calculation | Bubble database | Yes |

---

### Module E — Vendor Outreach

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `vendor_category` | String | User selection in Bubble UI | Yes |
| `event_name` | String | User selection in Bubble UI | Yes |
| `event_date` | Date string (e.g., `"October 17, 2026"`) | Bubble database — per-event date | Yes |
| `guest_count` | Integer | Bubble database — per-event headcount | Yes |
| `venue_name` | String | Bubble database — may be empty if not yet confirmed | Optional — pass empty string if unknown |
| `budget_range` | String (e.g., `"$18,000–$22,000"`) | Bubble database — may be empty | Optional — pass empty string if not set |
| `specific_requirements` | Free text | User input in Bubble UI | Optional — pass empty string if none |
| `tone` | String enum: `"professional"` \| `"warm"` \| `"formal"` | User selection | Yes |
| `style_profile` | Free text | Bubble database | Optional |

---

### Module F — Budget Advisor

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `total_budget` | Currency string | Bubble database | Yes |
| `current_allocations` | JSON array — events with `budgeted` and `actual` amounts | Bubble database — budget tracker records | Yes |
| `variance_event` | String — name of the over/under-budget event | Bubble calculated field (auto-detected) | Yes |
| `variance_amount` | String (e.g., `"$4,000 over budget"`) | Bubble calculated field | Yes |
| `couple_priorities` | Free text | Bubble database — set during onboarding | Optional — pass empty string if not set |

---

### Module G — Guest List Import

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `raw_guest_text` | Free text — any format (WhatsApp, spreadsheet, typed) | User paste input in Bubble UI | Yes |
| `event_list` | Comma-separated string | Bubble database — same as universal context | Yes |

---

### Module H — Cultural Setup Interview

| Field | Format | Source | Required |
|-------|--------|--------|----------|
| `user_role` | String enum: `"planner"` \| `"couple"` | Bubble auth session | Yes |
| `wedding_name` | String | User input during wedding creation | Yes |

This module is conversational — subsequent turns pass the full conversation history as the message array rather than structured fields.

---

## Three Fields That Need Extra Attention

**`contract_text`** — Quality depends entirely on the PDF.co extraction. If extraction fails (scanned PDF), this field arrives empty or near-empty. Make must validate the character count before calling Claude and route to an error branch if below ~200 characters.

**`current_allocations`** (Module F) — The only field that requires a structured JSON object as input rather than a simple string. Bubble must serialize the budget records into a JSON array before passing to Make. Define the schema explicitly in the Make scenario to avoid malformed inputs.

**`style_profile`** — When absent, omit the field entirely from the prompt rather than passing an empty string. Passing an empty `style_profile` field can cause the model to note the absence in the output, which surfaces unnecessarily in the UI.

---

## Field Count Summary

| Module | Required Fields | Optional Fields | Total |
|--------|----------------|-----------------|-------|
| Universal context | 6 | 1 | 7 |
| A — Contract Summary | 4 | 0 | 4 |
| B — Clause Flagging | Same as A | — | — |
| C — Response Drafting | 7 | 1 | 8 |
| D — Obligation Extraction | 5 | 0 | 5 |
| E — Vendor Outreach | 4 | 4 | 8 |
| F — Budget Advisor | 4 | 1 | 5 |
| G — Guest List Import | 2 | 0 | 2 |
| H — Cultural Setup | 2 | 0 | 2 |

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Design/master\_prompt\_v1.md, Development/model\_selection.md*
