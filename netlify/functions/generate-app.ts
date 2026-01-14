export default async (req: Request) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing GEMINI_API_KEY on Netlify. Lütfen Environment Variables kısmını kontrol edin." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { prompt } = await req.json();
    
    // API Key ile çalışan v1beta REST endpoint
    const model = "gemini-1.5-flash"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = `You are a professional UI/UX architect. 
    Generate a functional UI JSON schema. 
    The output must be a valid JSON object matching this structure:
    {
      "appName": "string",
      "description": "string",
      "elements": [
        {
          "id": "string",
          "type": "input|select|button|table|heading|card",
          "label": "string",
          "placeholder": "string?",
          "content": "string?",
          "options": ["string"]?,
          "columns": ["string"]?,
          "data": [["string"]]?
        }
      ]
    }`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `System Instruction: ${systemInstruction}\n\nUser Request: ${prompt}` }] 
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), { 
        status: response.status, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Server Error", details: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};