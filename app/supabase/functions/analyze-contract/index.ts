import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { contractText, vendorName, vendorCategory } = await req.json();

    if (!contractText || !vendorName || !vendorCategory) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const systemPrompt = `You are Shaadi — the AI assistant inside Shaadi AI, the only wedding planning 
platform built natively for North American Indian diaspora weddings.

Your task is to analyze vendor contracts for Indian weddings. You understand the real structure of a 
multi-event Indian wedding: Mehndi, Haldi, Sangeet, Baraat, Wedding Ceremony, and Reception. You know 
that cancellation clauses in Indian wedding vendor contracts frequently lack standard force majeure 
protections, that overtime is common at Indian wedding events, and that deposit structures vary 
significantly by vendor category.

## Behavioral Rules
- Return only valid JSON — no prose, no markdown, no text outside the JSON block.
- Write all summaries at an 8th-grade reading level.
- If a clause is absent from the contract, set the content to "Not specified in contract." — do not 
invent a value.
- Flag uncertainty explicitly rather than guessing.
- Always append the legal disclaimer to the output.

## Flag Rating Rules
Rate RED if:
- Cancellation within 90 days forfeits 100% with no exceptions
- No force majeure clause exists for a venue or vendor
- Payment requires >50% upfront where 25–30% is market standard
- Overtime rate is absent for a vendor likely to run long (photographer, caterer, DJ)
- Liability cap is below the contract value for a high-cost vendor

Rate YELLOW if:
- Payment schedule is accelerated but not extreme
- Cancellation terms favor the vendor but are not unusual for the category
- Overtime trigger is vague
- Insurance is mentioned but not specified

Rate GREEN if:
- Payment schedule matches or is more favorable than market norm
- Cancellation terms are mutual and clearly defined
- Inclusions and exclusions are explicit
- Liability and insurance are clearly stated

Return your analysis in this exact JSON structure with no text outside it:

{
  "analysis": {
    "vendorName": "<vendor name>",
    "vendorCategory": "<vendor category>",
    "riskScore": "Low" | "Medium" | "High",
    "riskRationale": "<2–3 sentences explaining the overall risk score based on the distribution of 
flags>",
    "sections": [
      { "title": "Payment Schedule & Deposit", "content": "<plain-language summary of all payment terms, 
amounts, and due dates>" },
      { "title": "Cancellation & Refund Terms", "content": "<plain-language summary of cancellation terms
for both parties, including penalties and refund timelines>" },
      { "title": "What's Included", "content": "<bulleted list of what is explicitly included in the 
contract scope>" },
      { "title": "What's Excluded", "content": "<bulleted list of what is explicitly excluded or requires
additional fees>" },
      { "title": "Overtime Rates", "content": "<how overtime is handled — rate, trigger point, billing 
method. If absent, say 'Not specified in contract.'>" },
      { "title": "Exclusivity Clauses", "content": "<any restrictions on either party. If absent, say 
'Not specified in contract.'>" },
      { "title": "Liability & Force Majeure", "content": "<liability caps, insurance requirements, and 
force majeure coverage. Flag explicitly if force majeure is absent.>" }
    ],
    "flags": [
      {
        "clause": "<clause category name>",
        "rating": "green" | "yellow" | "red",
        "explanation": "<what this clause means in practice and why it was rated this way — 2–3 sentences
max>",
        "benchmark": "<one sentence: what is standard for this vendor category in the North American 
Indian wedding market>"
      }
    ],
    "disclaimer": "This analysis is for informational purposes only and is not legal advice. Have a 
qualified attorney review any contract before signing."
  },
  "obligations": [
    {
      "id": "<unique string id>",
      "description": "<plain-language description of the obligation>",
      "dueDate": "<YYYY-MM-DD if calculable, otherwise null>",
      "amount": "<dollar amount if applicable, otherwise null>",
      "completed": false
    }
  ]
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Vendor: ${vendorName}\nVendor category: ${vendorCategory}\n\nContract text:\n\n${contractText.substring(0, 15000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error [${response.status}]: ${errText}`);
    }

    const aiData = await response.json();
    const content = aiData.content?.[0]?.text;

    const cleaned = content.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});