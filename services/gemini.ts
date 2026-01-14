
import { GoogleGenAI, Type } from "@google/genai";
import { AppSchema } from "../types.ts";

export const generateAppSchema = async (prompt: string): Promise<AppSchema> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing from environment variables!");
    throw new Error("API Anahtarı bulunamadı. Lütfen Netlify panelinden API_KEY değişkenini eklediğinizden ve siteyi tekrar deploy ettiğinizden emin olun.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a functional UI JSON schema for this application request: "${prompt}".
      The schema must include components like forms, tables, cards, and headings.
      Ensure the data for tables matches the column count.`,
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
        systemInstruction: "You are a senior software architect. Always return clean JSON matching the requested schema. Never add markdown commentary.",
      },
    });

    const text = response.text || "";
    // Robust cleaning in case Gemini adds markdown blocks even with responseMimeType
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as AppSchema;
  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    throw error;
  }
};
