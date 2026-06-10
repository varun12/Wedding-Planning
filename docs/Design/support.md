# Shaadi AI — User Support, Escalation & Ownership

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada

---

## 1. Current State (Capstone / Pre-Beta)

No formal support system is in place. Support channels, help documentation, and escalation paths are pre-launch items. The founder handles all user issues directly.

---

## 2. Support Channels by Phase

### Phase 1 — Private Beta (June–July 2026)
Direct founder-to-user support. High-touch by design — beta users are the feedback source for product improvement.

| Channel | Who Uses It | Response Target |
|---------|------------|----------------|
| Dedicated WhatsApp or Slack group (per beta cohort) | 20 beta planners | Same day |
| Direct email (founder) | Any beta user | Within 24 hours |
| In-app feedback form (post-contract analysis) | All users | Reviewed weekly |

### Phase 2 — Public Launch (July 2026)
Support scales to handle inbound from paid users across three tiers.

| Channel | Who Uses It | Response Target |
|---------|------------|----------------|
| In-app chat (e.g., Intercom) | All paid users | < 4 hours (business hours) |
| Email: support@shaadiai.com | All users | < 24 hours |
| Help center / FAQ (self-serve) | All users | Instant (self-serve) |
| Dedicated Slack channel | Planner — Agency tier | Same day |

### Self-Serve Resources (to be built before Phase 2)
- **Help center** — covers contract upload, how to read a summary, understanding traffic light flags, paste text fallback, obligation tracker, billing
- **FAQ** — full version published at `docs/Design/marketing_assets.md`; web version at `/help/faq`
- **In-app tooltips** — contextual help on traffic light flags, risk score, and disclaimer

---

## 3. Common Failure Modes and First-Response Playbook

| Issue | Likely Cause | First Response |
|-------|-------------|----------------|
| "My PDF won't analyze" | Scanned image PDF | Direct user to Paste Text tab; explain scanned PDFs require manual text copy |
| "The AI missed a clause in my contract" | Extraction gap or hallucination | Ask user to share contract (redacted if needed); run manual review; log as potential eval failure; escalate to prompt review if confirmed |
| "The risk score seems wrong" | Module B flag accuracy issue | Ask which flag seems off; compare to market norm benchmark; log for next eval run |
| "I can't log in" | Auth issue (Supabase) | Check Supabase Auth logs; reset password flow; escalate to Supabase support if platform issue |
| "My obligations disappeared" | Browser refresh — state not persisted | Known issue (UI-only, not saved to DB); acknowledge and log as priority fix (see TODOs) |
| "The response draft doesn't sound right" | Style profile not set up or temperature drift | Walk user through style profile setup; offer to regenerate |
| App not loading | Supabase or Lovable outage | Check Supabase status page; check edge function logs; communicate ETA to affected users |

---

## 4. Escalation Path

### Tier 1 — Self-Serve
User resolves issue via help center, FAQ, or in-app tooltip. No human involved.

### Tier 2 — Support Team (or Founder in Beta)
User contacts support via chat or email. Support resolves using the first-response playbook above. Target: resolve within one interaction.

### Tier 3 — Founder / Technical Escalation
Issues that cannot be resolved at Tier 2:
- **AI accuracy complaint** (contract clause missed, wrong flag rating) → Founder reviews; logs for eval run; determines if prompt fix is needed
- **Data or privacy concern** (user believes their data was accessed or shared incorrectly) → Founder investigates immediately via Supabase logs; responds within 2 hours; escalates to legal if breach confirmed
- **Platform outage** (edge function error rate > 20%, app inaccessible) → Founder executes rollback procedure per `docs/Development/infra.md`; communicates status to affected users within 1 hour
- **Billing dispute** → Manual resolution by founder; full refund policy for first 30 days

### Tier 4 — External Escalation
- **Legal complaint** (AI output caused harm, UPL allegation) → External legal counsel; immediate response; review AI disclaimer adequacy
- **Infrastructure incident** (Supabase or Anthropic outage beyond our control) → Monitor vendor status pages; communicate to users; no internal escalation path beyond status updates

---

## 5. Ownership

| Area | Owner (Beta) | Owner (V1 Launch) |
|------|-------------|-------------------|
| All user support | Founder | Customer success hire (Month 3) |
| AI accuracy issues | Founder | Founder + PM |
| Platform/infra issues | Founder | Founder + engineering |
| Data/privacy incidents | Founder | Founder + legal counsel |
| Billing disputes | Founder | Finance / founder |
| Help center content | Founder | Customer success |
| Escalation final call | Founder | Founder |

**Ownership is intentionally centralized at the founder during beta.** Every support interaction in Phase 1 is a product research session — the founder needs direct exposure to user problems before delegating to a team.

---

## 6. SLAs (Phase 2 Public Launch)

| Tier | Channel | First Response | Resolution Target |
|------|---------|---------------|-------------------|
| Planner — Agency | Dedicated Slack | < 2 hours | < 24 hours |
| Planner — Professional | Email / in-app chat | < 4 hours | < 48 hours |
| Couple — Premium | Email / in-app chat | < 4 hours | < 48 hours |
| Couple — Standard | Email | < 24 hours | < 72 hours |

Platform outage (app inaccessible or error rate > 20%): first communication within 1 hour regardless of tier.

---

## 7. Feedback Loop to Product

Support is a product intelligence channel — not just a cost center. Every support interaction should feed back into the product:

| Support Signal | Product Action |
|---------------|----------------|
| AI accuracy complaint (confirmed) | Log as eval failure; schedule targeted eval run on affected module |
| Feature request mentioned ≥ 3 times in one month | Add to product backlog for prioritization |
| User confusion about a specific UI element (≥ 3 tickets) | Add in-app tooltip or improve onboarding for that element |
| Scanned PDF complaint | Reinforces priority of OCR feature (V2 roadmap) |
| Obligation tracker state lost on refresh | Confirms obligation persistence as a priority fix (see TODOs) |

Monthly support review: founder reviews all tickets, identifies top 3 recurring issues, maps to product or prompt actions.

---

## 8. Feedback Gathering

### Active Channels
| Channel | Signal Type | When |
|---------|------------|------|
| Post-contract analysis rating (in-app) | AI quality — accuracy rating (1–5) + open text | After every contract analysis |
| Thumbs up/down on individual flags | Flag-level accuracy signal | Inline in contract summary |
| Beta planner WhatsApp/Slack group | Qualitative — friction, missing features, confusion | Ongoing during Phase 1 |
| User interviews (pre-launch) | Deep qualitative — jobs to be done, workflow gaps | ≥ 3 planners + 3 couples before MVP submission |
| Support tickets | Bug reports, confusion, feature requests | Post-launch |
| Monthly NPS survey (V1 launch) | Satisfaction and referral intent | Monthly, starting Month 2 post-launch |

### Passive Signals
| Signal | What It Indicates |
|--------|------------------|
| High edit rate on AI-generated response drafts | Module C tone or clause specificity is off |
| Low contract analysis completion rate (upload but no analysis) | Friction in upload flow or PDF extraction failing silently |
| Obligation tracker not used after contract signed | Feature discoverability issue or trust gap |
| Short session times after first contract | Onboarding not converting to ongoing use |

---

## 9. Bug Triage — Severity Classification

All bugs and feedback items are assigned a priority level at intake.

| Priority | Definition | Examples |
|----------|-----------|---------|
| **P0 — Critical** | Platform broken or user data at risk. Requires immediate fix regardless of time. | App inaccessible, AI returning wrong contract data for the wrong user, data breach, edge function down for all users |
| **P1 — High** | Core feature broken for a significant portion of users. Workaround may exist but is unacceptable. | Contract analysis failing for all text PDFs, response drafting returning empty, obligations not populating after analysis |
| **P2 — Medium** | Feature degraded or confusing but workaround exists. Users can continue core workflow. | Obligation check-off state not persisted (current known issue), scanned PDF not giving clear error message, style profile not applying consistently |
| **P3 — Low** | Polish, nice-to-have, or edge case with minimal user impact. | Copy improvements, minor UI alignment issues, non-critical missing tooltips |

### Triage Owner
- **Beta (Phase 1):** Founder triages all incoming issues within 24 hours
- **V1 launch:** Weekly triage meeting; founder + customer success; bugs logged in Linear (or GitHub Issues)

---

## 10. Acting on Feedback and Bugs

### Resolution Targets by Priority

| Priority | Fix Target | Communication |
|----------|-----------|---------------|
| P0 | Same day — drop everything | Notify affected users within 1 hour; post status update when resolved |
| P1 | Within 1 week (beta); within 72 hours (V1 launch) | Acknowledge within 4 hours; communicate fix timeline |
| P2 | Next planned release cycle | Acknowledge within 24 hours; add to backlog |
| P3 | Backlog — prioritized by frequency | No individual acknowledgment needed; batch in release notes |

### AI-Specific Bug Handling
AI accuracy issues follow a different path from standard bugs — they require an eval run, not just a code fix:

1. User reports AI inaccuracy (wrong flag rating, missed clause, hallucinated term)
2. Founder reviews the specific contract output manually
3. If confirmed: log as eval failure, identify which benchmark was violated, determine root cause (prompt gap vs. model behavior)
4. If prompt gap: update master prompt, run full eval on affected modules before deploying
5. If model behavior: add to golden test set as a known edge case; monitor for recurrence
6. Communicate fix to user once deployed

**Rule:** No AI accuracy fix ships without running the affected module's eval suite first. A code-only fix that skips evals risks introducing a new regression while fixing the reported issue.

### Feedback-to-Product Pipeline
| Frequency | What | Output |
|-----------|------|--------|
| Weekly (beta) | Review all feedback from beta planners | Top 3 friction points identified; P0/P1 bugs fixed; product backlog updated |
| Monthly (post-launch) | Full support ticket review + NPS responses | Recurring themes mapped to roadmap items; prompt improvements scheduled |
| Quarterly | Aggregate trend analysis | Informs V2 planning priorities |

---

## 11. Critical Issue Communication

### Internal (Solo / Small Team)
During beta, the founder is the only internal stakeholder. No internal communication protocol needed beyond maintaining a running issue log.

### External — Communicating to Users

**P0 — Platform outage or data incident:**
- First communication within **1 hour** of identifying the issue
- Message: what is affected, what is not affected, estimated resolution time
- Channel: direct message to all active users via email or WhatsApp/Slack group
- Follow-up: resolution confirmation when fixed; brief post-mortem if outage > 2 hours

**P0 — AI accuracy issue (wrong output shipped to users):**
- Acknowledge within **24 hours** of confirmation
- Message: what the issue was, which contract analyses may have been affected, what to do (re-run or contact support)
- Do not minimize — trust is the product's core asset

**P1 — Feature degraded:**
- Acknowledge within **4 hours** if user-reported
- Message: issue confirmed, fix in progress, workaround if available
- Resolution update when shipped

**Ongoing beta communication:**
- Weekly update email to beta planners: what shipped, what broke and was fixed, what's coming next
- Tone: transparent and direct — beta users signed up to help shape the product, not to receive a polished PR message

### Status Page (V1 Launch)
Before public launch, set up a simple status page (e.g., Statuspage.io or a hosted status page) covering:
- Shaadi AI app (uptime)
- Supabase (database + auth)
- AI contract analysis (edge function)
- Response drafting (edge function)

Link the status page from the login screen and help center so users can self-diagnose before contacting support.
