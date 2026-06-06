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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `You are a professional wedding planner drafting a response to a vendor about a concerning contract clause. 

Vendor: ${vendorName} (${vendorCategory})
Flagged Clause: "${flag.clause}"
Risk Level: ${flag.rating}
Issue: ${flag.explanation}
Market Benchmark: ${flag.benchmark || "N/A"}

Write a professional, warm, but firm email to the vendor addressing this specific clause. The email should:
1. Open with appreciation for the partnership opportunity
2. Reference the specific clause by name
3. Explain the concern clearly without being confrontational
4. Reference market norms where relevant
5. Propose a specific alternative or ask for discussion
6. Close warmly

Keep the tone professional but accessible — this is for a wedding, not a lawsuit. Return ONLY the email text, no JSON wrapping.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error [${response.status}]: ${errText}`);
    }

    const aiData = await response.json();
    const draft = aiData.choices?.[0]?.message?.content;

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
