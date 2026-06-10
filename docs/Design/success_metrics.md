# Shaadi AI — Success Metrics

**Version:** 1.0 | **Last updated:** June 2026 | **Author:** Varun Maryada
**Reference:** PRD v2.0 Section 4 (Goals & Success Metrics) — this doc reorganizes those metrics into a user vs. business framework for easier reference.

---

## North Star Metric

**Total contracts reviewed per month** — the single best proxy for value delivered across both personas. A reviewed contract means a user trusted the AI with a high-stakes document and acted on the output. Growth in this metric confirms adoption, trust, and product-market fit simultaneously.

---

## User Metrics — Indicate Success From the User's Perspective

### Activation (did the user experience the core value?)
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Contract review completed in first session | > 60% of new planner signups | If the primary feature isn't used on day one, the user never sees the value |
| Wedding setup completed within 48 hours of signup | > 70% of new accounts | Incomplete setup = no context for AI features to work correctly |
| Couple invited to dashboard within first week | > 80% of planner-created weddings | Measures whether the dual-user model is actually being used |

### Engagement (is the user getting ongoing value?)
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Contracts reviewed per active planner per month | > 5 | Planners manage 15–20 weddings/year — if they're only reviewing 1 contract/month, the tool isn't part of their workflow |
| Monthly active rate (planners) | > 80% | Wedding planning is continuous — low MAU means the platform isn't embedded in daily/weekly work |
| Response drafts generated per contract analysis | > 1 | Indicates users are acting on flags, not just reading the summary |

### Quality & Trust (does the AI output meet user expectations?)
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Contract summary star rating (1–5) | ≥ 4.2 average | Below 4.0 means users don't trust the output — the product's core value collapses |
| "Flag was helpful and accurate" thumbs-up rate | ≥ 75% of flags rated | Measures whether traffic light ratings align with user judgment |
| Support tickets citing AI inaccuracy | < 5% of total contract reviews | High inaccuracy rate is a trust-killer and a legal liability |
| "Would use this tool" score (interview) | ≥ 4.0 / 5.0 | Capstone validation metric — measures intent to adopt |

### Retention (do users keep coming back?)
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Planner 30-day retention | > 85% | Planners manage ongoing weddings — if they churn in 30 days, the tool doesn't fit the workflow |
| Planner 90-day retention | > 70% | 90-day retention is the clearest signal of genuine product-market fit |
| Couple 60-day retention | > 55% | Couples have a defined planning window (12–18 months) — 60-day retention confirms the platform is used throughout, not just at signup |

### Satisfaction
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Net Promoter Score (NPS) | > 50 | Indian weddings are a community event — NPS > 50 means users are actively referring Shaadi AI to other planners and couples |
| Referral links clicked per planner | Tracked | Leading indicator for NPS and organic acquisition |

---

## Business Metrics — Demonstrate Value to the Business

### Acquisition
| Metric | Target (Month 1–3) | Target (Month 6) | Why It Matters |
|--------|-------------------|-----------------|----------------|
| Active planner accounts | ≥ 15 by end of Month 1 | 50 | Planners are the beachhead — each one unlocks 10–30 couple relationships |
| Active couple accounts | ≥ 30 by end of Month 2 | 200 | Volume user base; long-term growth engine |
| % of signups from referrals | — | > 40% | Referral-driven growth confirms community word-of-mouth flywheel is working |
| Cost per planner acquisition (CAC) | < $200 | Improving | Direct outreach is high-touch; CAC must stay below LTV threshold |

### Revenue
| Metric | Target (Month 6) | Why It Matters |
|--------|-----------------|----------------|
| Monthly Recurring Revenue (MRR) | $17,750 | Primary business health signal |
| Annual Run Rate (ARR) | ~$213,000 | Investor-facing metric; validates monetization model |
| Free trial to paid conversion rate (planner) | ≥ 40% | Below 30% signals the paid product isn't meaningfully better than the free trial experience |
| Planner tier % of MRR | ~62% | Confirms planner is the highest-LTV segment — validates the planner-first GTM |
| Average Revenue Per User (ARPU) | $220 planner / $45 couple | Tracks tier mix and upsell trends |

### Unit Economics
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Planner LTV (estimated) | > $2,400 (12-month) | At $199/month with 85% 12-month retention — must exceed CAC by 5–10x |
| LTV / CAC ratio | > 10x | SaaS health benchmark — below 3x means the business model is broken |
| Gross margin | > 80% | SaaS target; API cost per contract analysis ($0.02–0.04) is small relative to subscription price |
| Monthly API cost per active planner | < $5 | At > 5 contracts/month per planner × $0.04/analysis — tracks AI cost efficiency |

### AI Quality (business impact)
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Contract summary accuracy vs. human review | > 90% | Below 90% creates legal liability and erodes the core trust proposition |
| Contract risk score alignment with human assessment | > 85% | Risk scores drive user decisions — misalignment destroys credibility |

---

## Leading vs. Lagging Indicator Map

| Leading Indicator | Lagging Indicator It Predicts |
|-------------------|------------------------------|
| Free trial → paid conversion rate | MRR growth |
| Contract reviews completed in first session | 30-day retention |
| Planner invites couple to dashboard | Couple account activation |
| AI quality rating per summary | NPS score |
| Referral links clicked per planner | % signups from referrals |
| Style profile setup completion | Vendor outreach feature adoption |
| Flags acted on (response drafted) | Engagement depth and session value |

---

## Capstone-Specific Success Criteria

These define success for the June 15, 2026 submission specifically:

| Criterion | Target |
|-----------|--------|
| End-to-end contract flow works without error in live demo | Yes |
| Contract summary generated in < 60 seconds | Yes |
| Response draft generated in < 10 seconds | Yes |
| Summary accuracy on test contracts | > 90% (human review of 3–5 contracts) |
| "Would use this tool" score from user interviews | ≥ 4.0 / 5.0 |
| Live demo completes without fallback to screenshots | Yes |
| PRD and supporting documents delivered on time | June 15, 2026 |
