# Shaadi AI — Test Use Cases

**Author:** Varun Maryada
**Version:** 1.0
**Date:** April 2026
**Applies to:** Master Prompt v1.0 — all 8 task modules (A–H)

---

## How to Use This Document

Each module below lists three tiers of test cases:

- **Standard** — the expected happy-path scenario the prompt should handle reliably
- **Edge** — valid but unusual inputs that stress the prompt's logic
- **Negative** — inputs that should be rejected, flagged, or handled with explicit uncertainty rather than a confident wrong answer

Each case includes:
- The specific input condition
- What the output must contain or avoid
- The benchmark from `evals.md` it validates

---

## Module A — Contract Plain-Language Summary

### Standard Cases

**A-S1: Standard photographer contract**
- Input: 8-page PDF with clearly labelled sections for payment, cancellation, inclusions, overtime
- Expected output: All 8 summary fields populated with plain-language text; Flesch-Kincaid ≤ 8; `one_sentence_summary` under 30 words
- Validates: A1 (clause coverage), A2 (reading level), A4 (one-sentence summary)

**A-S2: Venue contract with force majeure**
- Input: 12-page venue contract including a mutual force majeure clause covering weather, illness, and government restriction
- Expected output: `force_majeure` field accurately summarizes both-party coverage; no RED flag generated for this clause in Module B
- Validates: A1, A3

**A-S3: Caterer contract with itemized inclusions**
- Input: Contract listing specific menu items, service staff count, setup/breakdown time, and explicitly excluded items (bar service, cake cutting)
- Expected output: `inclusions` field is a bulleted list matching the contract; `exclusions` field correctly identifies bar service and cake cutting; no invented items
- Validates: A1 (hallucination avoidance), U3

---

### Edge Cases

**A-E1: Contract with no cancellation policy**
- Input: A 4-page DJ contract with payment terms and inclusions but no cancellation or refund clause
- Expected output: `cancellation_policy` field states "Not specified in contract — no cancellation or refund terms are defined. Clarify this with the vendor before signing." Must not invent a policy.
- Validates: A3 (not-specified accuracy), U3 (hallucination avoidance)

**A-E2: Contract with two conflicting payment clauses**
- Input: Contract where Section 3 states "50% due upon signing" and Section 7 states "30% retainer required at time of booking"
- Expected output: `payment_schedule` field surfaces both clauses and explicitly flags the contradiction: "Two payment clauses conflict — verify with vendor which applies." Must not silently pick one.
- Validates: U3, A1

**A-E3: Very short informal contract (1 page)**
- Input: A 1-page email-style agreement from a mehndi artist with informal language — no section headers, no numbered clauses
- Expected output: All 8 fields attempted; fields genuinely absent from the document marked "Not specified in contract"; no fields fabricated to fill gaps
- Validates: A3, U3

**A-E4: Contract at the 25-page limit**
- Input: A 25-page venue contract with extensive appendices
- Expected output: All key clause fields extracted accurately; no truncation of meaningful content; `one_sentence_summary` still ≤ 30 words
- Validates: A1, A4, performance (60-second SLA)

**A-E5: Payment schedule with percentage-only amounts (no dollar figures)**
- Input: Contract states "35% retainer due at signing; 65% due 30 days prior" with no absolute dollar amounts
- Expected output: `payment_schedule` accurately reports the percentages and timeline. Must not invent dollar amounts based on assumed contract value.
- Validates: U3

**A-E6: Partial extraction — confidence indicator required**
- Input: A contract where the payment schedule is clearly stated but liability and force majeure clauses are buried in vague boilerplate that could apply to either topic
- Expected output: Clearly extractable fields are populated normally; ambiguous fields include an explicit signal such as "This clause is unclear — it may address liability but the language is ambiguous. Review with the vendor before signing." Must not present an uncertain extraction with the same confidence as a clear one.
- Validates: PRD Section 9.5 — "AI outputs must include a confidence or completeness indicator so users know when to double-check"

---

### Negative Cases

**A-N1: Image-based or scanned PDF (no extractable text)**
- Input: PDF.co returns empty or near-empty text (under 100 characters) from a scanned contract image
- Expected output: All summary fields state "Contract text could not be extracted — the uploaded PDF may be a scanned image. Please upload a text-based PDF or retype the key terms manually." Must not generate a summary from noise.
- Validates: U3, graceful degradation requirement (PRD Section 9.5)

**A-N2: Non-wedding vendor document uploaded**
- Input: User uploads a lease agreement, employment contract, or NDA
- Expected output: System completes the summary using available fields but flags clearly: "This document does not appear to be a wedding vendor contract. Some fields may not be applicable." Must not refuse — the summary may still be useful.
- Validates: U4 (scope discipline), U3

**A-N3: Contract in a mix of English and another language (e.g., Hindi transliteration)**
- Input: Contract body is primarily English but several clauses are written in Romanized Hindi or Punjabi
- Expected output: English clauses are summarized normally; non-English clauses are flagged as "Clause present but written in a language other than English — review manually." Must not translate or guess.
- Validates: U3

---

## Module B — Traffic Light Clause Flagging

### Standard Cases

**B-S1: Photographer contract — 100% cancellation forfeiture within 90 days**
- Input: "Cancellation by Client within 90 days of event date shall result in forfeiture of 100% of the total contract value."
- Expected output: `rating: "RED"`, explanation cites the full forfeiture risk and the absence of a sliding scale, `market_norm_benchmark` references that most Indian wedding photographer contracts use a sliding scale (e.g., 50% within 90 days, 100% within 30 days)
- Validates: B1, B2 (RED flag not missed)

**B-S2: Venue contract — standard mutual force majeure**
- Input: Contract includes "Neither party shall be liable for failure to perform due to circumstances beyond reasonable control, including acts of God, government action, or public health emergencies."
- Expected output: `rating: "GREEN"`, explanation confirms the clause is mutual and covers standard categories
- Validates: B1 (no over-flagging of green clauses)

**B-S3: Caterer contract — overtime clause present but vague**
- Input: "Additional time beyond the agreed service period may incur additional charges at the caterer's discretion."
- Expected output: `rating: "YELLOW"`, explanation flags that the rate is unspecified and "at the caterer's discretion" gives the client no certainty, `market_norm_benchmark` states that standard catering contracts specify an hourly overtime rate
- Validates: B1, B3

**B-S4: Entertainment contract (DJ/Band) — missing overtime clause**
- Input: DJ contract covering a Sangeet with a 4-hour service window; no mention of overtime policy
- Expected output: `rating: "RED"` for the overtime clause; explanation notes that Sangeet events routinely run long and a DJ with no stated overtime rate creates open-ended cost exposure; `market_norm_benchmark` references that standard DJ contracts in the Indian wedding market specify an hourly overtime rate, typically $150–$300/hour
- Validates: B1, B2 — covers the entertainment vendor category explicitly required by PRD Section 7.1.2 (top 5: venue, photographer, caterer, décor, entertainment)

---

### Edge Cases

**B-E1: Contract missing force majeure — venue**
- Input: 15-page venue contract with no force majeure clause anywhere
- Expected output: Force majeure flag has `missing: true`, `rating: "RED"`, explanation notes the specific risk for a venue (weather events, capacity restrictions, sudden closure). Risk score must be at minimum MEDIUM.
- Validates: B2, B4 (risk score consistency)

**B-E2: Upfront payment >50% of contract value**
- Input: Decorator contract requiring 60% deposit at signing
- Expected output: `rating: "RED"`, explanation flags that 60% upfront significantly exceeds the 25–30% market norm for decorators, `market_norm_benchmark` cites typical deposit range
- Validates: B1, B2

**B-E3: All clauses present and standard — all GREEN**
- Input: Well-drafted photographer contract with mutual cancellation sliding scale, force majeure, clear inclusions/exclusions, stated overtime rate, liability insurance
- Expected output: All flags GREEN; `overall_risk_score: "LOW"`; `risk_rationale` confirms this is a well-structured contract. Must not manufacture YELLOW flags to appear thorough.
- Validates: B4, U4 (scope discipline — no over-flagging)

**B-E4: Liability cap below contract value**
- Input: $18,000 photography contract where the liability clause caps the photographer's liability at $500
- Expected output: `rating: "RED"`, explanation notes that a $500 liability cap on an $18,000 contract provides essentially no recourse if the photographer fails to deliver
- Validates: B1, B2

**B-E5: Vendor category mismatch in flag logic**
- Input: Pandit (priest) contract uploaded as vendor category "Photographer"
- Expected output: Flags are generated based on the actual contract content; system may note "This contract does not appear to be for a photographer — benchmarks have been applied based on the contract content rather than the selected category." Must not apply photographer-specific norms to a Pandit contract.
- Validates: U3, B3

---

### Negative Cases

**B-N1: Same clause rated differently by the same prompt on two runs (consistency)**
- Input: Identical contract, run twice at temperature 0.3
- Expected output: Flag ratings must be identical across both runs. Any difference in GREEN / YELLOW / RED for the same clause = regression in prompt determinism.
- Validates: B1, prompt stability (temperature setting rationale)

**B-N2: Contract with a clause that is unusual but favorable to the client**
- Input: Caterer contract where cancellation by the caterer within 60 days triggers a 150% refund (penalty paid to client)
- Expected output: Flag as GREEN or note as unusually favorable. Must not flag as RED simply because it is unusual. Explanation must acknowledge it benefits the client.
- Validates: B1 (directional accuracy matters, not just detection of unusual terms)

---

## Module C — AI Vendor Negotiation Response Drafting

### Standard Cases

**C-S1: RED cancellation clause — professional tone, no style profile**
- Input: Flagged clause = cancellation forfeiture within 90 days; tone = "professional"; no style profile
- Expected output: Email opens without "I hope this email finds you well"; names the specific clause; proposes a sliding scale alternative (e.g., 50% within 90 days, 100% within 30 days); closes collaboratively; `key_ask` field is one clear sentence
- Validates: C1, C2, C4

**C-S2: YELLOW overtime clause — warm tone, with style profile**
- Input: Flagged clause = unspecified overtime rate; tone = "warm"; style profile = "Short sentences. Addresses vendors by first name. Never uses the word 'kindly'. Mentions excitement about the wedding."
- Expected output: Email uses short sentences; addresses vendor by first name; does not contain the word "kindly"; expresses warmth about the wedding; raises the specific concern about overtime
- Validates: C2, C3, C1

**C-S3: Missing force majeure — formal tone**
- Input: Flagged clause = force majeure missing; tone = "formal"; no style profile
- Expected output: Structured paragraphs; full names used (not first names); contract referenced formally; requests addition of a mutual force majeure clause with specific examples (illness, weather, government restriction)
- Validates: C1, C2

---

### Edge Cases

**C-E1: Style profile that explicitly prohibits certain phrases**
- Input: Style profile = "Never start an email with 'I'. Never use 'hope'. Never use 'kindly'. Never use 'please find attached'."
- Expected output: Email body starts with the vendor's name or a statement, not "I"; none of the four prohibited phrases appear anywhere in the output
- Validates: C3 (zero violations of explicit style rules)

**C-E2: GREEN clause — user requests a draft anyway**
- Input: User clicks "Draft Response" on a GREEN-rated clause (e.g., a fair cancellation policy they simply want to confirm in writing)
- Expected output: System generates a confirmation email (not a negotiation email) that acknowledges the clause and asks the vendor to confirm the terms are as summarized. Must not generate a combative negotiation email for a GREEN clause.
- Validates: C1, U4

**C-E3: Multiple RED flags in the same contract — only one selected**
- Input: Contract has three RED flags; user clicks Draft Response on the force majeure gap only
- Expected output: Email addresses only the force majeure clause. Does not bundle the other two RED flags into the same email unless the user requests it.
- Validates: U4 (scope discipline)

**C-E4: Very short style profile (1 sample sentence)**
- Input: Style profile = "Keep it brief."
- Expected output: System generates a concise email (under 150 words); does not refuse due to insufficient style data; does not invent additional style rules
- Validates: C3, graceful degradation

---

### Negative Cases

**C-N1: Draft email that is overly aggressive or adversarial**
- Input: Flagged RED clause = 100% forfeiture; any tone setting
- Expected output: Email must not open with accusations, demands, or ultimatums. It must open warmly and frame the request as standard market practice. Any output that would embarrass a professional planner if sent = failure.
- Validates: C2, C4

**C-N2: Draft email contains a hallucinated clause or market statistic**
- Input: Any flagged clause
- Expected output: Email must not cite a specific percentage, dollar amount, or industry standard that was not present in the contract text or in the master prompt's flag rules. "Most contracts in this category include..." is acceptable; "According to the 2024 Indian Wedding Vendor Association guidelines, the standard is..." is a hallucination unless sourced.
- Validates: U3

---

## Module D — Post-Signing Obligation Extraction

### Standard Cases

**D-S1: Photographer contract with three clear payment deadlines**
- Input: Contract with 30% at signing (date calculable from context), 40% due 60 days before wedding (October 18, 2026), 30% due 7 days before
- Expected output: Three payment obligations; calculated dates = signing date, August 19 2026, October 11 2026; all categorized as "payment"; all assigned to "client"
- Validates: D1, D2, D3

**D-S2: Venue contract with vendor obligations (deliverables due to client)**
- Input: Venue contract requiring venue to provide final floor plan 30 days before event, confirm catering headcount 14 days before, and provide parking details 7 days before
- Expected output: Three vendor-side obligations correctly assigned `party: "vendor"`; dates calculated correctly; categories assigned appropriately ("delivery", "confirmation", "logistics")
- Validates: D1, D3

**D-S3: Obligation extraction includes payment amounts, not just dates**
- Input: Photographer contract with three staged payments: "$3,000 due at signing", "$4,500 due 60 days before the event", "$2,500 due 7 days before the event"
- Expected output: Each obligation record captures both the `due_date` (calculated) and the specific dollar amount in the `description` field (e.g., "Pay $4,500 to photographer — second installment"); no amount is omitted or rounded; total sums to contract value
- Validates: PRD Section 7.1.4 acceptance criteria — ">95% accuracy on payment dates and amounts"

**D-S4: Reminder intervals set correctly on all obligations**
- Input: Any contract with at least two clearly dated payment obligations
- Expected output: Every obligation record has `reminder_days_before: [14, 7, 1]`; no obligation is missing the reminder array; no reminder array contains different values unless the contract specifies its own reminder schedule
- Validates: PRD Section 7.1.4 — "Automated reminders are sent 14 days, 7 days, and 1 day before each obligation deadline"

---

### Edge Cases

**D-E1: Relative date that cannot be resolved**
- Input: Contract states "final payment due upon completion of service" with no date anchor
- Expected output: `due_date: null`; `due_date_note` quotes the exact contract language; reminder logic not applied; obligation still extracted and listed
- Validates: D2 (graceful null handling), D1

**D-E2: Two obligations due on the same date**
- Input: Contract with both a payment deadline and a guest headcount confirmation due 14 days before the event
- Expected output: Both obligations appear as separate records with the same calculated `due_date`; neither is collapsed or omitted
- Validates: D1

**D-E3: Obligation buried in a footnote or appendix**
- Input: Main contract body has standard payment terms, but Appendix B contains a clause: "Client shall provide final song list no later than 21 days prior to event"
- Expected output: Song list obligation extracted and categorized as "logistics" or "delivery"; not missed because it appears outside the main contract body
- Validates: D1

**D-E4: Contract with no time-bound obligations**
- Input: A very basic 1-page DJ contract with a flat fee, no specified payment date, and no deadlines
- Expected output: `obligations` array is empty; `total_client_obligations: 0`; `next_deadline` is null; no obligations invented. System notes "No time-bound obligations were identified in this contract — confirm payment and deadline terms directly with the vendor."
- Validates: D1, U3

---

### Negative Cases

**D-N1: Obligation attributed to wrong party**
- Input: Contract clause: "Vendor shall deliver final edited photos within 90 days of the event date"
- Expected output: `party: "vendor"` — not "client." This is a vendor deliverable, not a client obligation.
- Validates: D3

**D-N2: Date invented for an ambiguous obligation**
- Input: Contract states "balance due before the event" with no specific date or number of days
- Expected output: `due_date: null`; `due_date_note` quotes "balance due before the event." Must not calculate a date based on assumptions (e.g., "I'll assume 7 days before").
- Validates: U3, D2

---

## Module E — Vendor Outreach Draft

### Standard Cases

**E-S1: Caterer outreach — Sangeet, 180 guests, known venue, halal requirement**
- Input: vendor_category = "Caterer", event_name = "Sangeet", event_date = "October 17 2026", guest_count = 180, venue_name = "The Hazel Banquet Hall", budget_range = "$18,000–$22,000", specific_requirements = "Full halal menu required", tone = "professional", no style profile
- Expected output: Email names the event (Sangeet), date, headcount, venue, budget range, and halal requirement explicitly; asks for availability and a quote; does not use "kindly" or "I hope this email finds you well"
- Validates: E1, E2, E3

**E-S2: Mehndi artist outreach — with planner style profile**
- Input: vendor_category = "Mehndi Artist", event_name = "Mehndi Ceremony", event_date = "October 16 2026", guest_count = 90, venue_name = "Private residence", budget_range = "$2,500–$3,500", specific_requirements = "", tone = "warm", style_profile = "Warm and personal. Uses the couple's names. Short paragraphs. Signs off with 'Warmly, Priya'."
- Expected output: Email references the couple by name; short paragraphs; warm opening; "Warmly, Priya" sign-off or similar; mentions Mehndi ceremony context (not just "henna event")
- Validates: E1, E2, C3 (style profile adherence)

---

### Edge Cases

**E-E1: Venue not yet confirmed**
- Input: venue_name = "" (empty)
- Expected output: Email notes that the venue is still being finalized and asks whether the vendor works with multiple venues or requires venue confirmation before quoting; does not invent a venue name
- Validates: E1, U3

**E-E2: Budget not yet set**
- Input: budget_range = "" (empty)
- Expected output: Email requests a quote without specifying a budget range; adds a note asking the vendor to share their starting package rates; does not invent a budget figure
- Validates: E1, U3

**E-E3: Outreach to a vendor category specific to Indian weddings (Pandit)**
- Input: vendor_category = "Pandit", event_name = "Wedding Ceremony", cultural_context = "North Indian Hindu"
- Expected output: Email uses appropriate terminology (Pandit, not "officiant" or "priest"); references the ceremony context correctly; asks about availability for the full ceremony duration
- Validates: E2 (Indian wedding context relevance)

**E-E4: Very specific special requirements**
- Input: specific_requirements = "Vegan menu only. No onion or garlic (Jain dietary requirement). All food must be prepared in a certified Jain kitchen."
- Expected output: All three requirements appear explicitly in the email body; none are omitted or generalized as "dietary restrictions"
- Validates: E1

**E-E5: Vendor formality adjustment by category — luxury venue vs. entertainment**
- Input (run 1): vendor_category = "Venue", venue_name = "The Fairmont Royal York", tone = "professional", no style profile
- Input (run 2): vendor_category = "DJ", venue_name = "The Hazel Banquet Hall", tone = "professional", no style profile
- Expected output: Venue email is more formal in structure and vocabulary — full sentences, no contractions, formal close. DJ email is more conversational while remaining professional — shorter sentences, less formal register. Same `tone` setting produces different formality based on vendor category.
- Validates: PRD Section 7.3 — "Vendor-type awareness adjusts formality automatically — more formal for luxury venues, more casual for entertainment vendors"

---

### Negative Cases

**E-N1: Email contains information not provided in the input**
- Input: venue_name = "" (not provided)
- Expected output: Must not name a venue. Any venue reference is a hallucination.
- Validates: U3

**E-N2: Email does not include a call to action**
- Input: Any standard outreach input
- Expected output: Email must close with a specific ask — availability confirmation, quote request, or discovery call. An email that ends with "Looking forward to connecting" with no actionable next step = fail.
- Validates: E3

---

## Module F — AI Budget Advisor

### Standard Cases

**F-S1: Florals over budget — photography is top priority**
- Input: total_budget = "$265,000"; variance_event = "Reception Florals"; variance_amount = "$4,000 over budget"; couple_priorities = "Photography is most important to us. We want to remember every moment. We're flexible on florals and décor."
- Expected output: No suggestion reduces photography budget; at least one suggestion reduces floral/décor allocation; `priority_alignment` on the photography-reducing option must be "low" (it should not appear as `recommended_option`)
- Validates: F1, F3

**F-S2: Catering over budget — no stated priorities**
- Input: variance_event = "Wedding Reception Catering"; variance_amount = "$8,000 over budget"; couple_priorities = "" (not set)
- Expected output: 2–3 reallocation suggestions across different event categories; no assumption about couple's priorities; each `trade_off` field is specific and actionable, not generic
- Validates: F2, F3

---

### Edge Cases

**F-E1: Variance in a stated priority category**
- Input: variance_event = "Photography"; variance_amount = "$5,000 over budget"; couple_priorities = "Photography is our top priority."
- Expected output: Budget advisor acknowledges the tension explicitly — the over-budget item is the couple's stated priority. Suggestions may include reallocation from other categories to cover the photography overage, rather than suggesting a photography cut. Must not recommend reducing photography.
- Validates: F1

**F-E2: Variance that exceeds available slack in all other categories**
- Input: All non-priority categories already at or over their allocations; only photography has slack but it's a stated priority
- Expected output: System states explicitly "There is limited reallocation room within the current budget to cover this variance without affecting stated priorities. Consider whether the overall budget ceiling can be adjusted, or which trade-offs are acceptable." Must not invent budget headroom that doesn't exist.
- Validates: F2, U3

**F-E3: Multiple simultaneous variances**
- Input: Two events both over budget (Sangeet décor $2,000 over; Reception catering $6,000 over)
- Expected output: Advice addresses both variances; suggestions must be coherent — reallocation amounts across both variances must not double-count the same budget slack
- Validates: F2

---

### Negative Cases

**F-N1: Reallocation suggestion reduces a stated priority**
- Input: couple_priorities = "Florals are extremely important to us — our families expect a stunning look."
- Expected output: `reallocation_from` must never reference florals in any suggestion. This is F1, the hardest failure mode: the AI recommending the couple cut what they've said matters most destroys trust.
- Validates: F1

**F-N2: Suggested reallocation amount exceeds available budget in that category**
- Input: Sangeet décor budget = $5,000; Sangeet décor actual spend = $4,800; variance in another event = $3,000
- Expected output: System must not suggest reallocating $3,000 from Sangeet décor when only $200 of slack remains. Arithmetic must be validated against actual allocations.
- Validates: F2

---

## Module G — Natural Language Guest List Import

### Standard Cases

**G-S1: Clean WhatsApp message dump**
- Input: "Priya Sharma (bride's masi) - all events\nRaj and Sunita Mehta (groom's parents' friends) - ceremony and reception only\nAmit Singh + 1 - sangeet and reception"
- Expected output: Three records (Priya, Raj & Sunita as a family unit, Amit); event tags populated from the message; Amit's plus_one = true; family_side populated where stated
- Validates: G1, G2

**G-S2: Copied spreadsheet rows with mixed formatting**
- Input: "1. Kavya Nair | Bride's college friend | Sangeet, Ceremony, Reception\n2. The Patel Family (4 people) | Groom's neighbors\n3. Dr. Arjun Reddy | Colleague"
- Expected output: Kavya extracted as individual with event tags; Patel Family extracted as a unit with `needs_expansion: true` and a note to clarify individual names; Dr. Arjun Reddy extracted with no assumed events
- Validates: G1, G2

---

### Edge Cases

**G-E1: Duplicate entries in different formats**
- Input: "Rahul Sharma\nRahul S.\nRahul (Priya's cousin)"
- Expected output: All three extracted as individual records; at least two flagged as potential duplicates of each other in `potential_duplicates` with a reason; not collapsed into one record (the user confirms merges)
- Validates: G3

**G-E2: Very large list (100+ names)**
- Input: 120 names in mixed formats — some with event tags, some with relationships, some with just names
- Expected output: All 120+ guests extracted; `total_extracted` count is accurate; `flagged_for_review` count is non-zero (reasonable given mixed data quality); no entries silently dropped
- Validates: G1

**G-E3: International names with varied formats**
- Input: Mix of South Indian names (single name, no surname), Punjabi names (common shared surnames like Singh/Kaur), and anglicized Indian names
- Expected output: Names extracted exactly as written; no normalization or anglicization applied; no relationship or family_side invented based on name patterns alone
- Validates: G2

**G-E4: List with family units rather than individuals**
- Input: "Kumar Family (6 guests)\nThe Iyers\nMr. & Mrs. Sharma and their two kids"
- Expected output: All three extracted as family units with `needs_expansion: true`; estimated headcount noted where given (Kumar Family = 6); `total_extracted` reflects unit count, not headcount
- Validates: G1, G2

---

### Negative Cases

**G-N1: No names present in input**
- Input: "Please invite everyone from the Sangeet to the reception too. Also add the people from last year."
- Expected output: No guest records generated; output notes "No identifiable guest names were found in this input. Please paste a list that includes names." Must not invent names.
- Validates: U3, G2

**G-N2: Input that mixes guests from two different weddings**
- Input: User accidentally pastes a guest list that includes a header "Riya & Dev's Wedding" partway through
- Expected output: All names extracted; system flags "This list may contain guests from multiple weddings — please review before importing." Does not selectively import only one wedding's guests.
- Validates: G1, U4

---

## Module H — Cultural Wedding Setup Interview

### Standard Cases

**H-S1: North Indian Hindu wedding — straightforward setup**
- Input sequence: Both sides Hindu; North Indian; 6 events expected; 320 guests; full-service planner; Toronto; venues TBD
- Expected output: Event list = Mehndi, Haldi, Sangeet, Baraat, Wedding Ceremony (Mandap/Saat Phere), Reception; vendor checklist includes Pandit, mandap decorator, dhol player for Baraat; cultural notes reference North Indian traditions accurately
- Validates: H2, H1

**H-S2: Punjabi Sikh wedding**
- Input sequence: Both sides Sikh; 4 events expected; 400 guests; Gurdwara ceremony; self-managing couple
- Expected output: Ceremony listed as "Anand Karaj" — not "Wedding Ceremony" or "Saat Phere"; vendor checklist includes Granthi (not Pandit); cultural note flags Gurdwara booking requirements and lead time; no Baraat listed without qualification
- Validates: H2 (critical: Sikh-specific terminology must be correct)

---

### Edge Cases

**H-E1: Interfaith couple (Sikh bride, Hindu groom)**
- Input sequence: Bride is Punjabi Sikh; groom is Telugu Hindu; both families want their traditions represented; couple wants one ceremony
- Expected output: AI surfaces the complexity explicitly — two distinct ceremony traditions with different officiants, different vows, different structure; proposes options (sequential ceremonies, blended ceremony with both Granthi and Pandit, one tradition honored at ceremony and the other at a separate ritual); does not default to one tradition; asks the couple which family is leading the ceremony planning
- Validates: H2, H1

**H-E2: Non-traditional couple (no religious ceremony)**
- Input sequence: Couple wants a civil ceremony only; South Asian cultural celebrations (Mehndi, Sangeet, Reception) but no religious ceremony; family is traditional but couple is firm
- Expected output: Event list excludes Baraat and religious ceremony; includes Mehndi, Sangeet, Reception; cultural note acknowledges this is a valid and increasingly common choice; does not push the couple toward a religious ceremony; notes that families may raise questions and offers to help frame the planning conversation
- Validates: H2, H1

**H-E3: Couple unsure about which events to include**
- Input sequence: Couple says "we're not sure if we want a Haldi — my family thinks it's old-fashioned"
- Expected output: AI explains what a Haldi involves, typical duration and guest count, venue requirements, and cost range; frames it as a decision the couple can make; does not assume it should be included or excluded; asks if they'd like it included as optional while they decide
- Validates: H1, H3

**H-E4: Tamil Hindu wedding**
- Input sequence: Both sides Tamil Hindu; 5 events; 250 guests; Chennai-heritage families in New Jersey
- Expected output: Event list reflects Tamil Hindu traditions — includes Nichayathartham (engagement ritual), Kashi Yatra, Oonjal (swing ceremony) if applicable; does not default to North Indian structure (no Baraat framing, correct ceremony terminology); vendor checklist includes Carnatic musician and relevant temple coordination notes
- Validates: H2

---

### Negative Cases

**H-N1: Using Saat Phere for a Sikh couple**
- Input: Couple identifies as Sikh
- Expected output: The phrase "Saat Phere" must not appear anywhere in the structured output. The ceremony is the Anand Karaj. The officiant is a Granthi, not a Pandit. Any output using the wrong terminology = critical failure.
- Validates: H2 (blocking failure mode F4 from evals.md)

**H-N2: Couple provides contradictory information**
- Input sequence: Couple says "we're having a Hindu ceremony" then later says "our Granthi is already booked"
- Expected output: AI flags the inconsistency directly — "You mentioned a Hindu ceremony earlier, but a Granthi typically officiates Sikh ceremonies. Could you clarify which tradition your ceremony will follow?" Must not silently pick one or produce a blended output without flagging the contradiction.
- Validates: H1, U2

**H-N3: Interview completes but structured output produced prematurely**
- Input: Couple has answered only 2 of 6 topic areas (cultural background and event count, but not date, location, guest count, or planner situation)
- Expected output: AI must not produce the structured output (event list, vendor checklist, cultural notes) until sufficient information is gathered. Must continue the interview with the remaining topics.
- Validates: H1, H3

---

## Cross-Module Edge Cases

These test cases span multiple modules and validate system-level behavior.

**X-1: Parent role attempts to access contract details**
- Input: User role = "parent"; user navigates to contract review section
- Expected output: System returns simplified budget and event status only; no contract clause content, flag ratings, or negotiation drafts exposed; no error — graceful role-based restriction
- Validates: Core system prompt role rules

**X-2: Couple role — same contract, different tone in Module C**
- Input: Same RED flagged clause; first run with role = "planner"; second run with role = "couple"
- Expected output: Planner draft is more direct and peer-to-peer; couple draft is warmer and includes slightly more context about why the clause matters. Both address the same clause. Neither should be adversarial.
- Validates: Core system prompt persona differentiation, C2

**X-3: Planner style profile not yet set up**
- Input: role = "planner"; style_profile field is empty string
- Expected output: System defaults to professional neutral tone; does not fail, refuse, or ask the planner to set up a profile mid-task; output is still high quality without the profile
- Validates: Graceful degradation, C3

**X-4: Same contract processed by Module A and Module B independently**
- Input: Identical contract text sent to both Module A (summary) and Module B (flagging) as separate calls
- Expected output: The clause text summarized in Module A must be consistent with the clause evaluated in Module B. A clause rated RED in Module B must not be described as "standard" in Module A's summary.
- Validates: Cross-module consistency, U3

---

## Performance SLA Test Cases

PRD Section 9.1 defines two AI-specific response time targets. These cannot be validated through prompt testing alone — they require end-to-end timing measurements in the integrated Bubble + Make + Claude API environment.

| SLA | Target | How to Test |
| --- | --- | --- |
| Contract summary generation | ≤ 60 seconds from PDF upload to structured output | Time the full pipeline: PDF.co extraction + Module A Claude call + Module B Claude call. Test at 5, 15, and 25 pages. |
| Response draft generation | ≤ 10 seconds from "Draft Response" click to output | Time the Module C Claude call in isolation. Measure across all three tone settings. |

These are infrastructure and API latency tests, not prompt correctness tests. Run them after the Make automation pipeline is built, not during prompt development.

---

## Golden Test Set Minimum Requirements

Based on the use cases above, the minimum test set for pre-launch validation is:

| Asset | Count | Covers |
| --- | --- | --- |
| Real vendor contracts (varied categories) | 10 | A-S1, A-S2, A-S3, A-E4, B-S1–B-S4, B-E3, B-E4 |
| Synthetic contracts with known RED flags | 5 | B-S1, B-E1, B-E2, B-E4, D-N1 |
| Contracts with missing or ambiguous sections | 4 | A-E1, A-E3, A-E6, D-E4 |
| Contracts with staged payment schedules | 3 | D-S1, D-S3, D-S4 |
| Guest list raw inputs (varied formats) | 5 | G-S1, G-S2, G-E1, G-E2, G-E4 |
| Budget scenarios with stated priorities | 3 | F-S1, F-E1, F-N1 |
| Cultural interview transcripts | 4 | H-S1, H-S2, H-E1, H-E4 |
| Style profiles for response drafting | 3 | C-S2, C-E1, C-E4 |
| Scanned / degraded PDFs | 2 | A-N1 |
| Vendor outreach pairs (formality contrast) | 1 pair | E-E5 |

---

*Last updated: April 2026 | Author: Varun Maryada*
*Companion documents: Design/master\_prompt\_v1.md, Design/evals.md*
