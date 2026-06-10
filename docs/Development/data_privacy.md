# Shaadi AI — Data Handling, Privacy & Compliance

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada

---

## 1. What Data Is Stored and Where

| Data Type | Storage Location | Sensitivity |
|-----------|-----------------|-------------|
| User accounts (email, name, role) | Supabase Auth | Medium |
| Wedding details (names, dates, budget) | Supabase Postgres (`weddings` table) | Medium |
| Vendor contracts (PDF files) | Supabase Storage (private bucket) | High |
| Contract analysis (AI output, flags, risk score) | Supabase Postgres (`contracts.analysis` JSONB column) | High |
| Payment obligations (amounts, due dates) | Supabase Postgres (`obligations` table) | High |
| Guest list (names, contact info, event tags) | Supabase Postgres (`guests` table) | Medium |
| Budget items and vendor spend | Supabase Postgres (`budget_items` table) | High |
| Vendor contact details | Supabase Postgres (`vendors` table) | Medium |
| Planner style profile (sample emails, tone) | Supabase Postgres (`style_profiles` table) | Medium |
| Outreach message drafts | Supabase Postgres (`outreach_messages` table) | Medium |

---

## 2. Data Access Control

### Row-Level Security (RLS)
RLS is enabled on all 11 database tables. Every query is filtered at the database level — a user cannot read or write data for a wedding they are not a member of, regardless of what the application layer does.

**Enforcement mechanism:** `is_wedding_member(user_id, wedding_id)` — a Postgres security-definer function that checks the `wedding_members` table before allowing any operation. Used in RLS policies on all tables.

### Role-Based Access
Three roles enforced at both the application and database level:

| Role | Access |
|------|--------|
| `planner` | Full coordination view — all contract details, vendor management, budget controls, guest list |
| `couple` | Status dashboard — event progress, budget summary, vendor confirmations, guest counts |
| `parent` | Read-only budget summary and event status only — no contract or vendor details |

### API Keys and Secrets
- `ANTHROPIC_API_KEY` stored as a Supabase Edge Function secret — never in code, never in `.env`, never committed to GitHub
- Supabase anon/publishable key is safe to expose in frontend (enforced by RLS — it cannot bypass row-level access controls)
- Supabase service role key is never used in client-side code

---

## 3. Encryption

| Layer | Standard | Managed By |
|-------|----------|-----------|
| Data in transit | TLS 1.3 | Supabase platform |
| Data at rest | AES-256 | Supabase platform |
| Contract PDFs in storage | AES-256 | Supabase Storage |
| Edge function secrets | Encrypted at rest | Supabase Vault |

---

## 4. Third-Party Data Handling

### Anthropic API (Claude)
- Contract text is sent to the Anthropic API for processing during the analysis call
- Anthropic's API usage policy: API inputs and outputs are **not used to train models** by default for API customers
- Contract content is not stored by Anthropic beyond the processing session
- Reference: Anthropic Privacy Policy and API Usage Policy (`anthropic.com/privacy`)

### Supabase
- All user data stored in Supabase's managed Postgres infrastructure
- Supabase is SOC 2 Type II certified
- Data residency: US East (AWS us-east-1) by default — configurable per project
- Reference: Supabase Security (`supabase.com/security`)

---

## 5. Privacy by Design

- **Minimum data collection:** Only data required for wedding planning features is collected. No behavioral tracking, ad targeting, or data selling.
- **Wedding isolation:** Each wedding is a data silo. A planner with multiple weddings cannot cross-reference guest or vendor data between clients.
- **Parent access scoping:** Parents see budget summaries only. Vendor contracts (which contain pricing, negotiation history, and legal terms) are never exposed to parent-role users.
- **Couple contract visibility:** Couples see contract summaries and flags. Full contract PDFs are accessible but planner controls dashboard visibility settings.
- **AI disclaimer on all outputs:** Every contract summary includes: *"This analysis is for informational purposes only and is not legal advice. Have a qualified attorney review any contract before signing."*

---

## 6. Compliance

### Current Status (Capstone / Pre-Launch)

| Requirement | Status | Notes |
|-------------|--------|-------|
| RLS on all tables | Done | Enforced at database level |
| Role-based access control | Done | planner / couple / parent |
| Encrypted storage and transit | Done | Supabase platform guarantee |
| API key security | Done | Stored in Supabase Vault secrets |
| Legal disclaimer on AI outputs | Done | In edge function system prompt and UI |
| Privacy policy | Not built | Required before public launch |
| Terms of service | Not built | Required before public launch |
| GDPR data export (right to access) | Not built | V1 pre-launch requirement |
| GDPR data deletion (right to erasure) | Not built | V1 pre-launch requirement |
| CCPA compliance | Not built | V1 pre-launch requirement |
| Cookie consent / tracking disclosure | Not built | Required if any analytics added |

### GDPR / CCPA — V1 Pre-Launch Requirements
Before public launch, the following must be implemented:
1. **Data export:** User can request and download all their data (wedding details, contracts, guests, budget) in a portable format (JSON or CSV)
2. **Data deletion:** User can permanently delete their account and all associated data — including contract PDFs from Supabase Storage
3. **Privacy policy:** Published at `/privacy` — covers data collected, how it's used, third-party processors (Anthropic, Supabase), retention periods, and user rights
4. **Terms of service:** Published at `/terms` — covers AI disclaimer, liability limitations, acceptable use, and subscription terms

---

## 7. Data Retention

| Data Type | Retention Policy | Current Implementation |
|-----------|-----------------|----------------------|
| Active user data | Retained while subscription is active | Supabase default — no explicit policy set |
| Contract PDFs | Retained for duration of subscription | Supabase Storage — no auto-expiry configured |
| Contract analysis output | Retained for duration of subscription | Stored in `contracts.analysis` JSONB column |
| Deleted account data | Should be purged immediately | Not implemented — V1 pre-launch item |

---

## 8. Security Incident Response (Basic)

For the capstone and private beta, the incident response procedure is:

1. **API key compromised:** Rotate `ANTHROPIC_API_KEY` immediately in Supabase secrets. Revoke old key in Anthropic console. Notify affected users if contract data was accessed.
2. **Database breach:** Disable Supabase project immediately. Notify affected users within 72 hours (GDPR requirement). Restore from most recent backup. Investigate via Supabase audit logs.
3. **Unauthorized data access:** Review Supabase Auth logs and RLS policy audit logs to determine scope. Patch the access vector. Notify affected users.

Full incident response runbook is a V1 pre-launch item.
