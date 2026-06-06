# Shaadi AI — Navigation & Screen Specifications
## AI Contract Intelligence Suite

**Version:** 1.0  
**Author:** Varun Maryada  
**Date:** April 2026  
**Scope:** AI Contract Intelligence Suite — primary capstone feature

---

## Overview

This document specifies the complete navigation flow and screen-by-screen UI requirements for the AI Contract Intelligence Suite in Shaadi AI. It is intended to serve as the source of truth for frontend development in Claude Code.

The feature covers 5 primary screens and 2 decision-branching states, moving the user from vendor selection through contract upload, AI analysis, flag review, response drafting, signing, and obligation tracking.

---

## Navigation Map

```
Vendor Tracker Dashboard  [Entry Point]
        │
        ▼
   Contract uploaded?
   ├── YES → Load Existing Summary  →  Contract Summary Dashboard
   └── NO  → Contract Upload Screen
                    │
                    ▼
             Valid PDF?
             ├── NO  → Error State + Retry Prompt
             └── YES → AI Processing Screen (3-stage)
                              │
                              ▼
                    Contract Summary Dashboard
                    ├── Expand Flag → Flag Detail View
                    │                     │
                    │                     ▼
                    │              Draft Response Screen
                    │                     │
                    │              Happy with draft?
                    │              ├── NO → Regenerate (loops back)
                    │              └── YES → Copy / Send
                    │
                    ├── Mark as Signed → Obligation Extraction + Confirm
                    │                           │
                    │                           ▼
                    │                  Obligation Tracker
                    │
                    └── Return to Dashboard (contract not yet signed)
```

---

## Global UI Components

These elements appear across all screens and should be implemented as shared components.

### Top Navigation Bar
- **Height:** 40px
- **Background:** Varies by section (blue `#a5d8ff` for upload/vendor screens, purple `#d0bfff` for summary/obligation screens, green `#b2f2bb` for drafting screens)
- **Content:** `Shaadi AI  |  Dashboard   Vendors   Budget   Guests   Contracts`
- **Font size:** 12px
- **Active state:** Bold underline on current section
- **Behavior:** Sticky — stays fixed at top of viewport on scroll

### Color System (Traffic Light)
| Status | Background | Border | Text | Use |
|---|---|---|---|---|
| Green | `#f0fff4` | `#22c55e` | `#22c55e` | Standard / safe clause |
| Amber | `#fff3bf` | `#f59e0b` | `#f59e0b` | Review recommended |
| Red | `#ffc9c9` | `#ef4444` | `#ef4444` | Action required / high risk |
| Grey | `#f0f0f0` | `#aaaaaa` | `#777777` | Future / inactive / pending |

### Status Tags (Vendor Cards)
| Tag | Background | Border | Use |
|---|---|---|---|
| Quote Recvd | `#ffd8a8` | `#f59e0b` | Quote received, no contract yet |
| Contract Signed | `#b2f2bb` | `#22c55e` | Contract fully executed |
| No Contract Yet | `#ffc9c9` | `#ef4444` | No document uploaded |
| Under Review | `#d0bfff` | `#8b5cf6` | AI processing in progress |

### Button Styles
| Button | Background | Text Color | Use |
|---|---|---|---|
| Primary CTA | `#8b5cf6` | white | Main action (Review Contract, Analyze) |
| Confirm / Send | `#22c55e` | white | Positive confirmation (Send Email, Mark Signed) |
| Info / Navigate | `#4a9eed` | white | Secondary navigation (View Summary, View Calendar) |
| Warning / Retry | `#fff3bf` | `#f59e0b` | Regenerate, retry actions |
| Disabled | `#cccccc` | `#aaaaaa` | Inactive state |
| Danger | `#ef4444` | white | Destructive actions only |

---

## Screen 1: Vendor Tracker Dashboard

**Route:** `/vendors/:eventId`  
**Entry point for:** Contract Intelligence Suite  
**Primary persona:** Planner (primary), Couple (secondary)

### Purpose
Central hub for managing all vendors across a single event. This is where the user initiates contract review for a specific vendor. The screen must make the contract status of each vendor immediately visible without requiring any clicks.

### Layout
- **Page header:** Event name (e.g., "Vendor Tracker — Sangeet") — 16px, `#333333`
- **Vendor list:** Vertically stacked cards, full width, 8px gap between cards
- **Each card:** 68px height, white background, rounded corners (8px), 1px border `#cccccc`

### Vendor Card Structure
Each card contains:

```
┌─────────────────────────────────────────────────────────┐
│  [Vendor Name]  |  [Event / Category]           [CTA]  │
│  [Status Tag]                                           │
└─────────────────────────────────────────────────────────┘
```

**Fields displayed:**
- Vendor name — 14px, `#333333`, bold
- Event + category — 14px, `#777777`
- Status tag — 11px pill badge (see Status Tags above)
- CTA button — right-aligned, 108px wide, 30px height (see Button Styles above)

### CTA Logic by Status
| Status | CTA Label | CTA Style | Action |
|---|---|---|---|
| No contract uploaded | Upload Contract | Disabled grey | Opens Upload Screen |
| Quote received (no contract) | Review Contract | Purple primary | Opens Upload Screen |
| Contract under AI review | Analyzing... | Disabled grey | No action |
| Summary available | View Summary | Blue info | Opens existing Summary |
| Contract signed | View Summary | Blue info | Opens Summary (read-only) |

### Decision Logic
- If `contract.status === 'uploaded' && contract.summary === null` → redirect to Processing Screen
- If `contract.summary !== null` → redirect to Contract Summary Dashboard (skip upload)
- If `contract.status === null` → open Upload Screen

### Information Displayed
- Vendor name, category, assigned event
- Contract status (tag)
- Date contract was uploaded (if applicable) — shown as sub-text below tag
- Quick summary of risk score if summary exists — shown as small badge next to CTA

---

## Screen 2: Contract Upload Screen

**Route:** `/vendors/:vendorId/contract/upload`  
**Previous screen:** Vendor Tracker Dashboard  
**Next screen:** AI Processing Screen (on success) or Error State (on failure)

### Purpose
Collect the vendor's contract PDF from the user and validate it before passing to the AI pipeline. Must be simple and confidence-inspiring — this is where the user hands over a legally significant document.

### Layout
- **Page header:** `[Vendor Name] — Upload Contract` — 15px, `#333333`
- **Upload zone:** Centered, 348px wide, 110px tall, dashed purple border `#8b5cf6`, light purple background `#f8f4ff`
- **Upload zone content:**
  - Icon: PDF icon or upload icon — centered, 16px label
  - Primary instruction: "Drag and drop your contract PDF here" — 14px, `#555555`
  - Divider: "or" — 13px, `#999999`
  - Browse button: Purple, 120px wide, 28px height, "Browse Files"

### Validation Rules (displayed below upload zone)
- "PDF only  |  Max 25MB  |  Text-based PDFs" — 12px, `#777777`
- Warning: "Note: Scanned image PDFs may not extract correctly" — 12px, `#f59e0b`
- This warning is always visible, not conditional

### Primary CTA
- Label: "Analyze Contract"
- Style: Purple primary, 180px wide, 42px height
- Position: Centered, below upload zone and validation notes
- Disabled state: Grey until a valid file is selected

### Error State (inline — replaces upload zone)
Triggered when: file is not PDF, file exceeds 25MB, or file upload fails
- Error message: Red text — "This file could not be processed. Please check the format and try again."
- Retry button: "Try a Different File" — purple primary
- Do not navigate away — keep user on this screen

### Processing State (same screen, replaces upload zone after successful upload)
Once file is uploaded and validation passes, the upload zone transforms into a progress view:

```
[ Stage 1 ] Extracting text...              COMPLETE  ← green background
[ Stage 2 ] Analyzing clauses...            IN PROGRESS  ← amber background
[ Stage 3 ] Generating summary...           WAITING  ← grey background
```

- Each stage bar: 348px wide, 26px height, rounded corners
- Estimated time shown below: "Estimated time: ~30 seconds" — 14px, `#777777`
- Auto-redirects to Contract Summary Dashboard when Stage 3 completes
- No manual action required from user during processing

### Information Displayed
- Which vendor and event the contract belongs to (header)
- Upload constraints
- Real-time processing progress (after upload)

---

## Screen 3: Contract Summary Dashboard

**Route:** `/vendors/:vendorId/contract/summary`  
**Previous screen:** AI Processing Screen (auto-redirect) or Vendor Tracker (direct)  
**Next screens:** Flag Detail View (on expand), Obligation Tracker (on sign)

### Purpose
The primary output screen. Delivers the AI's full analysis in a scannable, action-oriented format. The user must be able to understand the overall risk level in under 5 seconds and know exactly what needs their attention.

### Layout
- **Page header:** `[Vendor Name] — Contract Summary` — 15px, `#333333`
- **Risk Score Banner:** Full-width, 44px height, prominently colored by risk level
- **Clause sections:** Stacked vertically, each with section label + clause card

### Risk Score Banner
- Position: Directly below page header, above all clause sections
- Height: 44px
- Border: 2px, colored by risk level
- Content: `[RISK LEVEL] — [Number] clauses need your attention`
- Font: 14px, bold, risk-level color
- Risk levels and colors:
  - LOW: Green background/border — "LOW RISK — All clauses look standard"
  - MEDIUM: Amber background/border — "MEDIUM RISK — X clauses need your attention"
  - HIGH: Red background/border — "HIGH RISK — X clauses require immediate action"

### Clause Section Structure
Each contract section is displayed as:

```
[Section Name]  [TRAFFIC LIGHT LABEL]           ← section header, 14px
┌─────────────────────────────────────────────┐
│  [Plain-language summary of this clause]    │  ← colored by traffic light
│  [Benchmark or flag note if applicable]     │
└─────────────────────────────────────────────┘
```

**Standard sections extracted (in this order):**
1. Payment Schedule
2. Cancellation Policy
3. Coverage / Scope of Work
4. Overtime / Additional Fees
5. Exclusivity Clauses
6. Liability Limitations
7. Force Majeure / Acts of God

**Section header:** 14px, colored by traffic light status  
**Clause card:** Rounded corners, 12-13px text, background and border by traffic light color  
**Expandable:** Click anywhere on a clause card to open Flag Detail View for that clause

### Action Buttons (bottom of screen, always visible)
Two primary CTAs:
- **"Draft Response"** — Purple, 180px wide, 38px height — enabled only if at least one Yellow or Red flag exists
- **"Mark as Signed"** — Green, 155px wide, 38px height — always enabled

Secondary link:
- **"Download Summary PDF"** — text link, right-aligned, 14px `#4a9eed`

### Information Displayed
- Overall risk score and flag count
- Plain-language summary of every major clause
- Traffic light rating on each clause
- Benchmark note on every Yellow/Red flag
- Date contract was analyzed (shown in page header sub-text)

---

## Screen 4a: Flag Detail View

**Route:** `/vendors/:vendorId/contract/flag/:clauseId`  
**Previous screen:** Contract Summary Dashboard  
**Next screen:** Draft Response Screen (on "Draft Response" click) or back to Summary

### Purpose
Deep-dive on a single flagged clause. Gives the user everything they need to understand what the clause says, why it was flagged, whether it's normal, and how to respond to it.

### Layout
- **Page header:** `[Clause Name] — Flag Detail  [TRAFFIC LIGHT LABEL]` — 16px, flag color
- **Original Language box:** Red/amber background, shows verbatim contract text
- **Plain Language section:** White card with explanation
- **Industry Benchmark section:** Grey card with norm comparison
- **Tone Selector:** Horizontal tab row
- **Draft Preview section:** Bordered box showing AI email subject and first line
- **Action buttons:** Row at bottom

### Original Contract Language Box
- Background: Traffic light color (red/amber)
- Label: "Original Contract Language:" — 12px, traffic light color
- Content: Verbatim extracted clause text — 13px, `#444444`, italic
- Height: 55px minimum, expandable if clause is long

### Plain Language Explanation
- Label: "Plain Language Explanation:" — 14px, `#333333`
- Card: White background, 1px border `#cccccc`, rounded corners
- Content: 2-4 sentences explaining what the clause means in plain English
- Final sentence if action needed: Red text `#ef4444` — "This must be resolved before signing."
- Height: 68px minimum

### Industry Benchmark
- Label: "Industry Benchmark:" — 14px, `#333333`
- Card: Grey background `#f0f0f0`, 1px border `#aaaaaa`
- Content: One sentence comparing this clause to Indian wedding vendor market norms
- Example: "90% of Indian wedding photographer contracts match or exceed the event duration."
- Font: 13px, `#444444`

### Tone Selector
- Label: "Draft Tone:" — 14px, `#555555`
- Three tab buttons side by side:
  - "Professional" — active state: purple `#8b5cf6`, inactive: grey `#f0f0f0`
  - "Warm" — active/inactive same logic
  - "Formal" — active/inactive same logic
- Default: Professional selected
- Switching tone triggers re-generation of the draft preview

### Draft Preview
- Label: "AI-Generated Draft Email:" — 14px, `#555555`
- Subject line box: Light purple background `#f8f4ff`, purple border `#8b5cf6`, 42px height
  - Shows: "Subject: [Topic] — [Vendor Name]"
- Body preview box: White background, grey border `#cccccc`, 22px height
  - Shows: First sentence of the draft email body
  - Full draft opens in Draft Response Screen

### Action Buttons (bottom row)
- **"Regenerate"** — Amber `#fff3bf`, 130px wide, 34px height — regenerates draft with same tone
- **"Copy"** — Blue `#4a9eed`, 110px wide, 34px height — copies full draft to clipboard
- **"Send Email"** — Green `#22c55e`, 114px wide, 34px height — opens draft in full editing view

### Information Displayed
- Original legal language
- Plain-language translation
- Why the clause was flagged (reasoning)
- Whether this is normal for Indian wedding vendor contracts
- First look at the AI-generated response

---

## Screen 4b: Draft Response Screen

**Route:** `/vendors/:vendorId/contract/draft/:clauseId`  
**Previous screen:** Flag Detail View  
**Next screen:** Contract Summary Dashboard (after send/copy)

### Purpose
Full editing environment for the AI-generated vendor response email. The user sees the complete draft, can edit it freely, switch tones, regenerate, copy, or send directly.

### Layout
- **Page header:** `Draft Response — [Clause Name]` — 16px, `#333333`
- **Context reminder:** Small flagged clause recap at top
- **Tone selector:** Same as Flag Detail View
- **Full email editor:** Scrollable text area for complete draft
- **Action row:** Regenerate, Copy, Send

### Context Reminder Banner
- Background: Traffic light color (red/amber), 55px height
- Shows: Flagged clause name + one-line description of the issue
- Example: "Coverage Window — 4-hour contract for 6-hour event. Overtime rate unspecified."

### Full Email Editor
- Subject line: Editable input field, 42px height, purple border
- Body: Editable textarea, minimum 180px height, scrollable
- Font: 13px, `#333333`
- Placeholder behavior: Draft is pre-filled by AI — user edits in place
- Character count: Shown below textarea — "X characters"

### Tone Selector (same as Flag Detail)
- Switching tone regenerates the draft content
- Regeneration prompt: "Regenerating with [Tone] tone..." shown as loading state in textarea

### Action Buttons
- **"Regenerate"** — Amber, 130px — regenerates full draft with currently selected tone
- **"Copy"** — Blue, 110px — copies complete subject + body to clipboard, shows "Copied!" confirmation
- **"Send Email"** — Green, 114px — opens device default email client with subject and body pre-filled (mailto link)

### Post-Send State
After sending or copying:
- Green success banner: "Response drafted. Return to contract summary to continue."
- CTA: "Back to Summary" — purple, takes user back to Contract Summary Dashboard
- System logs that a response was sent for this clause (visible in vendor activity feed)

### Information Displayed
- Which clause is being addressed
- Complete AI-generated email (editable)
- Character count
- Selected tone

---

## Screen 5: Obligation Tracker

**Route:** `/contracts/obligations`  
**Previous screen:** Contract Summary Dashboard (after "Mark as Signed")  
**Also accessible from:** Global nav under "Contracts"

### Purpose
Unified view of all time-bound obligations extracted from every signed contract across all events. Sorted by urgency. Replaces the need for any manual reminder system.

### Layout
- **Page header:** "Contract Obligations — All Events" — 16px, `#333333`
- **Summary stats row:** `[N] vendors  |  [N] obligations  |  [N] urgent this week` — 14px, `#777777`
- **Obligation list:** Vertically stacked cards, sorted ascending by due date
- **Bottom CTAs:** Budget Calendar link + Reminder Settings

### Obligation Card Structure
Each card is 62px height with this layout:

```
┌──────────────────────────────────────────────────────────┐
│  DUE IN [N] DAYS [- URGENT if ≤ 7 days]                 │  ← urgency label
│  [Vendor Name]  |  [Obligation Type]  |  [Amount if any] │  ← primary info
│  [Date]  |  [Event]  |  [Reminder status]               │  ← metadata
└──────────────────────────────────────────────────────────┘
```

### Urgency Coloring
| Due Within | Background | Border | Label Color |
|---|---|---|---|
| 0–7 days | `#ffc9c9` | `#ef4444` (2px) | `#ef4444` |
| 8–21 days | `#fff3bf` | `#f59e0b` (1px) | `#f59e0b` |
| 22+ days | `#f0f0f0` | `#aaaaaa` (1px) | `#777777` |
| Completed | `#f0fff4` | `#22c55e` (1px) | `#22c55e` |

### Obligation Types (extracted by AI)
- Deposit payment (50% or specified %)
- Final balance payment
- Headcount submission
- Menu selection deadline
- Confirmation call required
- Signed rider / addendum due
- Insurance certificate required

### Card Fields
- **Urgency label:** 12px, traffic light color, bold — "DUE IN 3 DAYS - URGENT"
- **Vendor name:** 14px, `#333333`
- **Obligation type:** 14px, `#333333`
- **Amount (if payment):** 14px, `#333333`
- **Due date:** 12px, `#777777`
- **Event:** 12px, `#777777`
- **Reminder status:** 12px, `#777777` — "Reminder sent" / "Reminder scheduled for [date]" / "Overdue"

### Completion Interaction
- Each card has a checkbox or "Mark Complete" button on hover
- Completed obligations move to bottom of list and change to green styling
- Cannot be deleted — only marked complete (for audit trail)

### Bottom Action Buttons
- **"View Budget Calendar"** — Purple, 310px wide, 36px height — links to budget payment timeline view
- **"Manage Reminder Settings"** — Blue, 280px wide, 36px height — opens reminder preferences modal

### Reminder Settings Modal (triggered by button)
- Toggle: Email reminders on/off
- Reminder schedule: Checkboxes for 14 days, 7 days, 3 days, 1 day before (all on by default)
- Email address: Pre-filled from account, editable
- Save button: Green

### Footer Note
- "Reminders auto-sent: 14 days, 7 days, 1 day before each deadline" — 13px, `#777777`

### Information Displayed
- All obligations across all vendors and all events
- Days until each obligation is due
- Obligation type and amount
- Reminder scheduling status
- Link to budget calendar for payment planning

---

## State Management Notes

### Contract Status States
```
null                →  No contract uploaded
'uploading'         →  File transfer in progress
'processing'        →  AI pipeline running (stages 1–3)
'error'             →  Processing failed
'summary_ready'     →  Summary available, not yet signed
'signed'            →  Contract marked as signed, obligations extracted
```

### User Permission Levels
| Screen | Planner | Couple | Parent |
|---|---|---|---|
| Vendor Tracker | Full access | Read + upload own | No access |
| Upload Screen | Full access | Full access | No access |
| Processing Screen | View | View | No access |
| Contract Summary | Full access | View + can sign | No access |
| Flag Detail | Full access | View | No access |
| Draft Response | Full access (sends) | View + copy only | No access |
| Obligation Tracker | Full access | View | Budget summary only |

### AI Pipeline Error Handling
- If Stage 1 (text extraction) fails → Show error: "We couldn't extract text from this PDF. This may be a scanned document. Please try uploading a text-based PDF."
- If Stage 2 (clause analysis) fails → Show error: "Analysis incomplete. Some clauses may not have been flagged. We recommend reviewing the original contract for any items marked as uncertain."
- If Stage 3 (summary generation) fails → Retry automatically once. If second attempt fails, show: "Summary generation failed. Please try again."
- All errors show on the Upload Screen (user is not redirected away mid-process)

---

## Accessibility Requirements

- All interactive elements have minimum touch target of 44×44px
- All color-coded information (traffic lights, status tags) must also include a text label — never color alone
- Keyboard navigable: Tab order follows visual reading order top-to-bottom, left-to-right
- Screen reader labels on all icon-only buttons
- Minimum contrast ratio 4.5:1 for all body text against background
- Loading states communicated via `aria-live` regions, not just visual spinners

---

## Mobile Behavior

All screens are mobile-responsive. Key adaptations:
- Navigation bar collapses to hamburger on screens < 768px
- Vendor cards stack to single column on mobile
- Traffic light tags display as full-width on mobile (not inline)
- Draft Response Screen textarea expands to full screen height on mobile
- Obligation Tracker cards maintain full detail on mobile (no truncation)
- "Send Email" button uses `mailto:` link which opens native email app on mobile

---

## Files To Create (Claude Code Build Targets)

```
/src
  /components
    /navigation
      TopNav.jsx              ← Global nav bar (shared)
    /vendors
      VendorCard.jsx          ← Individual vendor card with status tag + CTA
      VendorTracker.jsx       ← Screen 1 — list of vendor cards
    /contract
      ContractUpload.jsx      ← Screen 2 — upload zone + processing states
      ContractSummary.jsx     ← Screen 3 — risk banner + clause sections
      ClauseCard.jsx          ← Individual clause card (reusable)
      FlagDetail.jsx          ← Screen 4a — expanded flag view
      DraftResponse.jsx       ← Screen 4b — full email editor
    /obligations
      ObligationTracker.jsx   ← Screen 5 — obligation list
      ObligationCard.jsx      ← Individual obligation card
      ReminderSettings.jsx    ← Modal for reminder preferences
  /utils
    contractStatus.js         ← Status state machine and helper functions
    trafficLight.js           ← Color/label mapping by risk level
    permissions.js            ← Role-based access control logic
  /api
    contractApi.js            ← Claude API integration for contract analysis pipeline
```

---

*Last updated: April 2026 | Version 1.0 | Shaadi AI Capstone Project*
