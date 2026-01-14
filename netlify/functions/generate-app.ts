const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event: any) => {
  // 1. CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  // 2. Sadece POST'a izin ver
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // 3. Anahtarı al (Netlify Panelindeki isimle BURADAKİ isim AYNI OLMALI)
    const apiKey = process.env.API_KEY; 
    
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "API Key eksik (Netlify Ayarlarını kontrol et)." }) };
    }

    const requestBody = JSON.parse(event.body || "{}");
    const userPrompt = requestBody.prompt;

    // 4. Gemini URL'si (ANAHTAR BURAYA EKLENİYOR - HEADER'A DEĞİL)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // DİKKAT: Authorization satırı BURADA YOK. Sildik.
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      }),
    });

    const data = await response.json();
    
    return {
      statusCode: response.ok ? 200 : response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

  } catch (err: any) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
