/**
 * Defines the structure for the basic text statistics.
 * These are calculated synchronously in real-time.
 */
export interface TextStats {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  mostFrequentWord: string;
  mostFrequentWordCount: number;
  longestWord: string;
}

/**
 * Defines the structure for sentiment analysis results.
 */
export interface SentimentResult {
  score: string; // 'Positive' | 'Negative' | 'Neutral'
  confidence: number; // A value between 0 and 1 indicating certainty
  explanation: string; // A brief text explaining why this result was chosen
}

/**
 * Enum representing the possible states of the sentiment analysis process.
 * Used to drive the UI state in the SentimentCard component.
 */
export enum AnalysisStatus {
  IDLE = 'IDLE',          // No analysis running, waiting for user input
  ANALYZING = 'ANALYZING', // Async operation in progress (show spinner)
  COMPLETED = 'COMPLETED', // Analysis finished successfully
  ERROR = 'ERROR',        // Analysis failed
}