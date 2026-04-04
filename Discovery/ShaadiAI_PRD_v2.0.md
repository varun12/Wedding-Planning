# Shaadi AI
## Product Requirements Document
### AI-Powered Wedding Planning for the Indian Diaspora
**Product Faculty — AI PM Certification Capstone | April 2026**

| Version | Status | Author | Date |
|---------|--------|--------|------|
| 2.0 | Draft | Varun Maryada | April 2026 |

> **What changed in v2.0:** This version adds a dedicated MVP Scope Definition section (Section 3) that clearly separates the Capstone Prototype from the V1 Product Launch and V2+ roadmap. Section 4 (Goals & Success Metrics) has been significantly expanded with a North Star Metric, capstone-specific success criteria, feature-level metrics, and a leading vs. lagging indicator breakdown. All other sections carry forward from v1.0 without change.

---

## 1. Executive Summary

Shaadi AI is an AI-powered wedding planning platform built natively for the North American Indian diaspora. Every major wedding planning tool available today — The Knot, Zola, WeddingWire, Aisle Planner — was architected around a single-day Western wedding. None of them understand what an Indian wedding actually is: a 4-6 event, multi-day, multi-vendor, multi-family coordination challenge with a budget that averages $225,000–$285,000 per wedding in the United States.

Shaadi AI solves this by combining deep cultural intelligence with LLM-powered automation — giving Indian wedding planners and self-managing couples a platform that understands their wedding from day one, automates the most painful coordination tasks, and keeps the couple, the planner, and both families aligned throughout the planning journey.

The focused AI feature for this capstone is the **AI Contract Intelligence Suite** — the first AI-powered contract review tool built specifically for South Asian wedding vendors. No competitor offers this capability. It is a genuine white space, a demonstrable prototype, and the trust-building entry point to the full Shaadi AI platform.

**Market Snapshot**

| Market | Size | Growth Rate |
|--------|------|-------------|
| Wedding Planning Software (Global) | $1.52B (2024) | 13.1% CAGR to 2033 |
| US Wedding Planning Services | $64.93B (2024) | 8.5% CAGR to 2030 |
| Indian Diaspora Wedding Market | $15B+ annually | 14.3% CAGR (India segment) |
| Avg. Indian Wedding Cost (US) | $225K–$285K | 5-8x US average |

---

## 2. Problem Statement

### 2.1 The Core Problem

Existing wedding planning tools are culturally blind — and for Indian weddings, that blindness makes them nearly useless. Every major platform was built for a single-day Western wedding: one venue, one ceremony, one reception, one guest list. An Indian wedding is a fundamentally different coordination challenge, and no current tool is built to handle it.

### 2.2 The Complexity Gap

A typical Indian wedding spans 4-6 distinct events — Mehndi, Haldi, Sangeet, Baraat, Wedding Ceremony, and Reception — each with its own venue, vendor set, guest subset, dress code, timeline, and budget line. The coordination complexity is an order of magnitude higher than a Western wedding.

| Dimension | Western Wedding | Indian Wedding |
|-----------|----------------|----------------|
| Number of events | 1 | 4-6 |
| Vendors to coordinate | 8-12 | 20-30+ |
| Average guest count (US) | 117 | 300-400+ |
| Average total cost (US) | $34,000 | $225,000-$285,000 |
| Active decision makers | Couple | Couple + both families |
| Planning duration | 6-12 months | 12-18 months |

### 2.3 Where the Pain Lives Today

Because no tool understands the structure of an Indian wedding, couples and planners fall back on a fragmented system: WhatsApp groups for family communication, colour-coded Google Sheets for budget and vendor tracking, and email chains for outreach and contract management. The stress is not the complexity itself — it is the absence of a system built to handle it.

- Vendor contracts are reviewed manually — or not at all — across 20+ agreements
- Budget tracking across 6 events breaks down as quotes come in from multiple vendors simultaneously
- Guest list segmentation by event is managed manually, leading to errors and wrong invitations
- Vendor outreach requires hours of individualized email writing per wedding
- The couple and planner are rarely looking at the same information at the same time

---

## 3. MVP Scope Definition ✦ NEW IN V2.0

This section defines the precise build scope across three horizons: the Capstone Prototype, the V1 Product Launch, and V2+. Each horizon has a distinct definition of done, a distinct set of features, and distinct success criteria. This replaces the implicit scope that was distributed across multiple sections in v1.0.

### 3.1 Scope Horizons

| Horizon | Timeline | Purpose | Definition of Done |
|---------|----------|---------|-------------------|
| **Capstone Prototype** | April 2026 | Validate the AI Contract Intelligence concept with real users. Demonstrate product thinking to Product Faculty judges. | End-to-end contract review flow works live in a demo. Validated by 3 planners + 3 couples. |
| **V1 Product Launch** | July 2026 | Full self-serve product live on paid tiers. All core features functional. First 50 planner accounts acquired. | All features in Sections 8.1–8.6 live. Paid subscriptions processing. 3 cities active. |
| **V2+** | Aug 2026+ | Expand platform with vendor directory, multilingual support, mobile native app, and deeper AI personalization. | Defined during V1 retrospective. |

---

### 3.2 Capstone Prototype — Must Build (April 25, 2026)

These are the features that must be fully functional for the capstone demo. "Fully functional" means: real inputs, real AI processing, real outputs — not placeholder UI.

**AI Contract Intelligence Suite (Section 8.1):**

| Sub-Feature | Must Build | Notes |
|-------------|-----------|-------|
| PDF upload and text extraction | Yes | PDF.co via Make. Must handle standard formatted contracts. |
| Plain-language contract summary | Yes | Claude API. All 7 key sections extracted and displayed. |
| Traffic light clause flagging | Yes | Green / Yellow / Red with explanations and market norm benchmarks. |
| Contract risk score (Low / Medium / High) | Yes | Aggregate of flags. Displayed prominently at top of summary. |
| One-click response drafting | Yes | Draft generated in <10 seconds. Addresses specific flagged clause. |
| Obligation extraction on signing | Yes | Structured JSON from Claude. Populates obligation list. |

**Minimum Supporting Context (required for AI features to work):**

| Feature | Must Build | Scope for Capstone |
|---------|-----------|-------------------|
| Wedding setup | Yes | Wedding name, couple names, event type (dropdown), vendor category. Enough context for Claude prompts. |
| Vendor profile | Yes | Vendor name, category, and contract association. Single-page UI. |
| Planner login and couple login | Yes | Two distinct login roles. Planner sees full contract details. Couple sees summary view. |
| Obligation tracker display | Yes | List view of extracted obligations with due dates. Manual complete toggle. |

---

### 3.3 Capstone Prototype — Mock or Simulate (April 25, 2026)

These features should be represented in the UI to show product breadth, but do not need to be fully functional for the capstone demo. Pre-loaded sample data or non-interactive UI is acceptable.

| Feature | Mock Approach |
|---------|--------------|
| Multi-event wedding structure | Show the 6-event structure with pre-populated events. Event switching works. Content is sample data. |
| AI Vendor Outreach Engine | Show the outreach draft UI with a pre-generated sample. Style profile setup screen visible but optional for demo. |
| Multi-event budget tracker | Display a budget dashboard with sample data across events. No live calculation required for demo. |
| Guest list segmentation | Show the master list with per-event tags using sample guests. Import flow is UI-only for demo. |
| Couple-planner collaboration dashboard | Show both views with sample data. Activity feed is static. |
| Email reminders (obligation deadlines) | Not needed for demo. Log the obligation; skip SendGrid delivery. |
| Cultural background interview | Simplified: show 3-question setup flow. Custom event generation can use a fixed sample output. |

---

### 3.4 V1 Product Launch — Full Feature Set (July 2026)

All features mocked in the capstone prototype must be fully functional by the V1 launch.

| Feature | V1 Requirement |
|---------|---------------|
| AI Contract Intelligence Suite | All sub-features fully functional. Style profiles active for response drafting. |
| Multi-event wedding structure | Full cultural background interview. LLM-generated event structure. All downstream cascade logic. |
| AI Vendor Outreach Engine | Style profile from 3-5 sample emails. Edit-and-learn loop. Outreach tracker with response status. |
| Multi-event budget tracker | Live budget with pre-suggested allocations, variance alerts, AI reallocation advisor, payment calendar. |
| Guest list segmentation | Natural language import, OCR photo import, fuzzy duplicate detection, per-event RSVP tracking. |
| Couple-planner dashboard | Full planner command center, clean couple status view, parent read-only access, activity feed. |
| Email reminders | SendGrid live. 14-day, 7-day, 1-day obligation reminders automated. |
| Paid subscriptions | All 4 tiers live. Payment processing active. |
| GDPR/CCPA compliance | Data export and deletion flows implemented. |

---

### 3.5 Out of Scope — V1 (carried from v1.0)

The following are intentionally excluded from V1 to maintain focus.

| Out of Scope | Rationale |
|-------------|-----------|
| Meal / calorie tracking | Not relevant to wedding planning |
| In-app invitation sending and RSVP hosting | Guest segmentation logic demonstrated; delivery layer is V2 |
| Vendor marketplace / vendor directory | Cold-start problem — curated directory is post-launch |
| Automated calendar / scheduling integration | Can be mocked for demo; full integration is V2 |
| Payment processing for vendor bookings | Marketplace transaction layer is post-launch |
| Multilingual support (Hindi, Punjabi, Gujarati) | High value but significant complexity — V2 priority |
| Mobile native app (iOS / Android) | V1 is mobile-responsive web; native apps are post-launch |
| Post-wedding features (thank-you notes, photo albums) | Outside the planning journey scope for V1 |

---

## 4. Goals & Success Metrics ✦ EXPANDED IN V2.0

### 4.1 Product Goals (unchanged from v1.0)

- Become the default wedding planning platform for Indian diaspora couples and planners in North America
- Demonstrate that cultural intelligence + LLM-powered automation creates a defensible, compounding competitive moat
- Prove willingness to pay at both the planner tier ($200-400/month) and couple tier ($30-60/month)
- Generate strong word-of-mouth referrals within the tightly networked South Asian community

### 4.2 North Star Metric ✦ NEW

**Total contracts reviewed per month** — the single best proxy for value delivered. A contract reviewed means a planner or couple used the AI feature that sits at the core of the product, received output they acted on, and trusted the platform with a high-stakes document. Growth in this metric confirms both adoption and trust.

Secondary proxy: **Active planner accounts** (tracks the highest-LTV acquisition channel and distribution multiplier).

---

### 4.3 Capstone Success Criteria ✦ NEW

These criteria define success for Phase 0 (April 2026). They are distinct from product launch metrics.

**Demo Quality:**

| Criterion | Target | How to Measure |
|-----------|--------|---------------|
| End-to-end flow completeness | Contract upload → summary → flag expansion → response draft → obligation extraction works without error in live demo | Manual test with 3 real vendor contracts before demo day |
| Contract summary generation time | < 60 seconds for contracts up to 25 pages | Timed test on demo contracts |
| Response draft generation time | < 10 seconds from clicking 'Draft Response' | Timed test across 5 flag scenarios |
| Summary accuracy on test contracts | > 90% of key sections correctly identified and extracted | Human review of AI output against 5 real contracts |

**User Validation:**

| Criterion | Target | How to Measure |
|-----------|--------|---------------|
| User interviews completed | ≥ 3 Indian wedding planners + 3 diaspora couples | Interview log |
| "Would use this tool" score | ≥ 4.0 / 5.0 average across all 6 interviews | Post-interview survey |
| "AI summary was accurate enough to trust" score | ≥ 4.0 / 5.0 from planner interviews | Post-demo feedback form |
| Identified at least one non-obvious friction point | Yes — from interview synthesis | Interview synthesis doc |

**Capstone Presentation:**

| Criterion | Target |
|-----------|--------|
| Product Faculty presentation score | ≥ 80 / 100 |
| Live demo completes without fallback to screenshots | Yes |
| PRD and supporting documents delivered on time | April 25, 2026 |

---

### 4.4 V1 Launch Success Metrics ✦ NEW

These are early-signal metrics for months 1-3 post-launch (July–September 2026), before the 6-month targets become relevant.

**Acquisition (Month 1-3):**

| Metric | Target |
|--------|--------|
| Planner accounts acquired | ≥ 15 by end of Month 1 |
| Couple accounts acquired (planner-referred) | ≥ 30 by end of Month 2 |
| Free trial to paid conversion rate (planner tier) | ≥ 40% |
| Cost per planner acquisition (direct outreach) | < $200 CAC |

**Activation:**

| Metric | Target |
|--------|--------|
| Contract review completed within first session | > 60% of new planner signups |
| Wedding setup completed within 48 hours of signup | > 70% of new accounts |
| Couple invited to dashboard within first week | > 80% of planner-created weddings |

**AI Quality (user-reported):**

| Metric | Target |
|--------|--------|
| Contract summary star rating (1-5) | ≥ 4.2 average |
| "Flag was helpful and accurate" thumbs up rate | ≥ 75% of flags rated |
| Support tickets citing AI inaccuracy | < 5% of total contract reviews |

---

### 4.5 6-Month Post-Launch Success Metrics (expanded from v1.0)

**Acquisition:**

| Metric | Target (Month 6) |
|--------|-----------------|
| Active planner accounts | 50 |
| Active couple accounts | 200 |
| % of signups from referrals | > 40% |

**Engagement:**

| Metric | Target (Month 6) |
|--------|-----------------|
| Contracts reviewed per active planner per month | > 5 |
| Contract Intelligence used within first session | > 60% of new users |
| Monthly active rate (planners) | > 80% |

**Retention:**

| Metric | Target (Month 6) |
|--------|-----------------|
| Planner 30-day retention | > 85% |
| Planner 90-day retention | > 70% |
| Couple 60-day retention | > 55% |

**Revenue:**

| Metric | Target (Month 6) |
|--------|-----------------|
| Monthly Recurring Revenue (MRR) | $17,750 |
| Annual Run Rate | ~$213,000 |
| Planner tier % of MRR | ~62% |

**Quality & Trust:**

| Metric | Target (Month 6) |
|--------|-----------------|
| Net Promoter Score (NPS) | > 50 |
| Contract summary accuracy vs. human review | > 90% |
| Contract risk score alignment with human assessment | > 85% |

---

### 4.6 Leading vs. Lagging Indicator Map ✦ NEW

| Leading Indicator | Lagging Indicator It Predicts |
|-------------------|------------------------------|
| Free trial to paid conversion rate | MRR growth |
| Contract reviews in first session | 30-day retention |
| Planner invites couple to dashboard | Couple account activation |
| AI quality rating per summary | NPS score |
| Referral links clicked per planner | % signups from referrals |
| Style profile setup completion | Vendor outreach feature adoption |

---

## 5. Target Users & Personas (unchanged from v1.0)

### 5.1 Persona 1 — The Indian Wedding Planner (Primary)

Strategic role: Primary buyer, primary user, and most powerful distribution channel. One planner acquisition unlocks 10-30 couple relationships per year.

| Attribute | Detail |
|-----------|--------|
| Name | Priya — Professional Indian Wedding Planner, Greater Toronto Area |
| Experience | 8+ years planning South Asian weddings. Manages 15-20 weddings per year. |
| Current tools | Aisle Planner, Google Sheets, WhatsApp, Gmail |
| Primary goal | Manage complex multi-event weddings more efficiently and grow her business without adding headcount |
| Key pain | Every Indian wedding she manages is harder than it needs to be because no tool understands the structure. She spends hours on manual, repetitive tasks that should be automated. |
| Willingness to pay | High — she is running a business and understands the ROI of tools that save time and improve client satisfaction |

### 5.2 Persona 2 — The Self-Managing Diaspora Couple (Secondary)

Strategic role: Primary volume user and long-term growth engine. Strong referral potential within the tightly networked South Asian community.

| Attribute | Detail |
|-----------|--------|
| Names | Neha & Arjun — Engaged diaspora couple, dual-income professionals, New York metro area |
| Wedding | 5-event Indian wedding, 280 guests, 14 months out, self-managing without a full-service planner |
| Current tools | The Knot (partially), Google Sheets, WhatsApp group with both families |
| Primary goal | Stay in control of the planning process without drowning in it — and feel confident they haven't missed anything important |
| Key pain | Managing a $250,000 wedding across 5 events with 20+ vendors while holding full-time jobs. Reviewing contracts they don't understand. Guest lists that change constantly. A budget that shifts every week. |
| Willingness to pay | Moderate to high — they are already spending $250,000 on the wedding. A $50/month tool that protects that investment is an easy decision. |

### 5.3 Secondary Users

- **Couple working with a planner** — accesses Shaadi AI through the planner's workspace. Uses the couple dashboard for visibility. Does not drive coordination.
- **Parents / family decision-makers** — read-only access to budget summaries and event status. No direct purchase intent but significant influence on couple's adoption decision.

---

## 6. Competitive Landscape (unchanged from v1.0)

### 6.1 Competitor Summary

| Competitor | Multi-Event Structure | Indian Cultural Intelligence | AI Contract Review | NA Diaspora Focus | Self-Serve |
|------------|----------------------|-----------------------------|--------------------|------------------|------------|
| The Knot | ✗ | ✗ | ✗ | Partial | ✓ |
| Zola | Partial | ✗ | ✗ | ✗ | ✓ |
| Aisle Planner | Partial | ✗ | ✗ | ✗ | ✓ |
| BollyWeds | ✓ | ✓ | ✗ | ✓ | Agency only |
| WeddAI | Partial | Partial | ✗ | India only | ✓ |
| **Shaadi AI** | **✓** | **✓** | **✓** | **✓** | **✓** |

### 6.2 Key Differentiators

1. Built natively for Indian weddings — not adapted from a Western template
2. Cultural intelligence that compounds as a moat — the platform understands event-specific vendor categories, ritual sequencing, and diaspora logistics
3. AI Contract Intelligence — no competitor offers contract review for wedding vendors. A genuine white space.
4. First self-serve platform for the North American Indian diaspora — BollyWeds requires hiring them as an agency
5. Dual-user model — couple and planner in one platform with appropriate permission levels

---

## 7. Product Overview (unchanged from v1.0)

### 7.1 Product Vision

**Vision:** Shaadi AI is the coordination layer that makes planning a multi-event Indian wedding feel, for the first time, like something a couple can actually be in control of.

### 7.2 Product Model

Shaadi AI is a product-led business with a sales-assisted motion for the planner tier in the early stages. The product delivers value independently through software — it is not a service business. In the early go-to-market phase, the first 10-20 planners will be acquired through direct outreach and white-glove onboarding. As brand credibility builds within the South Asian wedding community, the model moves toward a more purely self-serve acquisition motion for couples.

### 7.3 Platform Architecture

| Layer | Description |
|-------|-------------|
| Foundation | Multi-event Indian wedding structure — the platform is pre-configured with the standard event sequence (Mehndi, Haldi, Sangeet, Baraat, Ceremony, Reception) and customizable for regional and religious variation |
| AI Layer | LLM-powered features including Contract Intelligence, vendor outreach drafting, budget advisory, and guest list parsing — built on Claude API |
| Coordination Layer | Multi-event budget tracker, vendor management, guest segmentation, and timeline management across all events simultaneously |
| Collaboration Layer | Dual-user dashboard giving planners a coordination command center and couples real-time visibility — with read-only access for parents |

---

## 8. Feature Requirements (unchanged from v1.0)

> Scope note: Section 8.1 covers the primary AI feature (capstone focus). Sections 8.2-8.6 cover supporting platform features. See Section 3 for which of these are must-build vs. mock for the capstone prototype.

### 8.1 AI Contract Intelligence Suite ✦ PRIMARY FEATURE

**Why this feature:** No competitor offers AI contract review for wedding vendors. It is a genuine white space, serves both primary personas powerfully, and is the trust-building entry point to the full AI layer of the product.

#### 8.1.1 Plain-Language Contract Summary

**User story:** As a wedding planner or couple, I want to upload a vendor contract and receive a plain-language summary of key terms so that I can understand what I am agreeing to without spending 45 minutes reading legal language.

**Functional requirements:**
- User uploads a vendor contract in PDF format (max 25MB)
- System processes the document and returns a structured summary within 60 seconds
- Summary includes: payment schedule and deposit amount, cancellation policy and refund terms, what is included and explicitly excluded, overtime rates and conditions, exclusivity clauses, liability limitations, and force majeure terms
- Summary is presented in plain language at an 8th-grade reading level
- Summary is organized by section with clear headers
- User can copy, download, or share the summary directly from the interface

**Acceptance criteria:**
- Summary is generated within 60 seconds of upload for contracts up to 25 pages
- All standard contract sections are correctly identified and extracted with >90% accuracy
- Plain-language translation passes readability test at or below 8th-grade level
- Feature works across varied PDF formats — professionally formatted and informally structured

#### 8.1.2 Traffic Light Clause Flagging

**User story:** As a couple reviewing a vendor contract, I want each clause rated as standard, worth reviewing, or unusual so that I know where to focus my attention and what to be concerned about.

**Functional requirements:**
- Each clause in the summary is tagged with a traffic light rating: Green (standard for this vendor category), Yellow (review recommended — unusual but not alarming), Red (high-risk or significantly unusual)
- Each flag includes a one-paragraph explanation of why the clause received that rating
- Yellow and Red flags include a benchmark note: what is typical for this vendor type in the Indian wedding market
- User can click any flag to expand a detailed explanation
- A contract risk score (Low / Medium / High) is calculated from the aggregate of flags and displayed prominently at the top of the summary

**Acceptance criteria:**
- Traffic light ratings are consistent with Indian wedding vendor market norms for the top 5 vendor categories (venue, photographer, caterer, décor, entertainment)
- Each Red flag includes a specific, actionable explanation — not generic legal boilerplate
- Contract risk score accurately reflects the overall risk profile of the contract in >85% of test cases

#### 8.1.3 One-Click Response Drafting

**User story:** As a couple or planner who has received a flagged contract clause, I want to generate a professional response email to the vendor addressing the concern so that I can negotiate effectively without knowing how to write contract negotiation language.

**Functional requirements:**
- For any Yellow or Red flagged clause, user can click 'Draft Response' to generate a vendor email
- The email addresses the specific flagged clause, explains the concern in professional but accessible language, and includes a suggested resolution or alternative wording
- The draft is pre-populated with the planner's voice profile (if set up) or defaults to a professional neutral tone
- User can edit the draft before sending or copy it to their email client
- System tracks whether a response was sent and logs the vendor's reply when pasted back in

**Acceptance criteria:**
- Draft response is generated within 10 seconds of clicking 'Draft Response'
- Email addresses the specific clause by name — not a generic contract negotiation template
- Planner voice profile, if set, is reflected in tone and vocabulary of the draft

#### 8.1.4 Post-Signing Obligation Tracker

**User story:** As a couple who has signed multiple vendor contracts, I want all payment deadlines, confirmation calls, and submission requirements extracted and tracked automatically so that I never miss an obligation buried in a contract I signed three months ago.

**Functional requirements:**
- When a contract is marked as signed, the system extracts all time-bound obligations — payment dates, deposit amounts, confirmation deadlines, final headcount submission dates
- Extracted obligations are added to a Contract Obligations dashboard visible to both the couple and the planner
- Automated reminders are sent 14 days, 7 days, and 1 day before each obligation deadline
- Obligations are linked to the budget tracker — payment deadlines automatically appear in the budget calendar
- User can mark obligations as complete and add notes

**Acceptance criteria:**
- All payment dates and amounts are extracted correctly from contracts with >95% accuracy
- Reminders are sent at the correct intervals without manual setup
- Obligation tracker is visible to both planner and couple in their respective dashboards

---

### 8.2 Multi-Event Wedding Structure

**Purpose:** The foundation that makes every other feature culturally intelligent. Structures the entire product around the reality of an Indian wedding rather than a Western one.

- Platform is pre-configured with the standard Indian wedding event sequence: Mehndi, Haldi, Sangeet, Baraat, Wedding Ceremony, Reception
- Each event has its own vendor checklist, budget line, timeline, guest subset, and task list
- Events can be added, removed, renamed, or reordered without breaking downstream data
- Regional and religious variations are supported through a cultural background interview at setup — the LLM generates a custom event structure based on the couple's background
- A blend mode allows interfaith or inter-regional couples to merge event structures from both traditions
- All changes to the event structure cascade automatically through budget, vendor tracker, timeline, and guest list

### 8.3 AI Vendor Outreach Engine

**Purpose:** Eliminates hours of manual email writing per wedding by generating personalized, voice-matched vendor outreach for each event and vendor category.

- Planner uploads 3-5 sample emails to create a style profile — the LLM extracts tone, vocabulary, and framing preferences
- For each vendor outreach request, the system generates a personalized draft tailored to the event type, vendor category, guest count, and requirements
- Tone controls allow one-click adjustment (formal / conversational / warm) before sending
- Vendor-type awareness adjusts formality automatically — more formal for luxury venues, more casual for entertainment vendors
- Edit-and-learn loop: edits made to drafts update the style profile over time
- Outreach tracker shows response status per vendor: pending, responded, shortlisted, booked

### 8.4 Multi-Event Budget Tracker

**Purpose:** Replaces six separate event spreadsheets with a single live budget view that updates dynamically across all events as quotes come in.

- Unified budget view across all events, broken down by event and by vendor category
- Budget allocations are pre-suggested based on the couple's total budget and typical Indian wedding spend ratios — user-adjustable
- Real-time updates as vendor quotes are logged — no manual reconciliation
- Variance alerts flag when a line item is approaching or exceeding its allocation
- AI budget advisor generates ranked reallocation suggestions weighted against the couple's stated priorities
- Shared view between couple and planner — planner can control which updates are immediately visible to the couple
- Read-only budget summary available to parents with access
- Payment calendar shows all upcoming payment obligations across all vendors

### 8.5 Guest List With Per-Event Segmentation

**Purpose:** Manages one master guest list with intelligent per-event segmentation — eliminating the logic errors and manual effort of managing 400 guests across 4-6 events.

- Single master guest list with per-event tagging — each guest is assigned to the events they are invited to
- Natural language guest import — paste any format (WhatsApp message, spreadsheet, typed list) and the LLM extracts structured records
- Photo import of handwritten lists via OCR extraction
- Fuzzy duplicate detection flags likely duplicates before they are added
- Relationship tagging (bride's family, groom's family, mutual friends, colleagues) drives AI-suggested event assignments in bulk
- Per-event RSVP tracking with automated follow-up drafting for non-respondents
- Per-event headcount export for venue and catering coordination

### 8.6 Couple-Planner Collaboration Dashboard

**Purpose:** Keeps the couple, planner, and family in sync without requiring constant check-in calls or status update emails.

- Planner view: full coordination command center — vendor management, contract tracker, budget controls, timeline, task assignments
- Couple view: clean dashboard showing event status, budget summary, vendor confirmations, and guest counts across all events
- Shared comments and notes on individual tasks, vendors, and budget lines
- Parent access: read-only view of event status and budget summary — no operational access
- Activity feed shows recent changes with timestamps so the couple always knows what has been updated
- Mobile-optimized for all user types — critical for wedding week usage

---

## 9. Key User Flows (unchanged from v1.0)

### 9.1 AI Contract Intelligence — Core Flow

This is the primary flow for the capstone prototype demonstration.

| Step | User Action | System Response | Outcome |
|------|-------------|-----------------|---------|
| 1 | User opens vendor profile in the Vendor Tracker | Vendor detail page loads with contract upload prompt | User sees clear upload CTA |
| 2 | User uploads vendor contract PDF | System confirms upload and begins processing — progress indicator shown | User knows system is working |
| 3 | User waits (up to 60 seconds) | LLM processes contract, generates summary and flags | Processing complete notification |
| 4 | User reviews contract summary | Displays plain-language summary with traffic light flags and contract risk score | User understands key terms in minutes |
| 5 | User clicks a Yellow or Red flag to expand | Detailed explanation shown with industry norm benchmark | User understands why clause is flagged |
| 6 | User clicks 'Draft Response' on a flagged clause | LLM generates professional vendor email addressing the specific clause with a negotiation suggestion | User has a ready-to-send email in 10 seconds |
| 7 | User edits and sends the email (or copies to their email client) | System logs that a response was sent and prompts for vendor reply | Negotiation is tracked in the system |
| 8 | User marks contract as signed | System extracts obligations and populates the Obligation Tracker with payment dates and deadlines | All future obligations are automatically tracked |

### 9.2 New Wedding Setup Flow

1. Planner or couple creates a new wedding account
2. Cultural background interview — LLM asks about regional background, religious tradition, family customs
3. Custom event structure is generated and displayed for review and adjustment
4. Budget is entered and auto-allocated across events based on typical Indian wedding spend ratios
5. Couple is invited to the collaboration dashboard
6. Planning framework (timeline, vendor checklist, task list) is pre-populated across all events

### 9.3 Vendor Outreach Flow

1. Planner selects an event and a vendor category
2. Planner inputs vendor name(s) and any specific requirements
3. AI generates personalized outreach drafts in the planner's voice
4. Planner reviews, edits if needed, and sends
5. System tracks response status and flags follow-ups
6. Quotes are logged and budget tracker updates automatically

---

## 10. Non-Functional Requirements (unchanged from v1.0)

### 10.1 Performance
- Contract summary generated within 60 seconds of PDF upload for documents up to 25 pages
- Vendor outreach drafts generated within 10 seconds of request
- Budget dashboard loads within 2 seconds on a standard broadband connection
- Platform supports concurrent usage by planner and couple on the same wedding without data conflicts

### 10.2 Reliability
- 99.5% uptime SLA — wedding planning is time-sensitive and platform unavailability directly impacts user trust
- All user data is backed up daily with point-in-time recovery
- Contract PDFs and summaries are stored securely and retrievable for the duration of the subscription

### 10.3 Security & Privacy
- All data encrypted in transit (TLS 1.3) and at rest (AES-256)
- Vendor contract PDFs contain sensitive financial and legal information — access is restricted to the planner and couple for that specific wedding
- Parent read-only access does not expose vendor contract details — budget summaries only
- GDPR and CCPA compliant data handling — users can export and delete their data
- LLM API calls do not store contract content beyond the processing session

### 10.4 Accessibility
- WCAG 2.1 AA compliance across all user-facing interfaces
- Mobile-responsive design for all features — critical for wedding week usage
- Minimum font size of 16px for body text across all views

### 10.5 AI Quality
- Contract summaries must achieve >90% accuracy on key term extraction (validated against human review)
- Traffic light flags must align with Indian wedding vendor market norms for top 5 vendor categories
- AI outputs must include a confidence or completeness indicator so users know when to double-check
- The system must gracefully handle contracts that are ambiguous, poorly formatted, or non-standard — flagging uncertainty rather than generating confident but incorrect output

---

## 11. Technology Stack (unchanged from v1.0)

### 11.1 Recommended Stack (No-Code / Low-Code)

> **Constraint:** The capstone prototype must be buildable within a no-code/low-code stack by April 25, 2026, with LLM API integration for the AI Contract Intelligence Suite.

| Layer | Tool | Purpose |
|-------|------|---------|
| Frontend / App | Bubble.io | Web app builder for all user-facing interfaces — planner dashboard, couple dashboard, contract upload flow |
| AI / LLM | Claude API (claude-sonnet-4-6) | Powers contract summarization, flag generation, response drafting, outreach generation, and cultural setup interview |
| Automation / Workflows | Make (formerly Integromat) | Bridges Bubble with Claude API — handles PDF upload, API calls, and response routing back to the UI |
| Database | Bubble built-in database | Stores weddings, events, vendors, contracts, budgets, guests, and user profiles |
| PDF Processing | PDF.co or similar via Make | Extracts text from uploaded contract PDFs before passing to Claude API |
| Authentication | Bubble built-in auth | User accounts, role-based access (planner / couple / parent) |
| Email | SendGrid via Make | Obligation reminders, RSVP follow-ups, and system notifications |

### 11.2 AI Architecture — Contract Intelligence

The Contract Intelligence Suite uses a multi-step LLM pipeline:

1. **Step 1 — Text extraction:** PDF.co extracts raw text from the uploaded contract PDF
2. **Step 2 — Structured summarization:** Claude API receives the extracted text with a structured prompt instructing it to identify and extract key contract sections (payment, cancellation, inclusions, exclusions, overtime, exclusivity, liability)
3. **Step 3 — Flag generation:** A second Claude API call evaluates each extracted clause against a system prompt containing Indian wedding vendor contract norms and generates traffic light ratings with explanations
4. **Step 4 — Risk scoring:** Claude aggregates the flags and generates an overall contract risk score (Low / Medium / High) with a brief plain-language rationale
5. **Step 5 — Response drafting:** When the user requests a draft response, Claude receives the flagged clause, the vendor category, and the planner's style profile and generates a targeted negotiation email
6. **Step 6 — Obligation extraction:** Claude extracts all time-bound obligations from the signed contract and returns them in a structured JSON format that populates the Obligation Tracker

---

## 12. Monetization Model (unchanged from v1.0)

### 12.1 Subscription Tiers

| Tier | Target User | Price | Key Features | Value Prop |
|------|------------|-------|--------------|------------|
| Couple — Standard | Self-managing couple | $39/month | All platform features, AI Contract Intelligence (10 contracts/month), budget tracker, guest management | Full control of a $250K wedding for less than $500 total |
| Couple — Premium | Couple with high complexity | $59/month | All Standard features + unlimited contract reviews, priority AI processing, parent access | Unlimited AI support for the most complex weddings |
| Planner — Professional | Wedding planner (single user) | $199/month | Unlimited weddings, all AI features, style profile, collaboration dashboard, obligation tracker | Replace Aisle Planner + Sheets + WhatsApp with one culturally intelligent platform |
| Planner — Agency | Planning firm with multiple planners | $349/month | All Professional features + multi-planner access, team collaboration, analytics dashboard | Business-grade platform for growing agencies |

### 12.2 Revenue Projections

Conservative 6-month post-launch scenario based on planner-led go-to-market:
- 50 planner accounts at blended $220/month average = $11,000 MRR
- 150 couple accounts at blended $45/month average = $6,750 MRR
- **Total MRR at Month 6: ~$17,750**
- **Annual Run Rate at Month 6: ~$213,000**

The planner tier generates ~62% of revenue from ~25% of accounts — confirming the planner as the highest-LTV customer segment.

### 12.3 Future Revenue Streams

- Vendor marketplace transaction fee (V2) — commission on bookings made through Shaadi AI's curated vendor directory
- Vendor listing subscription — South Asian wedding vendors pay for premium placement and profile visibility
- Premium AI credits — usage-based pricing for high-volume contract reviews above plan limits

---

## 13. Go-To-Market Strategy (unchanged from v1.0)

### 13.1 Beachhead: Seed Through Planners

The fastest path to initial traction is through Indian wedding planners in the top 5 South Asian diaspora metros: Greater Toronto, New York metro, Bay Area, Chicago, and Houston. A single planner using Shaadi AI exposes the product to every couple they work with and every vendor in their network.

- Direct outreach to 50 Indian wedding planners in target cities — offer free 3-month trial in exchange for feedback
- Attend South Asian wedding industry events (South Asian Bridal Show, Desi Bridal Bazaar) for direct relationship-building
- Partner with South Asian wedding vendor associations and planner networks
- White-glove onboarding for first 20 planners — including migration support from Aisle Planner

### 13.2 Couple Acquisition

- Planner referral program — planners invite couples to the platform, couples see Shaadi AI branding throughout their planning journey
- South Asian community channels — diaspora Facebook groups, Reddit communities (r/SouthAsianWeddings), Instagram targeting
- SEO content strategy targeting high-intent searches: 'Indian wedding planner Toronto', 'South Asian wedding budget template', 'Indian wedding contract review'
- Influencer partnerships with South Asian wedding content creators on Instagram and YouTube

### 13.3 Launch Timeline

| Phase | Timeline | Milestones |
|-------|----------|------------|
| 0 — Capstone | March–April 2026 | Working prototype of AI Contract Intelligence Suite built on Bubble + Claude API. Validated with 3 planners and 3 couples. |
| 1 — Private Beta | May–June 2026 | 20 planner beta users across 3 cities. Full feature set live. Feedback loop active. Pricing model validated. |
| 2 — Public Launch | July 2026 | Public launch with all V1 features. Paid tiers live. Active in Toronto, New York, Bay Area. |
| 3 — Growth | Aug–Dec 2026 | Expand to Chicago and Houston. Launch couple-direct acquisition. Begin V2 planning (vendor directory). |

---

## 14. Risks & Mitigations (unchanged from v1.0)

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | AI contract summary misses a critical clause, eroding user trust | Medium | High | Clear 'verify with a professional' disclaimer on all summaries. Confidence indicator on each extracted clause. Ongoing accuracy testing against human-reviewed contracts. |
| 2 | Planners resist switching from existing tools (Aisle Planner) due to switching costs | High | High | White-glove migration support for first 20 planners. Free 3-month trial. Build import tools for existing Aisle Planner data. |
| 3 | AI outreach drafts don't sound like the planner — feature not adopted | Medium | Medium | Style profile onboarding is mandatory before first draft. Edit-and-learn loop improves accuracy over time. User feedback button on every draft. |
| 4 | BollyWeds opens their platform to self-serve users or raises capital for expansion | Low | High | Move quickly to establish market presence and planner relationships before BollyWeds pivots. Cultural intelligence moat and community network effects are defensible. |
| 5 | LLM API costs exceed projections at scale | Medium | Medium | Usage limits per subscription tier. Optimize prompts for token efficiency. Monitor per-user API cost against subscription revenue monthly. |
| 6 | AI adoption hesitancy among older planners or traditional families | Medium | Low | Frame AI features as assistant tools, not replacements. Ensure all AI outputs are editable, not auto-applied. Build trust gradually through accurate, useful outputs. |
| 7 | Capstone prototype not buildable within timeline | Low | High | Scope is focused on one end-to-end AI feature (Contract Intelligence) in a no-code stack. All other features can be mocked or simulated for the demo. |

---

## 15. Open Questions (unchanged from v1.0)

| # | Question | Impact / Next Step |
|---|----------|-------------------|
| 1 | How will Shaadi AI handle contracts in non-standard or image-based PDF formats where text extraction fails? | Determines fallback UX for OCR failures. Test with a range of real vendor contracts before launch. |
| 2 | What is the right level of legal disclaimer for AI contract summaries — and how does it affect user trust? | Legal review needed. Disclaimer must be visible but not undermine confidence in the feature. |
| 3 | Should the couple tier be sold directly from the start, or only introduced after planner-led adoption is established? | Go-to-market sequencing decision. Lean toward planner-first in months 1-3, couple-direct from month 4. |
| 4 | How should Shaadi AI handle cultural variation for non-Hindu South Asian weddings (Muslim, Sikh, Christian) in the initial V1? | Determines scope of the cultural background interview. Minimum viable: North Indian Hindu + Punjabi Sikh. V1.1: Muslim and South Indian. |
| 5 | What data is needed to build the Indian wedding contract norm benchmarks that power the traffic light flags? | Primary research needed: collect and analyze 50+ real South Asian wedding vendor contracts across key categories before launch. |

---

## 16. Appendix

### 16.1 Glossary

| Term | Definition |
|------|------------|
| Mehndi | Pre-wedding ceremony where henna is applied to the bride and female guests. Typically held 1-2 days before the wedding. |
| Haldi | Pre-wedding ceremony where turmeric paste is applied to the couple for good luck. Requires an easily cleanable venue. |
| Sangeet | Music and dance celebration, often combined with a Garba night for Gujarati weddings. Typically the evening before the wedding. |
| Baraat | The groom's wedding procession — traditionally on horseback, now often in a decorated car — arriving at the wedding venue with music and dancing. |
| Mandap | The ceremonial canopy or arch under which Hindu wedding vows are exchanged. |
| Saat Phere | The seven vows taken by the couple around the sacred fire in a Hindu wedding ceremony. |
| Pandit | A Hindu priest who officiates the wedding ceremony. |
| Garba | A traditional Gujarati folk dance performed during the Sangeet or a dedicated Garba night. |
| NRI / Diaspora | Non-Resident Indian — Indian nationals or people of Indian origin living outside India, particularly in North America and the UK. |
| LLM | Large Language Model — the AI technology powering Shaadi AI's natural language features (Claude, GPT-4, etc.). |
| MRR | Monthly Recurring Revenue — the predictable monthly revenue from all active subscriptions. |
| PLG | Product-Led Growth — a go-to-market strategy where the product itself drives user acquisition, activation, and retention. |

### 16.2 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 2026 | Varun Nair | Initial draft — covers full product vision, AI Contract Intelligence Suite as primary feature, competitive landscape, user personas, feature requirements, tech stack, and monetization model |
| 2.0 | April 2026 | Varun Maryada | Added Section 3: MVP Scope Definition — separates Capstone Prototype (must-build vs. mock), V1 Launch, and V2+ scope. Expanded Section 4: Goals & Success Metrics — adds North Star Metric, capstone success criteria, V1 launch metrics, leading vs. lagging indicator map. All other sections carried forward from v1.0 without change. |

---

*Last updated: April 2026 | Author: Varun Maryada | Version: 2.0*
