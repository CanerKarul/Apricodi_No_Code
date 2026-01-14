import { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
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
    // API anahtarını environment variable'dan al
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("❌ Environment Error: API_KEY is not defined in Netlify.");
      console.error("Please set API_KEY in Netlify Dashboard → Site Settings → Environment Variables");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "API_KEY environment variable is not configured.",
          hint: "Please add API_KEY to your Netlify environment variables."
        }),
      };
    }

    const requestBody = JSON.parse(event.body || "{}");
    const userPrompt = requestBody.prompt;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Valid prompt is required." }),
      };
    }

    console.log("📝 Received prompt:", userPrompt.substring(0, 100) + "...");

    // Sistem talimatı: Kesin JSON çıktısı
    const systemInstruction = `You are a world-class UI/UX architect and frontend engineer. 
    Return ONLY a raw JSON object conforming to the AppSchema. 
    Do not use markdown backticks or any surrounding text.
    Structure: { "appName": "string", "description": "string", "elements": [] }`;

    // Doğru model adı: gemini-1.5-flash (kararlı ve güvenilir)
    const model = "gemini-1.5-flash";

    // Gemini API endpoint - API Key URL parametresi olarak gönderiliyor
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    console.log("🚀 Calling Gemini API with model:", model);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API Error Status:", response.status);
      console.error("❌ Gemini API Response:", JSON.stringify(data, null, 2));

      // Daha açıklayıcı hata mesajları
      let errorMessage = "Gemini API request failed";
      if (response.status === 400) {
        errorMessage = "Invalid request to Gemini API. Please check your prompt.";
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = "API key is invalid or doesn't have permission.";
      } else if (response.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (response.status === 500) {
        errorMessage = "Gemini API server error. Please try again.";
      }

      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({
          error: errorMessage,
          details: data,
          status: response.status
        }),
      };
    }

    console.log("✅ Gemini API response received successfully");

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    console.error("❌ Netlify Function Exception:", err);
    console.error("Stack trace:", err.stack);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
        hint: "Check Netlify function logs for more details."
      }),
    };
  }
};
