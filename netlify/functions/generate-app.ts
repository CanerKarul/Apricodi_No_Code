
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event: any) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY on Netlify environment" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const userPrompt = body.prompt;
    
    if (!userPrompt || typeof userPrompt !== "string") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    // Sistem talimatını prompt içine gömerek kesin JSON çıktısı alıyoruz
    const systemInstruction = "You are a professional software architect. Return ONLY a valid JSON object. No conversational text. Structure: { appName: string, description: string, elements: Array }";
    const fullPrompt = `${systemInstruction}\n\nUser Request: ${userPrompt}`;

    // Gemini API - API KEY ile çalışan doğru REST endpoint (Sorgu parametresi ile)
    const model = "gemini-3-flash-preview"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const upstream = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
        // ÖNEMLİ: Authorization header'ı kaldırıldı
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }),
    });

    const data = await upstream.json();

    return {
      statusCode: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Function crash", details: String(err) }),
    };
  }
};
