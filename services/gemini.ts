
import { GoogleGenAI, Type } from "@google/genai";
import { AppSchema } from "../types.ts";

export const generateAppSchema = async (prompt: string): Promise<AppSchema> => {
  // Try to capture the API key from environment
  const apiKey = process.env.API_KEY;

  // Netlify ve diğer ortamlarda process.env.API_KEY bazen düz metin olarak kalır.
  // Bu kontrol, anahtarın gerçekten enjekte edilip edilmediğini kontrol eder.
  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.includes("process.env")) {
    console.error("CRITICAL: API_KEY is not injected into the browser context.");
    throw new Error(
      "API_KEY_YAPILANDIRMA_HATASI: Netlify ortam değişkeni (Environment Variable) koda enjekte edilemedi.\n\n" +
      "Kesin Çözüm İçin Netlify Build Settings'deki 'Build Command' alanını şu şekilde güncelleyin:\n\n" +
      "find . -name \"*.js\" -o -name \"*.ts\" -o -name \"*.tsx\" | xargs sed -i \"s|process.env.API_KEY|'$API_KEY'|g\" && npm run build\n\n" +
      "Ardından 'Clear cache and deploy' yaparak yeniden yayına alın."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a fully functional UI JSON schema for this application request: "${prompt}".
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
        systemInstruction: "You are a world-class UI/UX Architect. Return ONLY valid JSON schema for the requested UI. Do not add any markdown formatting or text explanations.",
      },
    });

    const text = response.text || "";
    // Temizleme işlemi (bazen model markdown blokları içinde döndürebiliyor)
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as AppSchema;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    throw error;
  }
};
