
import { GoogleGenAI, Type } from "@google/genai";
import { AppSchema } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateAppSchema = async (prompt: string): Promise<AppSchema> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a JSON schema for a web application based on this request: "${prompt}".
    The application should include forms, lists, or headers.
    Return only valid JSON.`,
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
                  },
                  description: "2D array of strings representing rows and cells. Each inner array must match the length of the columns array."
                }
              },
              required: ['id', 'type', 'label']
            }
          }
        },
        required: ['appName', 'elements']
      },
      systemInstruction: "You are a professional software architect. Convert user descriptions into functional UI JSON schemas. Use 'table' for lists, 'input' for forms, and 'heading' for titles. For 'table' data, provide an array of arrays where each inner array is a row of string values corresponding to the columns. Keep it modern and logical.",
    },
  });

  return JSON.parse(response.text) as AppSchema;
};
