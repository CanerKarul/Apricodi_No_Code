
import { GoogleGenAI, Type } from "@google/genai";
import { AppSchema } from "../types.ts";

export const generateAppSchema = async (prompt: string): Promise<AppSchema> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.includes("process.env")) {
    console.error("CRITICAL: API_KEY is missing in browser context.");
    throw new Error(
      "API YAPILANDIRMASI EKSİK: Uygulama API anahtarına erişemiyor.\n\n" +
      "Lütfen Netlify -> Site Settings -> Environment variables kısmında 'API_KEY' değişkeninin tanımlı olduğundan emin olun."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a fully functional UI JSON schema for this application: "${prompt}". 
      The response must be a valid JSON object containing appName, description, and elements array.`,
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
        systemInstruction: "You are a professional software architect. Return only JSON schema, no markdown.",
      },
    });

    const resultText = response.text || "";
    return JSON.parse(resultText) as AppSchema;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Yapay zeka yanıt veremedi. Lütfen isteminizi kontrol edin veya tekrar deneyin.");
  }
};
