# Shaadi AI — Content Moderation, Legal, Audit & Regulatory Compliance

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada

---

## 1. Content Moderation

### Current State
Shaadi AI processes vendor contracts (legal/financial documents) and generates structured AI outputs. User-generated content is limited to: contract PDF uploads, vendor names, form inputs, and pasted contract text. This is professional B2B content — not social content — so traditional content moderation (hate speech, NSFW) is not a primary risk.

### What Is In Place
- **Claude's built-in safety guardrails:** The Anthropic API applies Anthropic's usage policies to all API calls. Claude will not generate harmful, illegal, or abusive content regardless of prompt inputs.
- **Input validation:** Both edge functions validate required fields and reject malformed requests with a 400 error before calling the AI.
- **AI disclaimer on all contract outputs:** Every contract summary includes a legal disclaimer — implemented in both the edge function system prompt and the UI.
- **Structured output format:** The system prompt instructs Claude to return only valid JSON — this constrains the output to the expected schema and prevents unstructured or harmful text from surfacing in the UI.

### What Is Not In Place
- No explicit content policy for uploaded documents (e.g., what happens if a non-contract PDF is uploaded)
- No abuse detection or rate limiting per user account
- No moderation for the paste-text input field

### V1 Pre-Launch Items
- Add minimum content length and file type validation before sending to AI
- Define and publish an acceptable use policy covering what contract types the platform is designed for
- Add per-user rate limiting on edge function invocations to prevent abuse

---

## 2. Legal

### AI Disclaimer — Implemented
Every contract analysis output includes:
*"This analysis is for informational purposes only and is not legal advice. Have a qualified attorney review any contract before signing."*

This disclaimer is enforced at two levels:
1. In the `analyze-contract` edge function system prompt — Claude is instructed to always include it in the JSON output
2. In the `ContractSummary.tsx` UI component — displayed visibly below every analysis

### Legal Documents — Not Yet Built
| Document | Status | Required By |
|----------|--------|-------------|
| Privacy Policy | Not built | Before public launch |
| Terms of Service | Not built | Before public launch |
| AI disclaimer legal review | Not done | Before public launch |
| Data Processing Agreement (for planners) | Not built | GDPR / PIPEDA requirement |
| Cookie / tracking consent | Not applicable yet | Required if analytics added |

### Legal Risk — AI Contract Analysis
The primary legal risk is that users treat AI-generated contract summaries as legal advice. Mitigations in place:
- Explicit "not legal advice" disclaimer on every output
- "Verify with a professional" language in the FAQ and onboarding guides
- AI outputs are positioned as a first-pass review aid, not a replacement for legal counsel

Before V1 launch, the disclaimer language should be reviewed by a qualified attorney to ensure it provides adequate protection under applicable law in target jurisdictions (Ontario, New York, California).

---

## 3. Audit

### What Is Logged Today
| Event | Log Location | Retention |
|-------|-------------|-----------|
| Edge function invocations (analyze-contract, draft-response) | Supabase Edge Function Logs | 7 days (Supabase free plan) |
| Authentication events (sign in, sign up, password reset) | Supabase Auth Logs | 7 days |
| Database queries (if enabled) | Supabase Postgres Logs | 7 days |
| API usage and cost | Anthropic Usage Dashboard | 30 days |

### What Is Not Logged
- No application-level audit trail (who viewed which contract, when)
- No record of when AI summaries were shared or forwarded
- No immutable audit log for compliance purposes
- Log retention is 7 days on the free Supabase plan — too short for compliance

### V1 Pre-Launch Audit Requirements
- Upgrade Supabase to Pro plan — extends log retention to 30 days minimum
- Implement application-level audit log table in Postgres: record contract uploads, analyses run, obligations marked complete, and user access events with timestamps
- Define log retention policy: minimum 90 days for user action logs, 1 year for contract analysis records

---

## 4. Regulatory Compliance

### Target Market Jurisdictions
Shaadi AI's primary markets are Ontario (Canada), New York, California, Illinois, and Texas. Each has distinct privacy and data handling requirements.

### Compliance Status by Regulation

| Regulation | Jurisdiction | Applies | Status | Notes |
|------------|-------------|---------|--------|-------|
| PIPEDA (Personal Information Protection and Electronic Documents Act) | Canada (Ontario) | Yes — Toronto is primary market | Partial | RLS and encryption in place; privacy policy, consent flows, and data access rights not yet built |
| CCPA (California Consumer Privacy Act) | California | Yes — Bay Area is target market | Not built | Requires privacy policy, opt-out of data sale (N/A — we don't sell data), and data deletion on request |
| GDPR (General Data Protection Regulation) | EU / UK | Indirect — UK diaspora community | Partial | Encryption and access controls in place; lawful basis for processing, data subject rights, and DPA not yet documented |
| CAN-SPAM | US | Yes — email communications | Partial | Applies to beta outreach emails; unsubscribe mechanism needed |
| CASL (Canada's Anti-Spam Legislation) | Canada | Yes | Not built | Requires express consent before commercial email; applies to planner outreach campaign |
| EU AI Act | EU | Indirect | Monitor | High-risk AI classification unlikely for contract review tool; monitor as regulation matures |
| State AI transparency laws (US) | Various | Emerging | Monitor | Colorado, Texas, and others passing AI disclosure laws; AI disclaimer partially addresses this |

### Domain-Specific Considerations

**Unauthorized Practice of Law (UPL):**
The most significant domain-specific legal risk. Providing contract analysis that a user relies on as legal advice could be construed as unauthorized practice of law in some jurisdictions. Current mitigations:
- Explicit "not legal advice" disclaimer on every output
- Platform positioned as a comprehension and organization tool, not a legal service
- No attorney-client relationship is created or implied
- V1 requirement: attorney review of disclaimer language and product framing before launch

**Financial Data Handling:**
Vendor contracts contain payment terms, deposit amounts, and pricing — sensitive financial information. Current protections: RLS restricts access to wedding members only; data encrypted at rest and in transit. No payment processing occurs on the platform.

**Personal Information in Contracts:**
Uploaded contracts may contain personal information about vendors, venue staff, and third parties who have not consented to upload. This is a gray area under PIPEDA and GDPR. Mitigation: terms of service should clarify user responsibility for what they upload; platform processes but does not re-use or share contract content.

---

## 5. Compliance Roadmap

### Before Private Beta (Phase 1 — June 2026)
- [ ] Attorney review of AI disclaimer language
- [ ] Basic terms of service covering AI disclaimer, acceptable use, and liability
- [ ] CASL-compliant consent for planner outreach emails

### Before Public Launch (Phase 2 — July 2026)
- [ ] Privacy policy covering PIPEDA, CCPA, and GDPR obligations
- [ ] GDPR/CCPA data export and deletion flows implemented
- [ ] Data Processing Agreement template for planner tier (covers their clients' data)
- [ ] Application-level audit log implemented
- [ ] Log retention extended to minimum 90 days
- [ ] Cookie/tracking consent if any analytics tool added
- [ ] Per-user rate limiting on edge functions

### V2 and Beyond
- [ ] SOC 2 Type II audit (when revenue justifies it)
- [ ] Formal GDPR Data Protection Impact Assessment (DPIA)
- [ ] EU AI Act compliance assessment
- [ ] Dedicated security and compliance review cadence (annual)
