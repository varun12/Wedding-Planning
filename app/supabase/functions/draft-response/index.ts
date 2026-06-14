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
    const { flag, vendorName, vendorCategory } = await req.json();

    if (!flag || !vendorName) {
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

Your task is to draft a professional vendor negotiation email addressing a specific flagged clause in a 
wedding vendor contract. You write on behalf of the couple or their planner.

## Tone guidelines
- professional: Confident, direct, peer-to-peer. Short sentences. First names. No "kindly" or "I hope 
this email finds you well."
- Always warm and collaborative — this is a wedding relationship, not a lawsuit.
- Never adversarial in the opening. Lead with appreciation for the partnership opportunity.

## Email structure
1. Open warmly — express genuine interest in working together
2. Name the specific clause and what the concern is
3. Reference that the request aligns with market standards — without being condescending
4. Propose a specific alternative clause or ask an open-ended question if the right alternative depends 
on the vendor's response
5. Close collaboratively — signal the desire to move forward

## Rules
- Return only the plain email text — no JSON, no subject line label, no markdown formatting.
- Be specific to the flagged clause — do not write a generic negotiation email.
- Keep it concise — no more than 200 words.`;

    const userMessage = `Draft a vendor negotiation email for the following:

Vendor: ${vendorName} (${vendorCategory})
Flagged clause: "${flag.clause}"
Risk level: ${flag.rating}
Issue: ${flag.explanation}
Market benchmark: ${flag.benchmark || "Not specified"}

Write the email body only.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error [${response.status}]: ${errText}`);
    }

    const aiData = await response.json();
    const draft = aiData.content?.[0]?.text;

    return new Response(JSON.stringify({ draft }), {
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