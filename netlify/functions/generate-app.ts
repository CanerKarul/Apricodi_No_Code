
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event: any) => {
  // CORS Preflight (Ön kontrol) taleplerini yanıtla
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // Sadece POST isteklerine izin ver
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Netlify Environment Variables'tan anahtarı al
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Netlify yapılandırmasında GEMINI_API_KEY eksik." }),
      };
    }

    const requestBody = JSON.parse(event.body || "{}");
    const userPrompt = requestBody.prompt;

    if (!userPrompt) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Prompt içeriği gerekli." }),
      };
    }

    // Kesin JSON çıktısı için sistem talimatı
    const systemInstruction = "You are a professional UI/UX architect. Return ONLY a valid JSON object. No markdown backticks. No extra text. Structure: { \"appName\": \"string\", \"description\": \"string\", \"elements\": [] }";
    
    // Model: Gemini 3 Flash Preview (En hızlı ve güncel)
    const model = "gemini-3-flash-preview";
    
    // ÖNEMLİ DÜZELTME: API Key URL parametresi olarak ekleniyor
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization' başlığı tamamen kaldırıldı!
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\nUser Request: ${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Response:", data);
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    console.error("Netlify Function Crash:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Sunucu Hatası", details: err.message }),
    };
  }
};
