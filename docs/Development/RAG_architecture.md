# Shaadi AI — Data Sources, Preparation & RAG Architecture

**Author:** Varun Maryada
**Version:** 2.0
**Date:** June 2026
**Purpose:** Define data sources that feed the AI system, how data is prepared for evaluation, and the RAG architecture for V2

> **What changed in v2.0:** Stack update (Supabase replaces Bubble + Make; pgvector replaces Pinecone). Added reasoning sections for each data source, chunking, embedding, and retrieval decision. Added token efficiency section. Added combined-module call consideration. Added phased RAG timeline.

---

## Data Sources

### 1. Vendor Contracts (Primary — Modules A, B, C, D)

The most critical data asset. Needed for:
- Building and validating the golden test set
- Establishing the Indian wedding vendor market norm benchmarks that power Module B's traffic light flagging
- RAG retrieval of similar clauses at inference time (V2)

**Why this source is necessary:** Claude knows what a standard US contract looks like from training. It does not know what 75% upfront looks like for an Indian wedding photographer in Toronto vs. New York. Without real contracts, every market norm benchmark Module B produces is plausible-sounding but unvalidated. This corpus is the only path to grounded flagging accuracy.

**How to collect:**
- Direct ask to beta planners — request anonymized copies of vendor contracts from past weddings; target 50+ before public launch (per PRD §15, Open Question 5)
- Synthetic contracts — generate realistic contracts for vendor categories that are hard to source (Pandit, mehndi artist) based on known market terms
- Target coverage: all 5 PRD-specified vendor categories (venue, photographer, caterer, décor, entertainment) plus Pandit, makeup artist, mehndi artist

**Coverage target before launch:**

| Vendor Category | Minimum Contracts | Why |
|----------------|-------------------|-----|
| Photographer | 10 | Highest contract volume per wedding |
| Venue | 10 | Highest dollar value; most complex clauses |
| Caterer | 10 | Force majeure and overtime most variable |
| Decorator | 8 | Deposit structures vary widely |
| DJ / Entertainment | 8 | Overtime and exclusivity most common RED flags |
| Pandit / Officiant | 5 | Low volume; simpler contracts |
| Makeup Artist / Mehndi | 5 | Short, informal contracts common |
| **Total** | **56 minimum** | |

---

### 2. Cultural Knowledge Base (Module H)

Needed to validate and augment the cultural setup interview's structured output — event lists, vendor checklists, cultural notes — for each tradition.

**Why this source is different from contracts:** This is structured reference data, not examples to retrieve dynamically. It answers "what vendors are required for an Anand Karaj?" not "what does a similar contract say?" It is built once, validated by community reviewers, and injected directly into the system prompt — no vector database needed for this source.

**Sources:**
- Community validators — one reviewer per cultural tradition (North Indian Hindu, Punjabi Sikh, Tamil Hindu, Gujarati Hindu, interfaith) reviews and annotates the AI's structured output for accuracy
- Published cultural references — wedding planning guides, Gurdwara ceremony documentation, temple ceremony guidelines
- Planner interviews — beta planners who specialize in specific traditions can annotate typical vendor checklists and common planning pitfalls per event type

**Format:** Structured knowledge cards per tradition — event list, required vendors per event, common regional variations, key advance-booking requirements (e.g., Gurdwara booking, temple coordination)

---

### 3. Planner Style Profiles (Modules C, E)

**Source:** User-provided — planners paste 3–5 sample emails during onboarding. These are not a shared training dataset; they are per-user context injected at runtime.

**Implication for evaluation:** To evaluate style profile adherence (criterion C3 in evals.md), a test-specific style profile must be created with measurable constraints (explicit prohibited words, sentence length bounds) so adherence can be checked programmatically and via blind review.

---

### 4. Guest List Formats (Module G)

**Sources:**
- Manually constructed test inputs representing real formats: WhatsApp message dumps, copied spreadsheet rows, typed name lists, mixed formats
- At least 5 diverse inputs for the golden test set (as defined in use_cases.md)
- No real guest data — all test inputs are synthetic to avoid handling real PII

---

### 5. Supabase Runtime Database (All Modules)

Wedding records, vendor records, budget allocations, event structures, and guest records are stored in Supabase (Postgres) and injected into prompts at runtime via Supabase Edge Functions. This is not a training dataset — it is live operational data. It never leaves the Supabase + Claude API pipeline.

> **Stack note:** Original plan used Bubble + Make. Switched to React/Vite + Supabase during build. All architecture decisions remain valid; only the implementation layer changed.

---

## Data Preparation

### Step 1 — PII Removal (Contracts)

**Why this step exists:** PII removal is not just a privacy requirement — it is an accuracy requirement. If a retrieved example contains a real vendor name and that name appears in the current contract being reviewed, the model may conflate the two. Replacing names with `[VENDOR NAME]` and `[COUPLE NAME]` makes retrieved examples clean and non-attributable, preventing cross-contamination between contracts.

Before any contract is used in the golden test set or RAG knowledge base, all personally identifiable information must be removed:

- Couple names → replace with `[COUPLE NAME]`
- Vendor business names → replace with `[VENDOR NAME]` or a synthetic name
- Vendor addresses, phone numbers, emails → remove entirely
- Dollar amounts → retain (essential for flagging logic) but verify they are not linked to identifiable parties
- Signatures and witness names → remove

**Method:** Manual review for V1 (50+ contracts is manageable by hand). At scale, a regex + manual review pass is sufficient — NLP-based PII detection is not required for this data volume.

---

### Step 2 — Format Normalization

**Why this step exists:** PDF extraction produces noise that degrades model accuracy. A clause that reads "Payment: 50% at sign- ing, 50% due 30 days prior" split across a page break will either be misread or trigger a false uncertainty flag. Clean text is inexpensive to produce and directly improves extraction quality at no token cost.

Raw contracts arrive as PDFs of variable quality. After extraction (PDF.co or Supabase Storage + edge function):

- Remove PDF extraction artifacts: page headers/footers, page numbers, column break characters
- Fix encoding issues: smart quotes, em dashes, special characters that PDF extraction mangles
- Normalize whitespace: collapse multiple spaces and line breaks into clean paragraph breaks
- Verify clause boundaries: check that section headers are preserved and clause text is not split across pages

**Output:** Clean plain text files, one per contract, with consistent formatting.

---

### Step 3 — Clause-Level Segmentation and Labeling

**Why this step exists:** This is the most expensive step and the most important. The human-assigned GREEN/YELLOW/RED ratings and market norm benchmarks become the ground truth used to evaluate Module B accuracy in evals.md. Without this annotation, there is no way to measure whether the model's flagging is correct — you would be measuring against the model's own output, not against expert judgment.

For each contract, segment the text into the 8 clause categories defined in Module A:

1. Payment schedule
2. Cancellation policy
3. Inclusions
4. Exclusions
5. Overtime policy
6. Exclusivity clauses
7. Liability and insurance
8. Force majeure

For each clause segment, a human reviewer (ideally someone with Indian wedding contract experience) assigns:
- The clause category label
- A risk rating: GREEN / YELLOW / RED
- A plain-language market norm benchmark for that vendor category
- A `missing` flag if the clause is absent from the contract

**Output format per clause:**
```json
{
  "contract_id": "PHO-001",
  "vendor_category": "Photographer",
  "clause_type": "cancellation_policy",
  "clause_text": "[original text]",
  "human_rating": "RED",
  "market_norm": "Most Indian wedding photographer contracts use a sliding scale...",
  "missing": false,
  "reviewer": "reviewer_initials",
  "review_date": "2026-05-01"
}
```

---

### Step 4 — Golden Test Set Assembly

From the labeled contract data, select a balanced subset for the golden test set:

- Minimum 1 contract per vendor category with all GREEN flags (tests over-flagging)
- Minimum 2 contracts per vendor category with at least one RED flag (tests detection)
- Minimum 1 contract per vendor category with a missing force majeure clause
- Minimum 1 contract with conflicting clauses

Each golden test case pairs a full contract input with the expected output — the human-reviewed clause labels, ratings, and benchmarks. This is the ground truth used to score Module A and B outputs in evals.md.

---

### Step 5 — Train / Eval Split (If Fine-Tuning Pursued)

For V1, Shaadi AI uses prompt engineering, not fine-tuning. If fine-tuning is pursued post-launch:

- **Eval set:** 15–20 contracts held out from prompt development entirely. Never used to write or refine prompts. Used only to measure final performance.
- **Development set:** Remaining contracts used during prompt iteration. Seeing these contracts during prompt writing is expected and acceptable.
- **Contamination rule:** Any contract used as a few-shot example in the prompt must be excluded from the eval set.

---

## RAG Architecture

Shaadi AI's V1 uses static prompt-based benchmarks for Module B. RAG becomes the right architecture when the contract database grows large enough that dynamic retrieval outperforms hardcoded rules — estimated threshold: 200+ labeled contracts across all vendor categories.

**Why not RAG for V1:** RAG requires a populated corpus to retrieve from. Running retrieval against an empty or very small database produces worse results than a well-written static prompt — you end up injecting noisy, non-representative examples that confuse the model rather than calibrating it. The phased approach below builds the corpus first, then enables retrieval once the signal-to-noise ratio is high enough.

The following defines the target RAG architecture for V2.

---

### What Gets Retrieved and Why

RAG is most valuable for **Module B (Clause Flagging)**. The core problem it solves: hardcoded flag rules in the prompt cannot cover every novel contract clause. A retrieval system that finds similar clauses from the labeled contract database — with their human-assigned ratings and market norm benchmarks — provides the model with real evidence rather than general rules.

Secondary use case: **Module H (Cultural Setup)**. A cultural knowledge base of structured event and vendor data per tradition can be retrieved at setup time, replacing reliance on the model's unvalidated training knowledge.

---

### Chunking Strategy

**Unit of chunking: individual clause, not document.**

**Why clause-level, not document-level:** If you chunk at the document level, a query about a cancellation clause returns a whole contract — 2,000–5,000 tokens of retrieved text to find the 200-token clause you need. Expensive and noisy. If you chunk at the sentence level, you lose the context that makes a clause interpretable ("50% forfeiture" means nothing without knowing it is a cancellation clause, not a payment term). The clause is the natural semantic unit for this domain — discrete, self-contained, and directly matched to the Module B evaluation task.

**Why no chunk overlap:** Overlap is useful when chunks split mid-sentence and context bleeds across boundaries. Clauses have hard boundaries defined by section headers. Overlap would add token cost with no accuracy benefit.

A single contract contains 8 clause categories. Each clause is a discrete, semantically self-contained unit. Document-level chunking loses the clause-type signal; sentence-level chunking loses the context that makes a clause interpretable.

Each chunk = one clause from one contract:

```
Chunk content:   [clause_text]
Metadata:
  - vendor_category
  - clause_type
  - human_rating (GREEN / YELLOW / RED)
  - market_norm_benchmark
  - missing (boolean)
  - contract_id (for deduplication)
```

**Chunk size:** Typically 100–400 tokens per clause. No overlap needed — clauses do not continue across boundaries.

**Cultural knowledge base chunking:** One chunk per event per tradition. Each chunk contains the event name, typical duration, required vendors, common variations, and advance-booking requirements.

---

### Embedding Model

**Recommended: `text-embedding-3-small` (OpenAI)**

| Model | Cost (per 1M tokens) | Dimensions | Verdict |
|-------|---------------------|------------|---------|
| `text-embedding-3-small` | $0.02 | 1536 | Right balance of cost and quality for short legal clauses |
| `text-embedding-3-large` | $0.13 | 3072 | 6.5× more expensive; marginal accuracy gain at this data volume does not justify cost |

**Corpus embedding cost:** 448 chunks × 300 tokens avg = ~134K tokens × $0.02/1M = **$0.003 total.** You embed once when a contract is added. This is not a meaningful cost.

**Query embedding cost:** Each retrieval query = ~200 tokens = **$0.000004 per call.** Also not meaningful.

The token cost that matters is the Claude inference tokens for the contract text itself (2,000–5,000 tokens per contract), not the embedding. See Token Efficiency section below.

For clause retrieval, the embedding must capture:
- Legal semantic similarity (clauses with similar legal effect should cluster together)
- Vendor category signal (a photographer overtime clause should not surface as a top result for a caterer force majeure query)

**Embedding input:** Concatenate `clause_type + ": " + clause_text` before embedding — prepending the clause type improves retrieval precision by anchoring the embedding to the clause category. Without it, "50% forfeiture for late cancellation" could match a payment clause with similar surface wording.

---

### Vector Database

**Recommended: pgvector (Supabase built-in)**

> **Stack update from v1.0:** Original recommendation was Pinecone because the stack was Bubble + Make (Pinecone has a direct Make HTTP integration). Stack is now Supabase. pgvector is a Postgres extension built into Supabase — already paid for, no additional service, no extra API key. At 448–5,000 vectors, any database handles this trivially. The selection criterion is operational simplicity, and pgvector wins on that basis.

```sql
-- Enable RAG in Supabase with one migration
create extension if not exists vector;

create table contract_clauses (
  id           uuid primary key default gen_random_uuid(),
  contract_id  text not null,
  vendor_cat   text not null,
  clause_type  text not null,
  clause_text  text not null,
  rating       text not null,  -- GREEN / YELLOW / RED
  market_norm  text not null,
  embedding    vector(1536)
);

-- ivfflat index; lists=10 is correct for <1000 vectors
create index on contract_clauses
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);
```

**Index structure:**
- Filter by `vendor_cat` and `clause_type` before ranking by vector similarity — eliminates irrelevant results before the expensive similarity calculation
- Metadata fields stored: all fields from the chunk schema above

---

### Retrieval Logic

**Query construction:** When Module B is called with a contract clause, the retrieval query is:

```sql
select clause_text, rating, market_norm
from contract_clauses
where vendor_cat  = $1          -- metadata filter first (eliminates noise cheaply)
  and clause_type = $2          -- further narrow before vector comparison
order by embedding <=> $3       -- cosine similarity on remaining rows only
limit 3;
```

**Why filter before ranking:** Without metadata filters, the similarity search ranks all 448+ vectors. With filters, it ranks only the ~56 vectors matching the same vendor category and clause type. The model gets same-category, same-clause-type comparisons every time — a venue force majeure clause retrieves venue force majeure examples, not photographer cancellation examples.

**Why top_k = 3:** Three examples add ~900–1,200 tokens to the prompt. Going to top_k = 5 adds ~1,500–2,000 tokens with diminishing accuracy returns. The model needs one clear RED and one clear GREEN to anchor its judgment — three is the right upper bound.

**Retrieval output:** Top-3 similar clauses with their human ratings and market norm benchmarks. These are passed to Module B as dynamic few-shot examples, replacing or supplementing the hardcoded flag rules.

---

### Prompt Augmentation

Retrieved examples are injected into the Module B task module immediately before the clause evaluation instruction. **Inject rating and market norm; truncate clause text** — the model's job is to evaluate the *current* clause, not re-read the retrieved ones. First 100 tokens of retrieved clause text is enough to convey the pattern.

```
## Retrieved examples from similar contracts:

Example 1 (Photographer, cancellation_policy, RED):
  "[First 100 tokens of retrieved clause]..."
  Market norm: "[retrieved benchmark]"

Example 2 (Photographer, cancellation_policy, GREEN):
  "[First 100 tokens of retrieved clause]..."
  Market norm: "[retrieved benchmark]"

Now evaluate the following clause from this contract using the examples above as reference...
```

**Why truncate:** Injecting full retrieved clause text at ~300 tokens per example × 3 = ~900 tokens. Truncating to 100 tokens per example × 3 = ~300 tokens. Saves ~600 tokens per Module B call with no meaningful accuracy loss — the model is pattern-matching on clause structure, not memorizing the retrieved text.

This converts a static prompt into a dynamically grounded one — the model is no longer reasoning from general knowledge alone but from labeled examples drawn from the actual Indian wedding vendor contract dataset.

---

## Token Efficiency

The retrieved context (RAG) is not where Claude API costs compound. The contract text is. A typical vendor contract is 2,000–5,000 tokens. Modules A, B, and D all receive the full contract text — three separate calls on the same document = 6,000–15,000 input tokens per contract review.

### Three levers to optimize

**1. Filter before you rank (retrieval).** `vendor_cat` and `clause_type` filters eliminate irrelevant vectors before similarity scoring. This keeps top_k = 3 results genuinely useful, avoiding the need to over-retrieve to find signal.

**2. top_k = 3, not higher.** Caps retrieved context at ~300–1,200 tokens depending on truncation. Diminishing returns above 3 — the model calibrates from the contrast between examples, not from volume.

**3. Consider a combined-module call for contract review.** Modules A, B, and D all take the same contract text as input. Passing the contract to all three separately means paying for it three times. A single combined call with a unified output schema cuts input tokens by two-thirds for the contract text. Tradeoff: more complex output schema; higher risk of one module's output affecting another's quality. Validate against the golden test set before deciding.

### Cost reference

| Step | Tokens | Cost (claude-sonnet-4-6) |
|------|--------|--------------------------|
| Module B call (contract text only) | ~2,500 input + ~800 output | ~$0.020 |
| + 3 hardcoded few-shot examples | +1,200 input | +$0.004 |
| + RAG retrieval context (truncated) | +300 input | +$0.001 |
| Embedding query | ~200 tokens | ~$0.000004 |

The embedding cost is negligible. The contract text is the cost to manage.

---

### RAG Implementation Timeline

| Phase | Data Volume | Approach | Why |
|-------|------------|----------|-----|
| V1 — Capstone (now) | 0–56 contracts | Static prompt rules; no RAG; golden test set only | No corpus yet; RAG on empty/small db is worse than static rules |
| V1.1 — Private beta | 56–100 contracts | Static rules + 2–3 hardcoded few-shot examples per vendor category injected into prompt | Best examples selected manually; no vector DB needed; ~1,200 token cost per call |
| V2 — Post-launch | 100–500 contracts | Full RAG: pgvector + dynamic retrieval; replace hardcoded rules with retrieved examples | Corpus large enough that dynamic retrieval outperforms any static selection |
| V3 — Scale | 500+ contracts | RAG + fine-tuning on high-confidence labeled examples; consider domain-specific embedding model | At this volume, fine-tuning produces better results than few-shot prompting alone |

---

## Decision Summary

| Decision | Choice | Why |
|----------|--------|-----|
| Data source priority | Vendor contracts (56+ target) | Only source of ground-truth market norm benchmarks for Module B flagging |
| Cultural knowledge | Structured reference cards, injected into system prompt | Static reference data, not examples to retrieve; built once, validated by community reviewers |
| V1 RAG approach | None — static prompt rules | No corpus yet; RAG on empty/tiny db produces worse results than a well-written static prompt |
| V1.1 approach | Hardcoded few-shot examples (2–3 per vendor category) | ~1,200 token cost; better than dynamic retrieval until 100+ labeled contracts exist |
| V2 RAG trigger | 200+ labeled contracts | Below this threshold, static examples are a better approximation than dynamic retrieval |
| Chunking unit | Clause (not document, not sentence) | Right semantic unit; document-level returns 2,000–5,000 tokens to find a 200-token clause; sentence-level loses interpretive context |
| Chunk overlap | None | Clauses have hard section boundaries; overlap adds token cost with no accuracy benefit |
| Embedding model | `text-embedding-3-small` | $0.003 to embed the full initial corpus; sufficient quality for clause-level similarity at this scale |
| Embedding input format | `clause_type + ": " + clause_text` | Prepending clause type improves retrieval precision; prevents cross-clause-type false matches |
| Vector database | pgvector (Supabase built-in) | Already in stack; no additional service or cost; eliminates Pinecone dependency |
| Retrieval filter | `vendor_cat` + `clause_type` before vector ranking | Eliminates cross-category noise before similarity scoring; keeps top_k=3 results genuinely useful |
| top_k | 3 | Caps injected context at ~300–1,200 tokens; diminishing returns above 3 examples |
| Retrieved context format | Rating + market norm + first 100 tokens of clause text | Saves ~600 tokens per call vs. full clause text; model needs pattern, not full re-read |
| Biggest real cost | Contract text input tokens (2,000–5,000 per contract) | Not the retrieval; consider combined-module call (A+B+D together) to reduce contract text cost by two-thirds |

---

## Version Log

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | April 2026 | Initial architecture — data sources, preparation pipeline, RAG design for V2 |
| v2.0 | June 2026 | Stack update (pgvector replaces Pinecone; Supabase replaces Bubble+Make). Added reasoning for each decision. Added token efficiency section with cost reference table. Added combined-module call consideration. Added decision summary table. |

---

*Last updated: June 2026 | Author: Varun Maryada*
*Companion documents: docs/Design/master\_prompt\_v1.md, docs/Design/evals.md, docs/Development/model\_selection.md*
