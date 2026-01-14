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

    const geminiRawResponse = await response.json();
    
    // Gemini REST yanıt yapısını ayrıştır (candidates[0].content.parts[0].text)
    const textOutput = geminiRawResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textOutput) {
      throw new Error("Yapay zeka geçerli bir yanıt oluşturamadı.");
    }

    try {
      const schema = JSON.parse(textOutput);
      return schema as AppSchema;
    } catch (parseError) {
      console.error("JSON Parsing Error:", textOutput);
      throw new Error("AI yanıtı beklenen formatta değil (JSON hatası).");
    }
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw new Error(error.message || "Uygulama oluşturulurken bir hata oluştu.");
  }
};