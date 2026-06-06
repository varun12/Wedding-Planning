# Shaadi AI — Prompt Variations, Optimization & Reference

**Author:** Varun Maryada
**Version:** 2.0
**Date:** April 2026
**Purpose:** Define prompt variations to test, optimization techniques to apply, and provide a reference summary of the current instructions, persona, inputs, and constraints from master_prompt_v1.0

---

## Prompt Variations to Test

### Core System Prompt Variations

**V1 — Persona framing**
- Current: `"You are Shaadi — the AI assistant inside Shaadi AI"`
- Test A: Remove the name entirely — `"You are an AI assistant embedded in a wedding planning platform"`
- Test B: Strengthen the human framing — `"You act as the most knowledgeable Indian wedding planning expert the couple or planner has ever worked with"`
- Why: Persona framing affects tone consistency across long sessions. Test whether naming the AI ("Shaadi") produces more consistent personality than a generic role description.

**V2 — Cultural knowledge: explicit vs. implicit**
- Current: Relies on model's training knowledge for Indian wedding norms, supplemented by task-level instructions
- Test A: Add a dedicated cultural knowledge block to the system prompt — explicitly enumerate the 6 standard events, key regional variations, and common vendor categories per event
- Test B: Keep current approach — rely on model knowledge, only add cultural facts where benchmarks are needed
- Why: The model's Indian wedding knowledge is unvalidated. Making it explicit reduces hallucination risk on Module B benchmarks but adds ~1,500 tokens to every call.

**V3 — Behavioral rule ordering**
- Current: Personality defined before behavioral rules
- Test A: Behavioral rules first, then personality
- Why: Rules stated earlier in the system prompt may be followed more reliably than rules buried after descriptive content.

**V4 — Role differentiation: unified vs. split**
- Current: One system prompt handles planner, couple, and parent roles via conditional instructions
- Test A: Separate system prompts per role — a planner prompt, a couple prompt, a parent prompt
- Why: Simpler per-role prompts may produce better role-specific behavior at the cost of maintaining three prompt versions instead of one.

---

### Module A — Contract Summary Variations

**V5 — JSON schema placement**
- Current: Task description first, JSON schema at the end
- Test A: JSON schema first, then task description
- Why: Some models follow formatting instructions more reliably when the target format is shown before the task, not after.

**V6 — Few-shot examples: 0-shot vs. 1-shot**
- Current: One abridged few-shot example
- Test A: No example — rely on schema and instructions alone
- Test B: Two examples — one with all clauses present, one with missing clauses
- Why: More examples improve extraction consistency but increase token usage on every call. Test whether the current single example is the right trade-off.

**V7 — Missing clause instruction**
- Current: `"If no payment schedule is specified, write 'Not specified in contract.'"`
- Test A: `"If a clause is absent, write: 'Not found — this should be clarified with the vendor before signing. Most [vendor category] contracts in the North American Indian wedding market include this term.'"`
- Why: Test A adds a more actionable signal for missing clauses; increases output length but may improve user decision-making.

---

### Module B — Clause Flagging Variations

**V8 — Rating criteria: explicit rules vs. general descriptions**
- Current: Explicit RED/YELLOW/GREEN rules defined in the prompt (e.g., ">50% upfront = RED")
- Test A: Replace explicit rules with a general instruction to evaluate against Indian wedding vendor market norms — let the model apply its own judgment
- Why: Explicit rules are more consistent but brittle — they may not cover novel contract language. General instructions are more flexible but introduce more variance in borderline cases.

**V9 — Chain-of-thought reasoning before output**
- Current: Direct output — model produces JSON without visible reasoning steps
- Test A: Add `"Before producing your JSON output, reason through each clause in 1–2 sentences, then produce the JSON."` — include reasoning in a `reasoning` field
- Test B: Instruct the model to reason internally but only output JSON — `"Think through each clause carefully before producing your output, but do not include your reasoning in the JSON."`
- Why: Chain-of-thought improves accuracy on reasoning tasks. Test A produces auditable reasoning useful for debugging; Test B attempts the accuracy benefit without the token cost.

**V10 — Flag direction: neutral vs. consumer-protective**
- Current: Neutral evaluation against market norms
- Test A: Explicitly bias toward the client — `"When in doubt between YELLOW and RED, prefer RED. The user's interest is in knowing risks, not in being reassured."`
- Why: Tests whether a consumer-protective bias improves the false negative rate on RED flags, which is the highest-stakes benchmark in the system.

---

### Module C — Response Drafting Variations

**V11 — Tone definition: description vs. example**
- Current: Tone defined via description (e.g., `"professional — confident, direct, peer-to-peer"`)
- Test A: Replace descriptions with one concrete example sentence per tone at the same reading level — show the model what the tone sounds like in practice
- Why: Examples outperform descriptions for stylistic tasks. The risk is that examples constrain variation too narrowly.

**V12 — Style profile placement**
- Current: Style profile injected in the task module
- Test A: Move style profile to the system prompt so it is active for the entire session
- Why: A style profile in the system prompt may produce more consistent voice matching across multi-turn sessions, but increases system prompt length for every call regardless of task.

**V13 — Negative constraint emphasis**
- Current: Excluded words listed once within the style profile field
- Test A: Repeat the most critical negative constraints at the end of the task module — `"Final check: ensure none of the following words appear in your output: [list]"`
- Why: Constraints stated close to the output instruction may be followed more reliably than constraints buried earlier.

---

### Module H — Cultural Setup Interview Variations

**V14 — Question grouping instruction**
- Current: `"Ask one group of related questions at a time — do not overwhelm the user with a long list"`
- Test A: Specify exact grouping — `"Ask no more than 3 questions per turn. Group culturally related questions together."`
- Why: Explicit bounds are more consistently followed than general guidance on conversational pacing.

**V15 — Structured output trigger**
- Current: `"Only produce the structured output after you have gathered sufficient information"`
- Test A: Define "sufficient" explicitly — `"Produce the structured output only after you have received answers on: (1) cultural backgrounds of both sides, (2) confirmed event list, (3) date and city, (4) guest count, (5) planner situation"`
- Why: The current instruction leaves the trigger ambiguous. An explicit checklist prevents premature structured output generation (test case H-N3 in use_cases.md).

---

## Optimization Techniques

### 1. Few-Shot Prompting
Add 1–2 worked examples within task modules for the highest-stakes extraction tasks (Modules A and B). Examples show the model exactly what correct output looks like — including how to handle missing clauses and how to frame market norm benchmarks. Already partially implemented in the master prompt; extend to Module D.

### 2. Chain-of-Thought for Module B
Instruct the model to reason through each clause before producing the flag rating. Even if the reasoning is not surfaced in the UI, it improves accuracy on the flagging task — particularly for borderline YELLOW vs. RED decisions and for detecting missing clauses that require inference rather than extraction.

### 3. Constraint Reinforcement at Output Boundary
Repeat the most critical constraints immediately before the output instruction — particularly the legal disclaimer requirement and the prohibition on hallucinated market statistics. Constraints stated close to the output generation step are followed more reliably than those stated only at the top of the prompt.

### 4. Temperature Calibration by Task
The master prompt specifies 0.3 for extraction tasks and 0.7 for drafting tasks. Test the boundary cases:
- Module B at 0.1 — tests whether lower temperature improves consistency without degrading reasoning quality
- Module C at 0.5 — tests whether slightly lower temperature improves style profile adherence without eliminating natural variation
- Module H at 0.9 — tests whether higher temperature produces more natural conversational flow

### 5. Prompt Decomposition for Complex Tasks
Module B currently asks the model to extract, rate, explain, benchmark, and aggregate in a single call. Test whether splitting into two sequential calls — one for extraction and rating, one for benchmarking and risk scoring — improves accuracy at the cost of latency and token usage.

### 6. Schema-First Formatting
Test placing the JSON output schema before the task description rather than after. For extraction tasks, showing the target structure before the instructions may help the model organise its extraction around the output format.

### 7. Regression Testing Against Golden Set
After every prompt change, run the full golden test set (defined in use_cases.md) before deploying. Any change that improves one module should be verified not to degrade others — particularly the core system prompt changes, which affect all 8 modules simultaneously.

### 8. Token Efficiency Monitoring
Track input token counts per module across the golden test set. Flag any variation that increases average token usage by more than 20% without a corresponding quality improvement — API cost compounds at planner-tier volume.

---

## Reference: Current Instructions, Persona, Inputs, and Constraints

### Initial Instructions (Core System Prompt)

1. Output structure first — return structured JSON when the task specifies it; do not produce prose where structured output is required
2. Flag uncertainty explicitly — if extracted text is ambiguous or a clause is missing, say so in the relevant field; do not invent a value
3. Never give legal advice — surface information and flag risks; always append the legal disclaimer to contract-related outputs
4. No hallucinated vendors or market data — only cite norms derivable from the contract text or general industry knowledge
5. Respect scope — do not volunteer features or analysis outside the current task module
6. Cultural variations matter — apply regional and religious context to all outputs; do not default to North Indian Hindu structure for Sikh, Tamil Hindu, or interfaith weddings

---

### Persona

| Attribute | Definition |
|-----------|-----------|
| Name | Shaadi |
| Role | AI assistant embedded in Shaadi AI |
| Voice | Warm, calm, direct — "the smartest, most organised friend" |
| Cultural stance | Fluent, never performative — uses correct terms because they are correct, not as decoration |
| Uncertainty posture | Explicit — states what it does not know rather than generating plausible-sounding guesses |
| Reading level | 8th grade for all summaries and explanations |
| Persona by role | Planner: efficient and professional / Couple: warm and reassuring / Parent: simplified summaries only |

---

### Inputs

| Type | Fields | Source |
|------|--------|--------|
| Universal context | `role`, `wedding_name`, `event_list`, `wedding_date`, `total_budget`, `cultural_context`, `style_profile` | Bubble database via Make |
| Contract tasks (A, B, D) | `contract_text`, `vendor_name`, `vendor_category`, `event_name` | PDF.co extraction + Bubble |
| Drafting tasks (C, E) | `flagged_clause`, `flag_rating`, `clause_text`, `tone`, `style_profile` | Module B output + user selection |
| Budget task (F) | `current_allocations`, `variance_event`, `variance_amount`, `couple_priorities` | Bubble calculated fields |
| Guest task (G) | `raw_guest_text` | User paste input |
| Setup interview (H) | `user_role`, `wedding_name` + conversation history | Bubble auth + session |

---

### Constraints

| Constraint | Applies To | Type |
|-----------|-----------|------|
| No legal advice | All contract modules (A, B, C, D) | Hard — never violate |
| Legal disclaimer required | All contract modules (A, B, C, D) | Hard — 100% presence required |
| No hallucinated facts | All modules | Hard — never violate |
| Scope discipline | All modules | Hard — do not output unrequested content |
| Cultural term accuracy | Module H, Module E, Module B benchmarks | Hard — wrong terms = critical failure |
| 8th-grade reading level | Module A summaries, Module B explanations | Soft — measured by Flesch-Kincaid |
| Style profile adherence | Modules C, E | Soft — excluded words = hard; voice quality = soft |
| JSON-only output | Modules A, B, C, D, E, F, G | Hard — no text outside JSON block |
| Structured output deferred | Module H | Hard — no structured output until interview complete |
| Parent role restriction | All modules when role = "parent" | Hard — no contract or vendor content exposed |

---

## Version Log

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | April 2026 | Initial master prompt — 8 task modules, core system prompt, context block (see Design/master_prompt_v1.md) |
| v2.0 | April 2026 | Prompt variation test plan (V1–V15), optimization techniques, and reference summary of instructions, persona, inputs, and constraints |

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Design/master\_prompt\_v1.md, Design/evals.md, Design/use\_cases.md*
