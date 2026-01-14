
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event: any) => {
  // CORS Preflight isteklerini karşıla
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // Sadece POST isteklerini kabul et
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
      console.error("Environment Error: GEMINI_API_KEY is not defined in Netlify settings.");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Sunucu yapılandırma hatası: API Anahtarı bulunamadı." }),
      };
    }

    const requestBody = JSON.parse(event.body || "{}");
    const userPrompt = requestBody.prompt;

    if (!userPrompt) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Prompt içeriği zorunludur." }),
      };
    }

    // UI/UX Mimari talimatları
    const systemInstruction = `You are a world-class UI/UX architect and frontend engineer. 
    Return ONLY a raw JSON object conforming to the AppSchema. 
    Do not use markdown formatting or backticks.
    Structure: { "appName": "string", "description": "string", "elements": [] }`;

    // Model seçimi: Gemini 3 Flash Preview
    const model = "gemini-3-flash-preview";
    
    // KRİTİK DÜZELTME: API Key sadece URL query parametresi olarak gönderiliyor.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // DİKKAT: Authorization başlığı tamamen kaldırıldı!
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\nUser Application Request: ${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error details:", JSON.stringify(data, null, 2));
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: "Yapay zeka servisi hata döndürdü.", 
          details: data.error?.message || "Bilinmeyen API hatası" 
        }),
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
      body: JSON.stringify({ error: "İşlem sırasında bir hata oluştu.", details: err.message }),
    };
  }
};
