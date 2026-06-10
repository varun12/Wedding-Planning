# Shaadi AI — Infrastructure Documentation

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada

---

## 1. APIs

| API | Purpose | Auth |
|-----|---------|------|
| Anthropic API (`claude-sonnet-4-6`) | Contract analysis, response drafting | `ANTHROPIC_API_KEY` stored as Supabase Edge Function secret |
| Supabase API | Database, auth, storage, edge function invocation | Anon/publishable key in frontend `.env`; service role key never exposed |

**Confirmed working:** Both edge functions (`analyze-contract`, `draft-response`) successfully call the Anthropic API and return structured responses as of June 7, 2026.

---

## 2. Rate Limits

### Anthropic API
| Limit | Value | Notes |
|-------|-------|-------|
| Requests/minute | 50 | Free/default tier |
| Tokens/minute | 40,000 | Sufficient for demo volume |
| Per-call cost | ~$0.02–0.04 (analysis), ~$0.005 (draft) | At claude-sonnet-4-6 pricing |

**Spend cap:** Set a monthly limit in Anthropic console → Settings → Limits. Recommended: $25–50 for capstone demo.

### Supabase Edge Functions
- Default timeout: 150 seconds per invocation
- No per-user throttling configured — noted as V1 pre-launch item

---

## 3. Error Handling

Both edge functions implement:
- Input validation (400 on missing fields)
- `ANTHROPIC_API_KEY` presence check (throws descriptive error if missing)
- `if (!response.ok)` check on Anthropic API call with status + body captured
- `try/catch` with `console.error` — all errors logged automatically to Supabase edge function logs
- Frontend fallback: demo data rendered if edge function returns an error, so the UI never shows a blank state

---

## 4. Monitoring

### Supabase Edge Function Logs (built-in)
Every invocation of `analyze-contract` and `draft-response` is logged automatically.

**To view logs:**
1. Go to Supabase dashboard → Edge Functions
2. Select `analyze-contract` or `draft-response`
3. Click the **Logs** tab
4. Each entry shows: timestamp, request body, response status, errors, and `console.error` output

**Pre-demo smoke test:** Run one contract analysis through the UI, then verify a clean log entry with no errors in the Supabase logs.

### Anthropic Usage Dashboard
Real-time token usage and cost tracking available at:
`console.anthropic.com` → Usage

Check this before and after the demo to confirm API calls are being made and costs are within expected range.

---

## 5. Rollback Procedures

### Edge Functions
Edge functions are deployed through Lovable (which syncs to the `shaadiai-capstone-builder` GitHub repo).

**To roll back an edge function:**
1. Identify the last known-good commit in `shaadiai-capstone-builder`
2. In Lovable chat: *"Revert `supabase/functions/analyze-contract/index.ts` to the version from commit [SHA]"*
3. Lovable redeploys automatically on file save
4. Verify in Supabase logs that the next invocation succeeds

**Alternative (CLI):** If you have Supabase CLI access to the project:
```bash
supabase functions deploy analyze-contract --project-ref hadobvoqiwnaacdijsal
```

### Database Migrations
Supabase applies migrations sequentially. To roll back a bad migration:
1. Go to Supabase dashboard → Database → Migrations
2. Identify the migration to revert
3. Run the inverse SQL manually via the SQL editor (drop the table/column added)
4. Remove the migration file from `supabase/migrations/` and push

**Backup:** Supabase takes automatic daily backups on paid plans. On the free plan, export schema manually before any migration:
- Supabase dashboard → Settings → Database → Download backup

### API Key Rotation
If `ANTHROPIC_API_KEY` is compromised:
1. Go to `console.anthropic.com` → API Keys → Create new key
2. Go to Supabase dashboard → Edge Functions → Secrets
3. Update `ANTHROPIC_API_KEY` value with the new key
4. Delete the old key in Anthropic console
5. Verify next edge function invocation succeeds in logs

---

## 6. Cost Controls

| Control | Location | Recommended Value |
|---------|----------|-------------------|
| Monthly spend cap | Anthropic console → Settings → Limits | $25–50 for capstone |
| Per-tier usage limits | App tier logic (V1 item) | 10 analyses/month (Standard), unlimited (Premium) |

---

## 7. Post-Launch Monitoring — Operational and AI Issues

### 7.1 Operational Monitoring

#### What to watch and where

| Signal | Location | Check Frequency | Alert Threshold |
|--------|----------|----------------|-----------------|
| Edge function error rate | Supabase → Edge Functions → Logs | Daily during beta; automated post-launch | > 5% of invocations erroring |
| Edge function latency | Supabase → Edge Functions → Logs | Weekly | `analyze-contract` consistently > 45 seconds |
| Anthropic API error codes | Supabase logs (`console.error` output) | Daily | Any 429 (rate limit) or 529 (overloaded) appearing |
| Monthly API cost | Anthropic console → Usage | Weekly | Approaching 70% of monthly spend cap |
| Database storage | Supabase → Settings → Database | Monthly | > 400MB (free plan limit: 500MB) |
| Auth failures | Supabase → Auth → Logs | Weekly | Spike in failed sign-ins (potential abuse) |

#### Reading the Supabase edge function logs
Each log entry contains:
- **Timestamp** — when the invocation happened
- **Status** — 200 (success), 400 (bad request), 500 (server error)
- **Duration** — how long the function took in ms
- **console.error output** — any caught errors with their message and stack

**What a healthy log looks like:**
```
Status: 200 | Duration: 18,432ms | No errors
```

**What an unhealthy log looks like:**
```
Status: 500 | Duration: 3,241ms
Error: Anthropic API error [429]: Rate limit exceeded
```

**Common error patterns and their meaning:**

| Error in Logs | Meaning | Action |
|--------------|---------|--------|
| `ANTHROPIC_API_KEY not configured` | Secret not set or wrong name | Re-add secret in Supabase → Edge Functions → Secrets |
| `Anthropic API error [429]` | Rate limit hit | Add retry logic; upgrade Anthropic tier if sustained |
| `Anthropic API error [529]` | Anthropic overloaded | Transient — add retry logic with backoff |
| `JSON.parse failed` | Claude returned non-JSON output | Check system prompt; add code fence stripping |
| `Missing required fields` | Frontend sending incomplete request body | Check frontend form validation |
| `FetchError: connection refused` | Supabase can't reach Anthropic | Check Anthropic status page; likely transient |

---

### 7.2 AI Quality Monitoring

Operational logs tell you if the system is running. They do not tell you if the AI is producing accurate outputs. AI quality monitoring requires a separate set of signals.

#### In-product quality signals (passive)
These surface without any user action:

| Signal | Where It Comes From | What It Indicates |
|--------|--------------------|--------------------|
| Contract summary star rating < 3.5 average (rolling 7-day) | In-app rating after each analysis | Module A or B accuracy degrading |
| Flag thumbs-down rate > 25% (rolling 7-day) | Per-flag rating in contract summary | Module B flag accuracy off |
| Response draft edit rate > 60% | Tracked when user edits before copying | Module C tone or specificity off |
| Obligation tracker empty after analysis (> 20% of analyses) | Obligation count = 0 in DB after contract marked signed | Module D extraction failing silently |

#### User-reported quality signals (active)
- Support tickets mentioning "missed clause", "wrong flag", "incorrect date"
- Beta planner WhatsApp/Slack messages about specific outputs
- Post-analysis open-text feedback naming a specific issue

#### Scheduled eval runs (see `docs/Design/evals.md`)
The formal quality check — run against the golden test set:
- Weekly during beta: Modules A and B
- Monthly post-launch: full suite (all 8 modules)
- Immediately on any prompt change or Claude model upgrade

#### How to distinguish operational failure from AI quality failure

| Symptom | Operational Issue? | AI Quality Issue? | How to Tell |
|---------|-------------------|-------------------|-------------|
| Analysis returns error toast | Yes | No | Check Supabase logs for 500 status |
| Analysis completes but summary seems wrong | No | Yes | Check logs — if 200 status, output reached the user; run manual review |
| Analysis takes 90+ seconds | Yes (latency) | No | Check logs for duration; check Anthropic status |
| Flags seem consistently too lenient | No | Yes | Run Module B eval against golden test set |
| Draft email sounds nothing like the planner | No | Yes | Check style profile was set up; run Module C eval |

---

### 7.3 Alerting — Current State and V1 Plan

#### Current state (capstone / beta)
All monitoring is **manual** — log inspection triggered by user reports or scheduled checks. No automated alerts are configured.

**Manual monitoring schedule during beta:**
- Before every demo: run smoke test (one contract through the UI; verify clean log)
- Daily: scan Supabase edge function logs for 500 errors
- Weekly: check Anthropic usage dashboard for cost and rate limit proximity
- Weekly: review in-app feedback ratings

#### V1 Pre-Launch — Automated Alerting Setup
Before public launch, configure the following:

| Alert | Tool | Trigger | Channel |
|-------|------|---------|---------|
| Edge function error rate spike | Supabase webhooks → Slack | Error rate > 5% in a 1-hour window | Slack #alerts |
| Anthropic spend threshold | Anthropic console → email alert | 70% of monthly cap reached | Email to founder |
| Database storage warning | Supabase → email alert | > 400MB storage used | Email to founder |
| Anthropic API 429 errors | Log-based alert (custom) | Any 429 in a 15-min window | Slack #alerts |

Simple Slack webhook alerting can be configured in Supabase via database webhooks or a lightweight monitoring service (e.g., Better Uptime, UptimeRobot for availability; Grafana or Datadog for metrics at scale).

---

### 7.4 Post-Launch Monitoring Runbook

**Daily (first 30 days post-launch):**
1. Open Supabase → Edge Functions → `analyze-contract` → Logs
2. Filter by last 24 hours; check for any 500 errors
3. Open Anthropic console → Usage; confirm daily cost is within expected range
4. Check in-app feedback ratings dashboard; flag any < 3.5 average

**Weekly:**
1. Run Modules A and B eval against golden test set (5 contracts)
2. Review all support tickets from the week; triage any AI accuracy complaints
3. Check Supabase database storage and bandwidth usage
4. Review Anthropic usage trend — is cost growing proportionally with user growth?

**Monthly:**
1. Run full eval suite (all 8 modules) against golden test set
2. Review aggregate in-app quality ratings; compare to prior month
3. Review support ticket themes; map top 3 to product or prompt actions
4. Check if any new contracts should be added to the golden test set
5. Assess whether rate limits or plan upgrades are needed based on growth

---

## 8. Known Gaps (V1 Pre-Launch Items)

- No per-user rate limiting on edge functions
- No automated alerting (e.g., Slack webhook on error spike) — manual monitoring only until V1
- No retry logic with exponential backoff for Anthropic 429/529 errors
- Obligation check-off state not persisted to database (UI-only)
- No status page (planned before public launch)
- No application-level audit log for user actions (planned before public launch)
