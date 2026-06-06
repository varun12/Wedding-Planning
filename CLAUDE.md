# CLAUDE.md — Shaadi AI Project Context

This file contains the full product context for **Shaadi AI**, developed during an AI Product Management capstone project (Product Faculty, June 2026). Use this file to onboard into the project quickly. All key decisions, research, and product definitions are captured here.

## Repository Structure

```
Wedding-Planning/
├── CLAUDE.md                  ← this file
├── README.md
├── app/                       ← all application code (React + Vite + Supabase)
│   ├── src/                   ← components, pages, hooks, contexts
│   ├── supabase/              ← edge functions + migrations
│   ├── public/
│   └── package.json
└── docs/                      ← all PM artifacts (read-only for the app)
    ├── Design/                ← wireframes, evals, master prompts, use cases
    ├── Development/           ← model selection, RAG architecture, eval methods
    └── Discovery/             ← PRD v1.0, PRD v2.0

```

**Claude Code writes to `app/` only.** `docs/` is PM reference material — do not modify it when making code changes.
**Lovable syncs to `app/` only.** Connect Lovable to this GitHub repo (`varun12/Wedding-Planning`) pointing at the `app/` subfolder.

---

## 1. What Is Shaadi AI?

Shaadi AI is an **AI-powered wedding planning platform built natively for the North American Indian diaspora**. It is the first self-serve wedding planning tool designed specifically for multi-event Indian weddings — covering events like Mehndi, Haldi, Sangeet, Baraat, Wedding Ceremony, and Reception.

Every major competitor (The Knot, Zola, WeddingWire, Aisle Planner) was built for a single-day Western wedding. Shaadi AI is built from the ground up for the structural reality of a 4-6 event, multi-vendor, multi-family Indian wedding with an average US cost of $225,000–$285,000.

**This is a product-led business** with a sales-assisted motion for the planner tier early on. It is not a service business.

---

## 2. The Problem

Indian diaspora couples and planners in North America have no wedding planning software built for their actual wedding. They currently manage everything across:
- WhatsApp threads (family communication)
- Colour-coded Google Sheets (budget and vendor tracking)
- Email chains (vendor outreach and contracts)

The core pain: **no tool understands the structure of an Indian wedding**, so every workaround creates more friction, more errors, and more stress around the highest-stakes event of their lives.

### Complexity Gap: Indian vs. Western Wedding

| Dimension | Western Wedding | Indian Wedding |
| --- | --- | --- |
| Number of events | 1 | 4–6 |
| Vendors to coordinate | 8–12 | 20–30+ |
| Average guest count (US) | 117 | 300–400+ |
| Average total cost (US) | $34,000 | $225,000–$285,000 |
| Active decision makers | Couple | Couple + both families |
| Planning duration | 6–12 months | 12–18 months |

---

## 3. Target Market

- **Wedding planning software market:** $1.52B (2024), growing at **13.1% CAGR to 2033** (Growth Market Reports)
- **US wedding planning services:** $64.93B (2024), growing at **8.5% CAGR to 2030** — planning services specifically at **8.5% CAGR** (Grand View Research)
- **Indian diaspora wedding market:** $15B+ annually worldwide (TwoWords.io / Indian Wedding Industry 2025)
- **Indian wedding services market:** $103.93B (2024), growing at **14.3% CAGR to 2030** (Grand View Research)
- **AI adoption in weddings:** Doubled year-over-year to **36% of couples** in 2025 (The Knot Worldwide, 2026 Real Weddings Study)

---

## 4. Target Personas

### Persona 1: The Indian Wedding Planner (Primary)
- **Name:** Priya
- **Location:** Greater Toronto Area (also: New York, Bay Area, Chicago, Houston)
- **Context:** Professional full-service Indian wedding planner. Manages 15–20 South Asian weddings per year.
- **Current tools:** Aisle Planner, Google Sheets, WhatsApp, Gmail
- **Primary goal:** Manage multi-event weddings more efficiently and grow her business without adding headcount
- **Key pain:** Forces a $250K 6-event wedding into tools built for a Western single-day event. Spends hours on repetitive manual tasks.
- **Willingness to pay:** High ($200–400/month) — she is running a business and understands tool ROI
- **Strategic role:** Primary buyer, primary user, AND most powerful distribution channel. One planner brings 10–30 couples per year.

### Persona 2: The Self-Managing Diaspora Couple (Secondary)
- **Names:** Neha & Arjun
- **Location:** New York metro area
- **Context:** Dual-income professionals, planning a 5-event Indian wedding, 280 guests, 14 months out, without a full-service planner
- **Current tools:** The Knot (partially), Google Sheets, WhatsApp family group
- **Primary goal:** Stay in control of a $250K wedding without drowning in it
- **Key pain:** Reviewing contracts they don't understand, managing a guest list that changes constantly, reconciling a budget across 5 events simultaneously
- **Willingness to pay:** Moderate to high ($30–60/month)
- **Strategic role:** Volume user and long-term growth engine. High referral potential within the South Asian community.

### Secondary Users (not target personas)
- **Couple working with a planner** — accesses Shaadi AI through planner's workspace, uses couple dashboard for visibility only
- **Parents / family decision-makers** — read-only budget and event status access, no purchase intent but influence couple's adoption

---

## 5. Competitive Landscape

### Key Competitors

| Competitor | Threat Level | Key Gap |
| --- | --- | --- |
| **BollyWeds** | Highest — watch closely | Agency model, not self-serve. No contract review. If they go self-serve, they become a direct threat. |
| **WeddAI (wedd.ai)** | Medium — early stage | India-market focused, ~100 users, no contract review, no NA diaspora targeting. Moving in the right direction. |
| **The Knot** | Structural — long-term | Largest US platform, just launched AI in Sept 2025 (style-matching only). Can't easily rebuild for Indian wedding structure. Most likely acquirer. |
| **Aisle Planner** | Direct for planner tier | Current tool many Indian planners use. No cultural intelligence, no AI. $59–189/month. |
| **WedMeGood** | Validates market | Culturally aware but India-only vendor network. Wrong geography for diaspora couples. |
| **Zola / WeddingWire** | Indirect | Multi-event guest management exists generically. No cultural intelligence, no AI coordination. |

### What No Competitor Does
- AI contract review for wedding vendors — **complete white space**
- Multi-event Indian wedding architecture as the structural foundation
- Self-serve platform for North American diaspora couples with cultural intelligence built in
- Dual-user model (couple + planner) with appropriate permission levels

---

## 6. Key Differentiators

1. **Built natively for Indian weddings** — not a Western tool with labels renamed
2. **Cultural intelligence as a compounding moat** — understands event-specific vendor categories, ritual sequencing, and diaspora logistics; deepens with every wedding
3. **AI Contract Intelligence** — only platform offering contract review for wedding vendors; genuine white space
4. **First self-serve platform for the North American Indian diaspora** — BollyWeds requires hiring them as an agency
5. **Dual-user model** — couple and planner in one platform with distinct permission levels
6. **Multi-event budget tracker** — single live view across all events, replacing 6 spreadsheets
7. **Guest segmentation built for Indian wedding logic** — one master list, per-event invitation logic handled automatically
8. **Right product, right market, right moment** — 13.1% CAGR software market, 36% AI adoption doubling YoY, $15B+ diaspora market

---

## 7. Core Features

### 7.1 AI Contract Intelligence Suite ← PRIMARY CAPSTONE FEATURE

**Why this feature:** No competitor offers AI contract review for wedding vendors. Serves both primary personas. Most demonstrable in a prototype. Builds trust in the AI layer that unlocks all other features.

**Sub-features:**

**a) Plain-Language Contract Summary**
- User uploads vendor contract PDF (max 25MB)
- LLM processes and returns structured plain-language summary within 60 seconds
- Covers: payment schedule, cancellation policy, inclusions/exclusions, overtime rates, exclusivity clauses, liability terms
- Written at 8th-grade reading level

**b) Traffic Light Clause Flagging**
- Each clause rated: Green (standard), Yellow (review recommended), Red (high-risk/unusual)
- Each flag includes a plain-language explanation and Indian wedding market norm benchmark
- Overall contract risk score: Low / Medium / High

**c) One-Click Response Drafting**
- For any Yellow/Red flag, user clicks "Draft Response"
- LLM generates a professional vendor negotiation email addressing the specific clause
- Tone matched to planner's voice profile if set up
- User edits and sends (or copies to email client)

**d) Post-Signing Obligation Tracker**
- When contract is marked signed, LLM extracts all time-bound obligations (payment dates, deadlines, confirmation calls)
- Obligations populate an Obligation Tracker dashboard
- Automated reminders at 14 days, 7 days, 1 day before each deadline
- Payment deadlines link to the budget tracker calendar

### 7.2 Multi-Event Wedding Structure
- Pre-configured with standard Indian wedding event sequence (Mehndi, Haldi, Sangeet, Baraat, Ceremony, Reception)
- Each event has its own vendor checklist, budget line, timeline, guest subset, and task list
- Cultural background interview at setup — LLM generates custom event structure for regional/religious variations
- Blend mode for interfaith or inter-regional couples
- Changes cascade automatically through all downstream features

### 7.3 AI Vendor Outreach Engine
- Style profile builder: planner pastes 3–5 past emails, LLM extracts her tone and vocabulary
- Generates personalized outreach drafts per event type and vendor category
- One-click tone adjustment (formal / conversational / warm)
- Edit-and-learn loop improves style match over time
- Vendor response tracking integrated with budget tracker

### 7.4 Multi-Event Budget Tracker
- Unified live budget across all events, broken down by event and vendor category
- Pre-suggested allocations based on total budget and typical Indian wedding spend ratios
- Real-time updates as vendor quotes are logged
- Variance alerts + AI budget reallocation suggestions weighted by couple's stated priorities
- Shared view between couple and planner with planner-controlled visibility
- Read-only budget summary for parents
- Payment calendar across all vendors

### 7.5 Guest List With Per-Event Segmentation
- Single master guest list with per-event tagging
- Natural language guest import — paste any format (WhatsApp message, spreadsheet, typed list) and LLM extracts structured records
- Photo import of handwritten lists via OCR
- Fuzzy duplicate detection
- Relationship tagging drives AI-suggested event assignments in bulk
- Per-event RSVP tracking with automated follow-up drafting
- Per-event headcount export for venue and catering

### 7.6 Couple-Planner Collaboration Dashboard
- Planner view: full coordination command center
- Couple view: clean status dashboard (event status, budget summary, vendor confirmations, guest counts)
- Parent view: read-only budget summary and event status
- Shared comments and notes
- Activity feed with timestamps
- Mobile-optimized (critical for wedding week use)

---

## 8. Out of Scope (V1)

The following are **explicitly excluded** from V1:
- Meal/calorie tracking or daily food logging
- In-app invitation sending and RSVP hosting (guest segmentation logic demonstrated; delivery is V2)
- Vendor marketplace or vendor directory (cold-start problem — post-launch)
- Automated calendar/scheduling integration (can be mocked for demo)
- Payment processing for vendor bookings
- Multilingual support (Hindi, Punjabi, Gujarati) — V2 priority
- Mobile native app (iOS/Android) — V1 is mobile-responsive web
- Post-wedding features (thank-you notes, photo albums)

---

## 9. User Journeys (Happy Path — Summarized)

### Planner Journey
1. **Discovery & Onboarding** — Referred by peer planner; signs up; platform configures for Indian wedding structure immediately; 30-min onboarding call; first wedding migrated
2. **Setting Up a New Wedding** — Creates wedding, selects event lineup, inputs budget; AI generates planning framework; couple invited to dashboard
3. **Vendor Outreach** — Selects vendor category; AI drafts personalized outreach in her voice; sends in minutes; response tracking automated
4. **Contract Review** — Uploads PDF; AI returns plain-language summary with flags; forwards to couple with recommendation; contract signed same day
5. **Budget Management** — Dashboard flags variance; AI suggests reallocation; planner shares live view with couple; updated in one click
6. **Guest Management** — Couple builds master list; per-event tags applied; AI handles invitation logic; per-event headcounts exported for caterer
7. **Wedding Week & Wrap-Up** — Timeline view tracks outstanding tasks; automated vendor reminders sent; wedding runs smoothly; referral generated

### Couple Journey
1. **Discovery & Onboarding** — Frustrated with The Knot; finds Shaadi AI; platform immediately reflects real wedding structure; feels organized for first time
2. **Building Wedding Structure** — Customizes event lineup; sets budget allocations; shares view with parents
3. **Vendor Outreach** — Inputs vendor contacts; AI drafts personalized emails; sends in minutes; budget auto-updates from quotes
4. **Contract Review** — Uploads contract; AI flags coverage gap before signing; addresses it; avoids a day-of conflict
5. **Budget Tracking** — Dashboard shows surplus; AI suggests reallocation options; couple decides together in shared notes
6. **Guest Management** — Tags 280 guests by event; AI handles invitation logic; per-event headcounts exported
7. **Wedding Week** — Checklist view tracks everything; all vendors confirmed 2 days before; best friend gets the first referral link

---

## 10. Key Friction Points (AI-Solvable, Prioritized)

| Rank | Pain Point | GenAI Solution |
| --- | --- | --- |
| 1 | AI outreach doesn't sound like the planner | Style profile builder + edit-and-learn loop |
| 2 | Contract summary misses a clause | Structured LLM extraction + traffic light flagging |
| 3 | No vendor discovery for self-managing couples | Conversational vendor discovery flow |
| 4 | Budget variance with no guidance | AI budget advisor with priority-weighted suggestions |
| 5 | Cultural structure limited to North Indian weddings | Cultural background interview + dynamic event generation |
| 6 | No context around flagged contract items | "Is this normal?" explainer + industry norm benchmarking |
| 7 | Guest list arrives in messy formats | Natural language extraction + photo OCR import |
| 8 | Wedding week information overload | AI daily briefing + day-of command view |

---

## 11. Technology Stack

| Layer | Tool | Purpose |
| --- | --- | --- |
| Frontend / App | React + Vite + TypeScript (built in Lovable) | All user-facing interfaces — planner dashboard, couple dashboard, contract upload flow |
| UI Components | shadcn/ui + Tailwind CSS | Component library and styling |
| AI / LLM | Claude API (`claude-sonnet-4-6`) | Contract summarization, flag generation, response drafting, outreach generation, cultural setup interview |
| Backend / Database | Supabase | Postgres database, auth, storage, real-time |
| Serverless Functions | Supabase Edge Functions (Deno) | Bridges frontend with Claude API — handles contract analysis and response drafting |
| Authentication | Supabase Auth | User accounts, role-based access (planner / couple / parent) |

> **Note:** Original plan was Bubble.io + Make + PDF.co. Switched to Lovable (React/Vite) + Supabase during capstone build. All PM docs in `docs/` still reference the original stack — the architecture decisions remain valid; only the implementation layer changed.

### AI Architecture: Contract Intelligence Pipeline
1. **Frontend** uploads contract PDF to Supabase Storage
2. **Supabase Edge Function (`analyze-contract`)** — extracts PDF text, calls Claude API with structured summarization prompt
3. **Claude API** — Flag generation: evaluates each clause against Indian wedding vendor contract norms; generates traffic light ratings + explanations
4. **Claude API** — Risk scoring: aggregates flags into Low/Medium/High risk score with plain-language rationale
5. **Supabase Edge Function (`draft-response`)** — receives flagged clause + vendor category + planner style profile; calls Claude API
6. **Claude API** — Response drafting: generates targeted negotiation email
7. **Claude API** — Obligation extraction: extracts time-bound obligations from signed contract; returns structured JSON for Obligation Tracker

---

## 12. Monetization

| Tier | User | Price | Key Features |
| --- | --- | --- | --- |
| Couple — Standard | Self-managing couple | $39/month | All features, 10 contract reviews/month |
| Couple — Premium | Complex wedding | $59/month | Unlimited contract reviews, priority AI, parent access |
| Planner — Professional | Solo planner | $199/month | Unlimited weddings, all AI features, style profile, collaboration dashboard |
| Planner — Agency | Planning firm | $349/month | Multi-planner access, team collaboration, analytics |

**6-month post-launch revenue projection:**
- 50 planner accounts × $220 avg = $11,000 MRR
- 150 couple accounts × $45 avg = $6,750 MRR
- **Total MRR: \~$17,750 | ARR run rate: \~$213,000**

---

## 13. Go-To-Market

**Beachhead:** Seed through Indian wedding planners in top 5 diaspora metros — Greater Toronto, New York, Bay Area, Chicago, Houston.

**Planner acquisition:**
- Direct outreach to 50 planners — free 3-month trial for feedback
- Attend South Asian wedding industry events (South Asian Bridal Show, Desi Bridal Bazaar)
- Partner with South Asian wedding vendor associations
- White-glove onboarding for first 20 planners including Aisle Planner migration support

**Couple acquisition (planner-led first):**
- Planners invite couples to the platform — couples experience Shaadi AI branding throughout
- South Asian community channels: diaspora Facebook groups, Reddit (r/SouthAsianWeddings), Instagram
- SEO targeting high-intent searches: "Indian wedding planner Toronto", "South Asian wedding budget template"
- South Asian wedding influencer partnerships (Instagram, YouTube)

**Launch phases:**
- **Phase 0 (March–June 2026):** Capstone prototype — AI Contract Intelligence Suite on React/Supabase + Claude API. Submission deadline: June 15, 2026.
- **Phase 1 (May–June 2026):** Private beta — 20 planner users, 3 cities, full feature set
- **Phase 2 (July 2026):** Public launch — paid tiers live, Toronto + New York + Bay Area
- **Phase 3 (Aug–Dec 2026):** Expand to Chicago + Houston; couple-direct acquisition; V2 planning

---

## 14. Key Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| AI contract summary misses a critical clause | Medium | Clear disclaimer, confidence indicator, ongoing accuracy testing |
| Planners resist switching from Aisle Planner | High | White-glove migration support, free 3-month trial, import tools |
| AI drafts don't sound like the planner | Medium | Mandatory style profile onboarding, edit-and-learn loop |
| BollyWeds goes self-serve | Low | Move quickly to establish planner relationships; cultural moat is defensible |
| LLM API costs exceed projections | Medium | Usage limits per tier, prompt optimization, monthly cost monitoring |
| Capstone prototype not buildable in time | Low | Scope is focused on one end-to-end AI feature; other features can be mocked |

---

## 15. Open Questions (Unresolved)

1. How will the platform handle non-standard or image-based PDF contracts where text extraction fails?
2. What is the right legal disclaimer framing for AI contract summaries?
3. Should the couple tier launch immediately or only after planner-led adoption is established?
4. Which cultural variations to support in V1 beyond North Indian Hindu — minimum viable: + Punjabi Sikh
5. What real contract data is needed to build accurate Indian wedding vendor norm benchmarks for traffic light flags? (Target: 50+ real contracts collected before launch)

---

## 16. Documents Produced

All documents are available in the project outputs:

| Document | Description |
| --- | --- |
| `ShaadiAI_Capstone_Outline.docx` | Structured 5-section outline: problem, users, solution, AI rationale, central claim |
| `ShaadiAI_Competitive_Research.docx` | Deep competitive analysis of 9 competitors with capability matrix |
| `ShaadiAI_PRD_v1.0.docx` | Full Product Requirements Document v1.0 — 16 sections covering all product decisions (superseded) |
| `docs/Discovery/ShaadiAI_PRD_v2.0.md` ← **DEFAULT PRD** | Full Product Requirements Document v2.0 — adds MVP Scope Definition (Section 3) with explicit Capstone vs. V1 vs. V2 build boundaries, and expanded Success Metrics (Section 4) with North Star, capstone criteria, V1 launch metrics, and leading/lagging indicators |

---

## 17. Glossary

| Term | Definition |
| --- | --- |
| Mehndi | Pre-wedding henna ceremony, 1–2 days before wedding |
| Haldi | Pre-wedding turmeric ceremony, requires cleanable venue |
| Sangeet | Music and dance celebration, typically evening before wedding |
| Baraat | Groom's arrival procession with music and dancing |
| Mandap | Ceremonial canopy under which Hindu vows are exchanged |
| Saat Phere | Seven vows taken around sacred fire in Hindu ceremony |
| Pandit | Hindu priest who officiates the ceremony |
| Garba | Traditional Gujarati folk dance at Sangeet or dedicated night |
| NRI / Diaspora | Non-Resident Indian — Indian-origin people living outside India |
| LLM | Large Language Model — AI powering Shaadi AI's natural language features |
| MRR | Monthly Recurring Revenue from active subscriptions |
| PLG | Product-Led Growth — product itself drives acquisition and retention |

---

*Last updated: April 2026 | Author: Varun Maryada | Version: 1.0*
*For questions about this document, refer to the full conversation history in Claude.ai*
