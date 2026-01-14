
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event: any) => {
  // CORS Preflight kontrolü
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
    // API anahtarı sistem kuralları gereği process.env.API_KEY üzerinden alınır
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("Environment Error: API_KEY is not defined in Netlify.");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing API_KEY environment variable." }),
      };
    }

    const requestBody = JSON.parse(event.body || "{}");
    const userPrompt = requestBody.prompt;

    if (!userPrompt) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Prompt is required." }),
      };
    }

    // Sistem talimatı: Kesin JSON çıktısı
    const systemInstruction = `You are a world-class UI/UX architect and frontend engineer. 
    Return ONLY a raw JSON object conforming to the AppSchema. 
    Do not use markdown backticks or any surrounding text.
    Structure: { "appName": "string", "description": "string", "elements": [] }`;

    const model = "gemini-3-flash-preview";
    
    // ÇÖZÜM: API Key sadece URL query parametresi olarak gönderiliyor
    // Authorization header kullanılmıyor.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Authorization başlığı 401 hatasını önlemek için kaldırıldı.
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
          responseMimeType: "application/json",
          temperature: 0.7
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Status:", response.status);
      console.error("Gemini API Response:", JSON.stringify(data, null, 2));
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
    console.error("Netlify Function Exception:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
    };
  }
};
