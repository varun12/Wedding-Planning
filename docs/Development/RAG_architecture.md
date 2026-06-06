# Shaadi AI — Data Sources, Preparation & RAG Architecture

**Author:** Varun Maryada
**Version:** 1.0
**Date:** April 2026
**Purpose:** Define data sources that feed the AI system, how data is prepared for evaluation, and the RAG architecture for V2

---

## Data Sources

### 1. Vendor Contracts (Primary — Modules A, B, C, D)

The most critical data asset. Needed for:
- Building and validating the golden test set
- Establishing the Indian wedding vendor market norm benchmarks that power Module B's traffic light flagging
- RAG retrieval of similar clauses at inference time (V2)

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

### 5. Bubble Runtime Database (All Modules)

Wedding records, vendor records, budget allocations, event structures, and guest records are stored in Bubble and injected into prompts at runtime via Make. This is not a training dataset — it is live operational data. It never leaves the Bubble + Make + Claude API pipeline.

---

## Data Preparation

### Step 1 — PII Removal (Contracts)

Before any contract is used in the golden test set or RAG knowledge base, all personally identifiable information must be removed:

- Couple names → replace with `[COUPLE NAME]`
- Vendor business names → replace with `[VENDOR NAME]` or a synthetic name
- Vendor addresses, phone numbers, emails → remove entirely
- Dollar amounts → retain (essential for flagging logic) but verify they are not linked to identifiable parties
- Signatures and witness names → remove

**Method:** Manual review for V1 (50+ contracts is manageable by hand). At scale, a regex + manual review pass is sufficient — NLP-based PII detection is not required for this data volume.

---

### Step 2 — Format Normalization

Raw contracts arrive as PDFs of variable quality. After PDF.co extraction:

- Remove PDF extraction artifacts: page headers/footers, page numbers, column break characters
- Fix encoding issues: smart quotes, em dashes, special characters that PDF extraction mangles
- Normalize whitespace: collapse multiple spaces and line breaks into clean paragraph breaks
- Verify clause boundaries: check that section headers are preserved and clause text is not split across pages

**Output:** Clean plain text files, one per contract, with consistent formatting.

---

### Step 3 — Clause-Level Segmentation and Labeling

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

The following defines the target RAG architecture for V2.

---

### What Gets Retrieved and Why

RAG is most valuable for **Module B (Clause Flagging)**. The core problem it solves: hardcoded flag rules in the prompt cannot cover every novel contract clause. A retrieval system that finds similar clauses from the labeled contract database — with their human-assigned ratings and market norm benchmarks — provides the model with real evidence rather than general rules.

Secondary use case: **Module H (Cultural Setup)**. A cultural knowledge base of structured event and vendor data per tradition can be retrieved at setup time, replacing reliance on the model's unvalidated training knowledge.

---

### Chunking Strategy

**Unit of chunking: individual clause, not document.**

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

**Recommended: `text-embedding-3-small` (OpenAI) or Claude's embeddings API**

For clause retrieval, the embedding must capture:
- Legal semantic similarity (clauses with similar legal effect should cluster together)
- Vendor category signal (a photographer overtime clause should not surface as a top result for a caterer force majeure query)

**Embedding input:** Concatenate `clause_type + ": " + clause_text` — prepending the clause type improves retrieval precision by anchoring the embedding to the clause category.

---

### Vector Database

**Recommended for V1 RAG: Pinecone (managed) or pgvector (if migrating from Bubble to Supabase)**

At 56 contracts × 8 clauses = ~450 vectors to start. This is a small index — any vector database handles it trivially. The selection criterion at this scale is operational simplicity, not performance.

Pinecone integrates directly with Make via HTTP, which fits the existing automation stack without adding infrastructure overhead.

**Index structure:**
- One namespace per vendor category — enables metadata filtering at query time without post-retrieval filtering
- Metadata fields stored: all fields from the chunk schema above

---

### Retrieval Logic

**Query construction:** When Module B is called with a contract clause, the retrieval query is:

```
query  = clause_type + ": " + clause_text_excerpt (first 200 tokens)
filter = { vendor_category: [vendor_category from user context] }
top_k  = 3
```

Filtering by vendor category at query time prevents cross-category noise — a venue force majeure clause should retrieve venue examples, not photographer examples.

**Retrieval output:** Top-3 similar clauses with their human ratings and market norm benchmarks. These are passed to Module B as dynamic few-shot examples, replacing or supplementing the hardcoded flag rules.

---

### Prompt Augmentation

Retrieved examples are injected into the Module B task module immediately before the clause evaluation instruction:

```
## Retrieved examples from similar contracts:

Example 1 (Photographer, RED):
Clause: "[retrieved clause text]"
Rating: RED
Market norm: "[retrieved benchmark]"

Example 2 (Photographer, YELLOW):
Clause: "[retrieved clause text]"
Rating: YELLOW
Market norm: "[retrieved benchmark]"

Now evaluate the following clause from this contract using the examples above as reference...
```

This converts a static prompt into a dynamically grounded one — the model is no longer reasoning from general knowledge alone but from labeled examples drawn from the actual Indian wedding vendor contract dataset.

---

### RAG Implementation Timeline

| Phase | Data Volume | Approach |
|-------|------------|----------|
| V1 — Capstone (now) | 0–56 contracts | Static prompt rules; no RAG; golden test set only |
| V1.1 — Private beta | 56–100 contracts | Static rules + few-shot examples in prompt from top 3–5 most representative contracts per vendor category |
| V2 — Post-launch | 100–500 contracts | Full RAG pipeline: Pinecone + dynamic retrieval; replace hardcoded rules with retrieved examples |
| V3 — Scale | 500+ contracts | RAG + fine-tuning on high-confidence labeled examples; consider separate embedding model trained on Indian wedding contract domain |

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Design/master\_prompt\_v1.md, Design/evals.md, Development/model\_selection.md*
