
import { AppSchema } from "../types.ts";

export const generateAppSchema = async (prompt: string): Promise<AppSchema> => {
  try {
    console.log("🔄 Sending request to Netlify function...");

    const response = await fetch("/.netlify/functions/generate-app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const json = await response.json();

    if (!response.ok) {
      console.error("❌ Function error:", JSON.stringify(json, null, 2));

      // Daha kullanıcı dostu hata mesajları
      let errorMessage = "Sunucu hatası oluştu.";

      if (json?.error) {
        if (typeof json.error === "string") {
          errorMessage = json.error;
        } else if (json.error.message) {
          errorMessage = json.error.message;
        }
      }

      if (json?.hint) {
        errorMessage += ` ${json.hint}`;
      }

      // Özel hata durumları
      if (response.status === 500 && errorMessage.includes("API_KEY")) {
        errorMessage = "API anahtarı yapılandırılmamış. Lütfen Netlify ortam değişkenlerini kontrol edin.";
      } else if (response.status === 429) {
        errorMessage = "Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.";
      } else if (response.status === 400) {
        errorMessage = "Geçersiz istek. Lütfen prompt'unuzu kontrol edin.";
      }

      throw new Error(errorMessage);
    }

    console.log("✅ Function response received");

    // Gemini REST yanıt yapısını ayrıştır (candidates[0].content.parts[0].text)
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("❌ Empty response from AI:", json);
      throw new Error("AI yanıtı boş döndü. Lütfen tekrar deneyin.");
    }

    console.log("📝 Raw AI response:", rawText.substring(0, 200) + "...");

    // Markdown temizleme: ```json ... ``` veya ``` ... ``` bloklarını kaldır
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const schema = JSON.parse(cleaned);

      // Schema validasyonu
      if (!schema.appName || !schema.description || !Array.isArray(schema.elements)) {
        console.error("❌ Invalid schema structure:", schema);
        throw new Error("AI geçersiz bir yapı döndürdü. Lütfen tekrar deneyin.");
      }

      console.log("✅ Schema parsed successfully:", schema.appName);
      return schema as AppSchema;
    } catch (parseError) {
      console.error("❌ JSON Parse Failed. Cleaned Text:", cleaned);
      throw new Error("AI çıktısı geçerli bir JSON formatında değil. Lütfen tekrar deneyin.");
    }
  } catch (error: any) {
    console.error("❌ Gemini Service Error:", error);

    // Network hataları için özel mesaj
    if (error.message.includes("fetch") || error.message.includes("network")) {
      throw new Error("Bağlantı hatası. İnternet bağlantınızı kontrol edin.");
    }

    throw new Error(error.message || "Uygulama oluşturulurken bir hata oluştu.");
  }
};
