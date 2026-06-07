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

## 7. Known Gaps (V1 Pre-Launch Items)

- No per-user rate limiting on edge functions
- No automated alerting (e.g., PagerDuty, Slack webhook on error spike)
- No retry logic with exponential backoff for Anthropic 429/529 errors
- Obligation check-off state not persisted to database (UI-only)
- Monitoring is manual (log inspection) rather than automated dashboards
