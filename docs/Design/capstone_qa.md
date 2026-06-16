# Shaadi AI — Capstone Q&A

Answers to likely capstone presentation and interview questions. Saved for future reference.

---

## Q: What aspects of the AI solution will you demonstrate in your prototype? How will the AI inputs, processing, and outputs be presented visually to users? Which features are essential for launch? What can be left for later releases?

### Part 1: What the prototype demonstrates

The prototype demonstrates the complete **AI Contract Intelligence Suite** end-to-end — one full user journey from contract upload to obligation tracking. This was chosen deliberately: it is the clearest white space in the market, it is the most demonstrable AI feature in a 4-minute video, and it exercises the full AI pipeline (input → Claude API → structured output → UI).

**What is live and demonstrated:**

**Input — Contract Upload**
The user uploads a vendor contract PDF or pastes contract text directly. The UI presents two input modes (Upload PDF / Paste Text) with a drag-and-drop zone, file validation (PDF only, 25MB max), and a warning for scanned image PDFs. Vendor name and category are entered to give the AI context for market norm benchmarking.

**Processing — AI Pipeline (visible to user)**
A three-stage progress indicator shows the user what is happening in real time:
- Stage 1: Extracting text — green when complete
- Stage 2: Analyzing clauses — amber while in progress
- Stage 3: Generating summary — grey until reached

This removes the black-box feeling of waiting for an AI response and builds trust that something real is happening.

**Output 1 — Plain-Language Contract Summary**
The Contract Summary Dashboard presents every major clause (payment schedule, cancellation policy, inclusions, exclusions, overtime, exclusivity, force majeure) in plain English at an 8th-grade reading level. A full-width risk score banner (LOW / MEDIUM / HIGH) at the top tells the user the overall risk level in under 5 seconds.

**Output 2 — Traffic Light Clause Flags**
Each clause is rated GREEN / YELLOW / RED with a color-coded card, a plain-language explanation of why it was flagged, and a one-sentence benchmark against North American Indian wedding vendor market norms. The user sees not just what a clause says but whether it is normal.

**Output 3 — One-Click Response Drafting**
Clicking "Draft Response" on any yellow or red flag generates a professional vendor negotiation email addressing the specific clause. The user can switch tone (professional / warm / formal), regenerate, edit in place, and copy or send. The draft is pre-filled and send-ready with minimal editing.

**Output 4 — Obligation Tracker**
When the contract is marked as signed, the AI extracts every time-bound obligation (payment deadlines, confirmation calls, headcount submissions) and populates the Obligation Tracker. Each obligation is displayed with urgency coloring (red = due within 7 days, amber = 8–21 days) and automated reminders at 14, 7, and 1 day before each deadline.

---

### Part 2: Essential for launch vs. later releases

**Essential for V1 launch (July 2026):**
- AI Contract Intelligence Suite (fully live — already in prototype)
- Multi-event wedding structure (the architectural foundation everything else depends on)
- Multi-event budget tracker (core planner workflow — needed for first paid planners)
- Guest list with per-event segmentation (needed before any wedding can go live on the platform)
- Couple-planner collaboration dashboard (needed for the dual-user model that drives planner acquisition)
- AI vendor outreach engine (needed for planner ROI — this is the second most demonstrable time-saver)

**Deferred to V2 (Aug–Dec 2026):**
- In-app invitation sending and RSVP hosting (guest segmentation logic is in V1; delivery mechanism is V2)
- Vendor marketplace and directory (cold-start problem — requires vendor supply before it is useful)
- Automated calendar and scheduling integration (can be mocked in V1 with manual workaround)
- Multilingual support: Hindi, Punjabi, Gujarati (V1 is English only)
- Mobile native app (V1 is mobile-responsive web; native app is V2)
- Post-wedding features: thank-you notes, photo albums, review requests

**The prioritization logic:** V1 must deliver enough value that a planner will pay $199/month and migrate away from Aisle Planner. That requires the contract review, budget tracker, guest list, and outreach features to all be functional. Everything else can wait until the first 50 planner accounts validate which V2 features matter most.

---

## Q: What are the core features of your product, and how do they address user needs?

Shaadi AI has six core features, each mapped directly to a pain point in how Indian diaspora couples and planners manage weddings today.

---

### 1. AI Contract Intelligence Suite *(primary capstone feature)*
**User need:** Planners and couples sign 20–30 vendor contracts per wedding — often without fully understanding what they're agreeing to. No existing tool offers any form of contract review.

**How it addresses it:**
- Uploads a vendor contract PDF or pasted text and returns a plain-language summary of every clause within 60 seconds — written at an 8th-grade reading level so no legal background is needed
- Traffic light flagging (green / yellow / red) on every clause, benchmarked against North American Indian wedding vendor market norms — so users know not just *what* a clause says but *whether it's normal*
- One-click response drafting generates a professional negotiation email for any flagged clause, matched to the planner's writing style
- Post-signing obligation extraction automatically pulls every payment deadline and confirmation call from the signed contract into an Obligation Tracker with automated reminders

This is genuine white space — no competitor offers AI contract review for wedding vendors.

---

### 2. Multi-Event Wedding Structure
**User need:** Every tool on the market was built for a single-day Western wedding. Indian weddings span 4–6 events (Mehndi, Haldi, Sangeet, Baraat, Ceremony, Reception), each with its own vendors, budget, guest list, and timeline. Planners currently manage this across multiple spreadsheets.

**How it addresses it:**
- The platform is architected around events as the primary unit — not a single wedding day
- Each event has its own vendor checklist, budget line, task list, guest subset, and timeline
- A cultural background interview at setup lets the AI generate a custom event structure for regional and religious variations (Punjabi Sikh, Tamil Hindu, interfaith, etc.)
- Changes to the event lineup cascade automatically through all downstream features

---

### 3. Multi-Event Budget Tracker
**User need:** Couples and planners track budgets across 5–6 events in separate spreadsheets, with no unified view and no guidance when spending goes off track.

**How it addresses it:**
- Single live budget dashboard across all events, broken down by event and vendor category
- Pre-suggested allocations based on total budget and typical Indian wedding spend ratios
- Real-time variance alerts with AI-generated reallocation suggestions weighted by the couple's stated priorities
- Shared view between couple and planner, with read-only access for parents
- Payment calendar shows all vendor deadlines across every event in one view

---

### 4. Guest List with Per-Event Segmentation
**User need:** Indian weddings have 300–400+ guests who are not all invited to every event. Managing who is invited to which event is currently done manually in spreadsheets, often by multiple family members simultaneously.

**How it addresses it:**
- Single master guest list with per-event tagging — one source of truth regardless of how many events
- Natural language guest import — paste any format (WhatsApp message, handwritten list, spreadsheet) and the AI extracts structured records
- Relationship tagging drives AI-suggested event assignments in bulk
- Per-event RSVP tracking with automated follow-up drafting
- Per-event headcount export for venue and catering

---

### 5. AI Vendor Outreach Engine
**User need:** Planners send dozens of outreach emails per wedding. Generic templates don't reflect their voice, and writing personalized emails for every vendor category is time-consuming.

**How it addresses it:**
- Style profile builder — planner pastes 3–5 past emails, AI extracts her tone and vocabulary
- Generates personalized outreach drafts per event type and vendor category in her voice
- One-click tone adjustment (formal / conversational / warm)
- Edit-and-learn loop improves style match over time

---

### 6. Couple-Planner Collaboration Dashboard
**User need:** When a couple works with a planner, communication happens across WhatsApp, email, and phone calls. There is no shared workspace where both parties can see the same live status.

**How it addresses it:**
- Planner view: full coordination command center — vendors, contracts, budget, tasks
- Couple view: clean status dashboard — event status, budget summary, vendor confirmations, guest counts
- Parent view: read-only budget summary and event status (no clutter, no overwhelm)
- Shared comments, activity feed, and mobile-optimized design for wedding week use

---

## Summary

Every feature maps to a structural gap in how Indian weddings are actually managed:

| Feature | Pain It Replaces |
|---|---|
| AI Contract Intelligence | Reading vendor contracts without legal help |
| Multi-Event Structure | Managing 6 events in 6 spreadsheets |
| Budget Tracker | Reconciling spend across events with no unified view |
| Guest List | Manual per-event invitation logic across 300+ guests |
| Vendor Outreach | Writing personalized emails from scratch for every vendor |
| Collaboration Dashboard | Coordinating between couple, planner, and family on WhatsApp |
