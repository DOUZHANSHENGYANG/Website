import { GoogleGenAI } from "@google/genai";

export const generateSummary = async (content: string): Promise<string> => {
  if (!process.env.API_KEY) {
    alert("API Key is missing!");
    return "AI Summary unavailable without API Key.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please provide a concise, engaging summary (max 2 sentences) for the following blog post content. Capture the essence and tone.\n\nContent:\n${content}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating summary.";
  }
};
