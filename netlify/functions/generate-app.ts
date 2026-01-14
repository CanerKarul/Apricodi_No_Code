
import { GoogleGenAI, Type } from "@google/genai";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Sunucu tarafında API_KEY yapılandırılmamış." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a fully functional UI JSON schema for this application request: "${prompt}". 
      The response must be a single, valid JSON object containing appName, description, and elements array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            description: { type: Type.STRING },
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['input', 'select', 'button', 'table', 'heading', 'card'] },
                  label: { type: Type.STRING },
                  inputType: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  placeholder: { type: Type.STRING },
                  content: { type: Type.STRING },
                  columns: { type: Type.ARRAY, items: { type: Type.STRING } },
                  data: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING } 
                    }
                  }
                },
                required: ['id', 'type', 'label']
              }
            }
          },
          required: ['appName', 'elements']
        },
        systemInstruction: "You are a professional software architect. Return only JSON schema, no markdown or extra text.",
      },
    });

    return new Response(response.text, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Uygulama oluşturulurken bir hata oluştu." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
