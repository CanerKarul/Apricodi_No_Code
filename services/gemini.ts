
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

    const json = await response.json();

    if (!response.ok) {
      console.error("Function error:", JSON.stringify(json, null, 2));
      throw new Error(json?.error?.message || json?.error || "Sunucu hatası");
    }

    // Gemini REST yanıt yapısını ayrıştır (candidates[0].content.parts[0].text)
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error("Yapay zeka yanıtı boş döndü.");
    }

    // Markdown temizleme: ```json ... ``` veya ``` ... ``` bloklarını kaldır
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const schema = JSON.parse(cleaned);
      return schema as AppSchema;
    } catch (parseError) {
      console.error("JSON Parse Failed. Cleaned Text:", cleaned);
      throw new Error("AI çıktısı geçerli bir JSON formatında değil.");
    }
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw new Error(error.message || "Uygulama oluşturulurken bir hata oluştu.");
  }
};
