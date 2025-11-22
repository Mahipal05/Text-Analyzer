import { SentimentResult } from "../types";

// This service is currently unused in favor of localSentiment.ts
// We keep the file structure but remove the @google/genai dependency 
// to prevent build errors in offline mode.

export const analyzeSentimentWithGemini = async (text: string): Promise<SentimentResult> => {
  throw new Error("Online analysis is disabled. Please use local analysis.");
};