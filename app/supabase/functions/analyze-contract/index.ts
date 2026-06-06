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

    // Use Lovable AI gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are an AI contract analyst specializing in South Asian wedding vendor contracts in North America. 
Analyze the following vendor contract and return a JSON response with this exact structure:

{
  "analysis": {
    "vendorName": "${vendorName}",
    "vendorCategory": "${vendorCategory}",
    "riskScore": "Low" | "Medium" | "High",
    "riskRationale": "Brief explanation of overall risk",
    "sections": [
      { "title": "Payment Schedule & Deposit", "content": "..." },
      { "title": "Cancellation & Refund Terms", "content": "..." },
      { "title": "What's Included", "content": "..." },
      { "title": "What's Excluded", "content": "..." },
      { "title": "Overtime Rates", "content": "..." },
      { "title": "Exclusivity Clauses", "content": "..." },
      { "title": "Liability & Force Majeure", "content": "..." }
    ],
    "flags": [
      {
        "clause": "Brief clause name",
        "rating": "green" | "yellow" | "red",
        "explanation": "Why this clause is flagged",
        "benchmark": "What is typical in Indian wedding market"
      }
    ]
  },
  "obligations": [
    {
      "id": "unique-id",
      "description": "Obligation description",
      "dueDate": "YYYY-MM-DD",
      "amount": "$X,XXX or null",
      "completed": false
    }
  ]
}

Write all summaries at an 8th-grade reading level. Be specific about Indian wedding market norms.
For flags, compare against typical terms for ${vendorCategory} vendors serving Indian weddings in North America.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this contract:\n\n${contractText.substring(0, 15000)}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error [${response.status}]: ${errText}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

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
