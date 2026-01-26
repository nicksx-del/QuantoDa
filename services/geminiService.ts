import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
// In a production app, this call should ideally be proxying through a backend to protect the Key,
// or use strict domain restrictions on the API Key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinancialStatement = async (textData: string): Promise<AnalysisResult> => {
  
  // Define the schema for structured output
  const schema = {
    type: Type.OBJECT,
    properties: {
      totalMonthly: { type: Type.NUMBER, description: "Total estimated monthly cost of all recurring subscriptions found." },
      totalYearly: { type: Type.NUMBER, description: "Total estimated yearly cost." },
      subscriptionCount: { type: Type.INTEGER, description: "Number of subscriptions found." },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the service (e.g. Netflix, Spotify)." },
            amount: { type: Type.NUMBER, description: "Cost per billing cycle." },
            frequency: { type: Type.STRING, enum: ["monthly", "yearly"], description: "Billing frequency." },
            category: { type: Type.STRING, description: "Category (Streaming, Gym, Software, etc)." },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-1." },
            recommendation: { type: Type.STRING, description: "A brief money-saving tip for this specific item if applicable." }
          }
        }
      },
      insights: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "General insights about the user's spending habits based on the data."
      }
    }
  };

  const prompt = `
    You are a financial expert AI for the Brazilian market. 
    Analyze the following financial statement text (which may be unstructured OCR output or CSV).
    Identify RECURRING subscriptions and "ghost" expenses (Netflix, Gympass, Adobe, Uber One, Amazon Prime, Smart Fit, etc.).
    Ignore one-off transfers or food delivery unless it's a subscription (like iFood Club).
    
    Return the response in JSON format matching the schema.
    If the text is empty or meaningless, return a result with 0 items but a polite insight asking for a valid file.
    
    Text Data to Analyze:
    ${textData.substring(0, 30000)} // Limit context window just in case
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsedData = JSON.parse(resultText) as AnalysisResult;
    return parsedData;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Falha ao analisar o documento com IA. Verifique sua chave de API ou o formato do arquivo.");
  }
};