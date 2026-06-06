# Shaadi AI — Model Selection Analysis

**Author:** Varun Maryada
**Version:** 1.0
**Date:** April 2026
**Purpose:** Evaluate AI models for the Shaadi AI platform and justify the selection for each task type

---

## How to Read This Document

The PRD specifies `claude-sonnet-4-6` as the primary model. This document evaluates whether that choice is correct — including honest assessment of where competing models are stronger. The recommendation is grounded in Shaadi AI's specific task requirements, not model loyalty.

---

## What the Model Needs to Do

Shaadi AI's AI layer runs 8 distinct task types across the platform. These place different demands on the model:

| Task | Primary Demand | Stakes |
|------|---------------|--------|
| Contract summary (Module A) | Long-document comprehension, structured JSON extraction | High — inaccuracy erodes trust |
| Clause flagging (Module B) | Legal reasoning, cultural norm benchmarking, consistent rating | Critical — missed RED flag = direct user harm |
| Response drafting (Module C) | Tone matching, style profile adherence, professional writing | High — planner sends this to clients |
| Obligation extraction (Module D) | Precise date math, structured extraction | High — wrong date = missed payment |
| Vendor outreach (Module E) | Style matching, formality adjustment by vendor type | Medium |
| Budget advisory (Module F) | Arithmetic reasoning, priority-weighted logic | Medium |
| Guest list import (Module G) | Unstructured text parsing, deduplication | Low-medium |
| Cultural setup interview (Module H) | Conversational flow, cultural knowledge depth | High — cultural errors break trust |

---

## Models Evaluated

Four model families are evaluated: Anthropic Claude, OpenAI GPT-4o, Google Gemini, and open-source models (Llama/Mistral).

---

## 1. Anthropic Claude (claude-sonnet-4-6 / claude-opus-4-6 / claude-haiku-4-5)

### Capabilities

**Context window:** 200K tokens — the largest of the frontier models evaluated. A 25-page wedding vendor contract with full system prompt and context block sits well within ~35K tokens. The 200K window means all components of a complex call (system prompt + user context + full contract) can be combined without truncation.

**Instruction following on structured prompts:** Claude consistently performs well on complex, multi-step instruction sets — particularly when the prompt specifies both output format *and* behavioral constraints simultaneously (e.g., "extract this clause, rate it, benchmark it against Indian wedding norms, and never fabricate a statistic, all in one JSON object"). Independent benchmarks (MMLU, BIG-Bench, LiveCodeBench) consistently place Claude Sonnet and Opus at or near the top for instruction adherence.

**Stylistic constraint following:** Claude's handling of negative constraints ("never use 'kindly'", "do not start sentences with 'I'") is strong. This directly serves the planner style profile feature in Modules C and E, where exact voice matching is the core value proposition.

**Calibrated uncertainty:** Claude tends to express uncertainty explicitly rather than confidently generating incorrect output — which aligns directly with the PRD's §9.5 requirement that the system "flag uncertainty rather than generate confident but incorrect output."

**Cultural knowledge:** Claude has broad general knowledge of Indian wedding traditions. However, this knowledge is not validated against a curated dataset of Indian wedding vendor contracts and may be thinner for less common traditions (Tamil Hindu, Muslim, Gujarati) than for North Indian Hindu.

### Limitations

**No native schema enforcement:** Claude produces structured JSON via prompt instruction, not via an enforced schema mechanism. Well-crafted prompts achieve reliable JSON output, but there is no API-level guarantee of schema validity. This is the single most significant technical limitation relative to GPT-4o for the Make automation pipeline — a malformed JSON output breaks the workflow silently.

**Cost at scale:** Claude Sonnet is priced at approximately $3/M input tokens and $15/M output tokens (as of early 2026). A 25-page contract summary call generates ~20K input tokens. At 50 planner accounts × 5 contracts/month × 4 API calls per contract = 1,000 calls/month = ~20M input tokens/month. That's approximately $60/month in input tokens for contract tasks alone — manageable early but material at growth.

**No proprietary Indian wedding training data:** Like all models evaluated, Claude has not been fine-tuned on Indian wedding vendor contracts. The cultural intelligence in Shaadi AI comes from the prompt engineering layer, not from the model's innate knowledge. This is equally true of all competing models.

### Model Tier Assessment

| Variant | Best For | Trade-off |
|---------|---------|-----------|
| claude-opus-4-6 | Highest-stakes reasoning (Module B flagging, complex interfaith setup in Module H) | 2–3× more expensive than Sonnet; latency is higher |
| claude-sonnet-4-6 | Primary workhorse for all tasks | Best balance of capability, cost, and latency |
| claude-haiku-4-5 | Cost-optimized tasks where reasoning depth is less critical (Module G guest import) | Weaker at multi-step structured reasoning |

---

## 2. OpenAI GPT-4o

### Capabilities

**Structured outputs (JSON schema enforcement):** GPT-4o's Structured Outputs API enforces adherence to a defined JSON schema at the API level — the model cannot produce a response that violates the schema. For Shaadi AI's Make automation pipeline, where a malformed JSON silently breaks the workflow, this is a genuine technical advantage over Claude.

**Context window:** 128K tokens — sufficient for all Shaadi AI tasks, but smaller than Claude's 200K. In practice, a 25-page contract + system prompt + context block is approximately 30–35K tokens, well within the GPT-4o limit. This only becomes a constraint if contracts and conversation history are combined in the same call.

**Performance on structured extraction:** GPT-4o performs comparably to Claude Sonnet on legal document comprehension and structured extraction in independent evaluations. The gap between them on tasks like contract summarization is small and unlikely to be meaningful in production.

**Broad ecosystem:** OpenAI has the largest third-party integration ecosystem. The Make platform has a native, well-maintained OpenAI connector with JSON mode support built in — slightly more mature than the Anthropic Make connector.

**Cost:** GPT-4o is priced at approximately $2.50/M input tokens and $10/M output tokens — slightly lower than Claude Sonnet, which compounds meaningfully at the contract volume described above.

### Limitations

**Shorter context window:** 128K vs Claude's 200K. Not a constraint at current task scope, but relevant if future features (e.g., multi-contract analysis or longer conversation history) increase call size.

**Instruction following on stylistic constraints:** GPT-4o is strong at instruction following generally, but independent evaluations show slightly more variance on complex negative constraints (e.g., "never use these specific words") compared to Claude. For the style profile feature, this margin matters — a planner who sees a prohibited phrase in a client-facing email will not trust the tool.

**Less calibrated on uncertainty:** GPT-4o has a slightly stronger tendency to generate plausible-sounding but unverified content compared to Claude in ambiguous situations. For Module B's market norm benchmarks, this increases hallucination risk on the clause-specific benchmarks.

### Summary

GPT-4o is a legitimate alternative and the strongest competitor to Claude Sonnet for this use case. The structured outputs feature is its clearest advantage. The stylistic constraint handling and uncertainty calibration are where Claude edges ahead for Shaadi AI specifically.

---

## 3. Google Gemini (1.5 Pro / 2.0 Flash)

### Gemini 1.5 Pro

**Standout capability:** 1M token context window — far beyond what any other model offers. This is genuinely useful for future features (e.g., analyzing an entire wedding's worth of vendor contracts simultaneously) but is overkill for current V1 tasks.

**Structured extraction:** Competitive with Claude and GPT-4o on document extraction tasks in independent benchmarks.

**Limitations:**
- Instruction following on complex multi-step behavioral constraints is less consistent than Claude or GPT-4o in independent evaluations — this is the most critical gap for Shaadi AI's highly constrained style profile and cultural flagging prompts
- Hallucination rate on factual benchmarks is slightly higher than Claude and GPT-4o
- The Make connector for Gemini is less mature than the Anthropic and OpenAI connectors
- Google's API pricing and rate limits are less predictable for early-stage products compared to Anthropic and OpenAI

### Gemini 2.0 Flash

**Standout capability:** Cost. Gemini Flash is priced at approximately $0.075/M input tokens — 40× cheaper than Claude Sonnet. For low-stakes tasks where reasoning depth matters less (Module G guest list import), this is compelling.

**Limitations:**
- Significantly weaker than frontier models on complex reasoning tasks — not suitable for Modules A, B, or H where accuracy is critical
- Still less reliable on complex multi-constraint structured output than Claude or GPT-4o

**Assessment:** Gemini is not the right primary model for Shaadi AI. The instruction-following gap is too costly for a product where a single wrong cultural term or missed RED flag damages user trust. Gemini Flash is worth revisiting for cost-optimized low-stakes tasks at scale.

---

## 4. Open-Source Models (Llama 3.x, Mistral)

**Not recommended for V1.** The reason is not capability — Llama 3.1 405B and Mistral Large are competitive with frontier models on many benchmarks. The reason is operational fit.

The PRD specifies a no-code/low-code stack (Bubble + Make). Self-hosting a frontier open-source model requires GPU infrastructure, model serving, monitoring, and versioning — a significant engineering overhead that conflicts directly with the capstone build constraint. The cost advantage of self-hosting only materializes at scale that V1 won't reach.

Open-source models are worth re-evaluating at Series A scale if API costs become a significant margin pressure, particularly for high-volume lower-stakes tasks.

---

## Head-to-Head Comparison

| Criterion | Claude Sonnet 4.6 | GPT-4o | Gemini 1.5 Pro | Gemini 2.0 Flash |
|-----------|:-----------------:|:------:|:--------------:|:----------------:|
| Context window | 200K ✓✓ | 128K ✓ | 1M ✓✓✓ | 1M ✓✓✓ |
| Structured JSON (prompt-based) | Strong ✓✓ | Strong ✓✓ | Good ✓ | Moderate ~ |
| Schema-enforced JSON (API-level) | No ✗ | Yes ✓✓ | Partial ~ | Partial ~ |
| Instruction following (complex constraints) | Excellent ✓✓ | Very good ✓✓ | Good ✓ | Fair ~ |
| Stylistic constraint adherence | Excellent ✓✓ | Very good ✓ | Good ✓ | Fair ~ |
| Uncertainty calibration | Strong ✓✓ | Good ✓ | Moderate ~ | Weak ✗ |
| Cultural knowledge (Indian weddings) | Good ✓ | Good ✓ | Good ✓ | Fair ~ |
| Cost per M input tokens | $3.00 ~ | $2.50 ✓ | $1.25 ✓✓ | $0.075 ✓✓✓ |
| Make connector maturity | Good ✓ | Excellent ✓✓ | Developing ~ | Developing ~ |
| Suitable for high-stakes tasks (A, B, H) | Yes ✓✓ | Yes ✓✓ | Marginal ~ | No ✗ |
| Suitable for low-stakes tasks (G) | Yes (costly) | Yes (costly) | Yes ✓ | Yes ✓✓ |

---

## Recommendation

### Primary Model: claude-sonnet-4-6

The PRD's choice of Claude Sonnet 4.6 is well-reasoned. The recommendation stands, but not unconditionally — the reasoning matters.

**Why Claude Sonnet over GPT-4o:**
The decisive factors are the 200K context window and uncertainty calibration. As Shaadi AI's system prompt, user context block, and contract text are combined into a single API call, the total token count for a complex wedding with a long contract can approach 40–50K tokens. Claude's 200K window provides comfortable headroom as the product scales; GPT-4o's 128K creates a ceiling that will require architectural workarounds sooner.

More critically, Module B's clause flagging depends on the model expressing uncertainty accurately — not confidently benchmarking a clause against a norm it doesn't actually know. Claude's calibration on uncertainty is consistently stronger in independent evaluations and aligns directly with the PRD requirement to flag gaps rather than fill them with confident-sounding guesses.

The style profile feature (Module C) is also a differentiator. Planners build trust in Shaadi AI when emails sound like them. Claude's adherence to complex negative constraints ("never use this word," "never start with 'I'") is more reliable than GPT-4o's in independent testing — a small difference that compounds across every email drafted.

**Where GPT-4o is genuinely stronger:**
Schema-enforced JSON output. If the Make automation pipeline experiences malformed JSON failures in production, the correct fix is to evaluate GPT-4o's Structured Outputs API as a drop-in alternative for the extraction modules (A, B, D, G). This is the one area where GPT-4o has a clear, practical advantage.

### Secondary Consideration: Tiered Model Strategy

A single model for all 8 task types is not the most cost-efficient architecture. Consider:

| Task | Recommended Model | Rationale |
|------|------------------|-----------|
| Contract summary (A) | claude-sonnet-4-6 | Long document, high accuracy requirement |
| Clause flagging (B) | claude-sonnet-4-6 | Complex reasoning, cultural benchmarking, critical accuracy |
| Response drafting (C) | claude-sonnet-4-6 | Style profile adherence is core feature value |
| Obligation extraction (D) | claude-sonnet-4-6 | Date math accuracy is critical |
| Vendor outreach (E) | claude-sonnet-4-6 | Style profile adherence |
| Budget advisory (F) | claude-haiku-4-5 | Arithmetic + simple reasoning; Haiku is sufficient |
| Guest list import (G) | claude-haiku-4-5 | Pattern extraction from short text; Haiku is sufficient |
| Cultural setup interview (H) | claude-sonnet-4-6 | Cultural accuracy stakes are high |

Routing Modules F and G to Haiku could reduce API costs by approximately 40% without meaningful quality impact on those specific tasks. This matters at planner tier scale (50 accounts × 15–20 weddings/year × multiple budget and guest sessions).

### What Is Not Recommended and Why

**Claude Opus 4.6:** The capability uplift over Sonnet does not justify 2–3× the cost for V1 tasks. Opus becomes relevant if Module B flag accuracy falls below acceptable thresholds in production testing and prompt improvements don't resolve it — at that point, Opus is the right escalation path.

**Gemini 1.5 Pro:** The 1M context window is genuinely impressive but not needed. The instruction-following gap on complex behavioral constraints is too costly for the style profile and cultural flagging features, which are core to the product's differentiation.

**GPT-4o as primary:** Capable and legitimate alternative. If the Make + Anthropic connector proves unreliable in production or if malformed JSON becomes a recurring failure mode, switching to GPT-4o with Structured Outputs is a well-reasoned response — not a downgrade.

---

## Integration with Shaadi AI

### API Integration via Make (Integromat)

The tech stack routes all Claude API calls through Make, which acts as the middleware between Bubble (frontend/database) and the Claude API. The integration flow for each AI task is:

```
Bubble trigger (e.g., PDF uploaded)
    → Make scenario activated
    → PDF.co extracts contract text
    → Make assembles prompt (core system prompt + user context block + task module)
    → Make HTTP module calls Claude API (POST /v1/messages)
    → Claude returns JSON response
    → Make parses JSON fields
    → Make writes parsed data back to Bubble database
    → Bubble UI updates with results
```

### Key Integration Parameters

| Parameter | Value | Why |
|-----------|-------|-----|
| Model | claude-sonnet-4-6 | Primary model per this analysis |
| Max tokens | 4096 (Modules A, B, D, G) / 1024 (Modules C, E, F) | Extraction tasks need more output room |
| Temperature | 0.3 (Modules A, B, D, G) / 0.7 (Modules C, E, H) | Low for extraction accuracy; higher for drafting variation |
| System parameter | Core system prompt (constant) | Passed as `system` field in every API call |
| User parameter | Context block + task module | Assembled dynamically from Bubble database fields |

### JSON Reliability in Make

Because Claude produces JSON via prompt rather than schema enforcement, the Make scenario must include:

1. **JSON validation step:** After the Claude HTTP call, a Make JSON parser module attempts to parse the response. If parsing fails, the scenario routes to an error branch.
2. **Error branch:** On parse failure, write a fallback record to Bubble indicating "AI processing failed — please retry" and log the raw response for debugging.
3. **Retry logic:** Make supports automatic retry on HTTP errors (rate limits, timeouts). Configure 2 retries with exponential backoff for all Claude API calls.

### API Cost Monitoring

At the planner tier pricing ($199/month), API costs must stay well below the subscription price to maintain margin. Recommended monitoring setup:

- Log token counts (input + output) per API call in Bubble database
- Calculate per-user, per-month API cost in a Bubble dashboard
- Alert when any user's monthly API cost exceeds $20 (10% of plan price)
- Enforce usage limits per subscription tier (Couple Standard: 10 contract reviews/month)

### Rate Limits

Claude API rate limits at the default tier: 50 requests/minute, 100K tokens/minute. At V1 scale (50 planners, unlikely to spike simultaneously), this is not a constraint. Monitor during the private beta if any planner uses the platform for batch contract reviews.

---

## Summary

The right model for Shaadi AI is **claude-sonnet-4-6** as the primary model, with **claude-haiku-4-5** for cost-optimized low-stakes tasks. This is not the only defensible answer — GPT-4o is a credible alternative with a genuine advantage in schema-enforced JSON output. The recommendation for Claude is grounded in three specific factors: superior context window for combined prompt + contract calls, stronger calibration on uncertainty (critical for Module B's market norm benchmarking), and more reliable adherence to complex stylistic constraints (critical for the planner style profile feature). If either of those factors proves less important in production than projected, GPT-4o is a well-reasoned fallback.

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Design/master\_prompt\_v1.md, Design/evals.md*
