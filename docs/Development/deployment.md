# Shaadi AI — Deployment & Launch Rollout Plan

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada

---

## 1. Launch Approach

**Phased pilot — not A/B test, not all-users.**

A/B testing is not appropriate at this stage — the user base is too small and the product too early to generate statistically significant results. An all-users launch skips the feedback loop needed before charging real money.

The launch follows a controlled phased rollout seeded through Indian wedding planners in the top 5 North American diaspora metros: Greater Toronto, New York, Bay Area, Chicago, and Houston.

**Why planners first:** One planner brings 10–30 couples per year. Seeding through planners builds the network effect before opening direct couple acquisition — lower CAC, higher trust, faster referral growth.

---

## 2. Who Gets Access and When

### Phase 0 — Capstone Prototype (June 2026)
- **Who:** Evaluators and demo audience only
- **What's live:** AI Contract Intelligence Suite (contract upload, summary, flags, response drafting, obligation extraction)
- **What's mocked:** Budget tracker, guest list, vendor outreach, events dashboard
- **Purpose:** Validate the core AI feature and demonstrate product thinking to Product Faculty judges

### Phase 1 — Private Beta (June–July 2026)
- **Who:** 20 Indian wedding planners, invited directly — Toronto, New York, Bay Area
- **Access:** Free 3-month trial in exchange for structured feedback
- **What's live:** Full feature set
- **Purpose:** Validate product-market fit with the primary persona before charging
- **Onboarding:** White-glove — includes migration support from Aisle Planner

### Phase 2 — Public Launch (July 2026)
- **Who:** All users — paid tiers go live
- **Sequence:** Planner tier opens first; couple tier follows once planner-led referral flywheel is established
- **Geography:** Toronto, New York, Bay Area only
- **Purpose:** First paying customers; MRR begins

### Phase 3 — Expansion (August–December 2026)
- **Who:** All users, expanded geography
- **What's new:** Chicago and Houston added; couple-direct acquisition activated
- **Purpose:** Scale acquisition; V2 planning begins (vendor directory, multilingual support)

---

## 3. Scale Readiness

### Current Infrastructure Capacity

| Component | Current Tier | Capacity | Sufficient For |
|-----------|-------------|----------|----------------|
| Anthropic API | Free/Default | 50 req/min, 40K tokens/min | Private beta (~200 analyses/month) |
| Supabase Edge Functions | Free | Auto-scaling, serverless | All phases — no config needed |
| Supabase Database | Free | 500MB storage, 2GB bandwidth/month | Private beta |
| Supabase Auth | Free | Unlimited users | All phases |

### Architecture Scaling Properties
- **Edge functions are serverless** — auto-scale with zero configuration. No action needed as volume grows.
- **Database scales vertically** — upgrade Supabase plan to increase storage, connections, and bandwidth.
- **Anthropic API scales by tier** — upgrade tier to unlock higher rate limits. No code changes required.
- **No rewrite needed to scale** — the serverless foundation handles growth through configuration upgrades, not architecture changes.

---

## 4. Monitoring

### Signal 1 — Anthropic Usage Dashboard
- **Location:** `console.anthropic.com` → Usage
- **What it shows:** Requests/minute, tokens/minute, monthly cost in real time
- **Leading signal:** If requests/minute approaches 40 of the 50 allowed, upgrade the API tier before hitting the limit

### Signal 2 — Supabase Edge Function Logs
- **Location:** Supabase dashboard → Edge Functions → select function → Logs
- **What it shows:** Every invocation — request body, response status, latency, errors, `console.error` output
- **Watch for:** Error rate rising above 5%, latency on `analyze-contract` exceeding 30 seconds consistently

### Signal 3 — Supabase Database Dashboard
- **Location:** Supabase dashboard → Database → Reports
- **What it shows:** Active connections, query volume, storage used, bandwidth consumed
- **Watch for:** Storage approaching 400MB (free plan limit is 500MB), bandwidth approaching 1.5GB/month

### Pre-Demo Smoke Test (run before every demo or presentation)
1. Open Supabase dashboard → Edge Functions → `analyze-contract` → Logs
2. Upload a real contract through the app UI
3. Confirm a clean log entry with no errors and latency under 60 seconds
4. Check Anthropic usage dashboard to confirm the call registered

---

## 5. Scale-Up Triggers and Actions

| Signal | Threshold | Action | Cost |
|--------|-----------|--------|------|
| Anthropic requests approaching rate limit | > 40 req/min sustained | Upgrade to Anthropic Tier 1 (paid) — unlocks 2,000 req/min | Usage-based |
| Monthly Anthropic cost exceeding projections | > $100/month | Audit prompt token usage; consider caching common clause benchmarks | No cost |
| Supabase storage approaching limit | > 400MB | Upgrade to Supabase Pro | $25/month |
| Edge function error rate rising | > 5% of invocations | Add retry logic with exponential backoff for 429/529 errors | Engineering time |
| Contract analysis latency degrading | > 45 seconds consistently | Split combined module call into async processing with webhook callback | Engineering time |
| Concurrent users causing DB connection errors | > 80% of connection pool used | Upgrade Supabase plan; enable connection pooling via PgBouncer | Plan cost |

---

## 6. Pre-Launch Checklist (Before Phase 2 Public Launch)

### Infrastructure
- [ ] Upgrade Anthropic API to paid tier (Tier 1 minimum)
- [ ] Upgrade Supabase to Pro plan ($25/month)
- [ ] Add retry logic with exponential backoff to both edge functions for 429/529 errors
- [ ] Set Anthropic monthly spend cap appropriate for projected volume
- [ ] Export and verify database backup before launch

### Monitoring
- [ ] Confirm Supabase edge function logs are active and accessible
- [ ] Set up Anthropic usage alert at 70% of monthly spend cap
- [ ] Run full smoke test on `analyze-contract` and `draft-response` edge functions
- [ ] Verify fallback demo data renders correctly if edge function fails

### Product
- [ ] Legal disclaimer visible on all contract summary outputs
- [ ] Privacy policy and terms of service live
- [ ] Paid subscription processing active (all 4 tiers)
- [ ] Support runbook documented for common failure modes (scanned PDF, API timeout, auth issues)
- [ ] Obligation persistence wired to Supabase database (currently UI-only)

---

## 7. Known Gaps — V1 Pre-Launch Items

These are not blocking for the capstone but must be resolved before public launch:

- No per-user rate limiting on edge functions
- No automated alerting (e.g., Slack webhook on error spike, spend threshold alert)
- No retry logic with exponential backoff for Anthropic 429/529 errors
- Obligation check-off state not persisted to database (UI-only)
- No blue/green deployment — rollback requires git revert and manual redeploy
- Monitoring is manual (log inspection) rather than automated dashboards

---

## 8. Internal Communication — Launch Plans, Progress, and Outcomes

### Capstone (Current — Solo Project)
There are no internal teams. Communication is:
- **This repository** (`varun12/Wedding-Planning`) — single source of truth for all product decisions, architecture, and build status
- **CLAUDE.md** — onboarding doc that keeps Claude Code and the builder aligned across sessions
- **`docs/`** — all PM artifacts, decisions, and Q&A answers saved here for continuity
- **Capstone submission** — the external deliverable that communicates progress and outcomes to Product Faculty evaluators

### Phase 1 Private Beta (20 planners)
Solo founder communication model:
- **Weekly email update** to beta planners — what shipped, what's being fixed, what's coming next. Short (< 200 words). Builds trust and keeps users engaged during beta.
- **Feedback form** after each contract analysis — 2 questions: accuracy rating + one open field. Responses tracked in a shared sheet.
- **Direct Slack or WhatsApp channel** with beta planners — fast feedback loop, bug reports, and feature requests surface immediately.

### Phase 2 Public Launch and Beyond
As the team grows, communication formalizes:

| Audience | Channel | Cadence | Content |
|----------|---------|---------|---------|
| Early planner users | Email newsletter | Weekly | New features, tips, market insights |
| Beta feedback cohort | Dedicated Slack/WhatsApp | Ongoing | Direct conversation, bug reports |
| Investors / advisors | Metrics dashboard or email update | Monthly | MRR, active accounts, NPS, contracts reviewed |
| Internal team (when hired) | Linear (issues) + Notion (docs) or equivalent | Daily standup + weekly review | Sprint progress, launch readiness, incident reports |
| Public / community | Instagram, Reddit, blog | As shipped | Feature announcements, product stories |

### Key Metrics to Communicate at Launch
At each phase gate, report on:
1. **Adoption:** Planner accounts activated, contracts reviewed in first session
2. **Quality:** AI accuracy rating, flag helpfulness thumbs-up rate
3. **Revenue:** MRR, free-to-paid conversion rate
4. **Reliability:** Edge function error rate, average contract analysis latency
5. **Feedback:** Top 3 requested features from beta cohort
