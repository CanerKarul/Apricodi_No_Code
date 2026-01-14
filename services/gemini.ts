
import { AppSchema } from "../types.ts";

export const generateAppSchema = async (prompt: string): Promise<AppSchema> => {
  try {
    const response = await fetch("/.netlify/functions/generate-app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Sunucu hatası: ${response.status}`);
    }

    const schema = await response.json();
    return schema as AppSchema;
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw new Error(error.message || "Yapay zeka asistanına şu an ulaşılamıyor.");
  }
};
