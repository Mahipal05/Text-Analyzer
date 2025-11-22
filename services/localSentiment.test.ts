
import { describe, it, expect } from 'vitest';
import { analyzeSentimentLocal } from './localSentiment';

describe('Local Sentiment Analysis Service', () => {
  
  it('should identify positive sentiment', async () => {
    const text = "This is a wonderful and amazing feature that I love.";
    const result = await analyzeSentimentLocal(text);
    
    expect(result.score).toBe('Positive');
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.explanation).toContain('positive words');
  });

  it('should identify negative sentiment', async () => {
    const text = "This is terrible, bad, and a complete failure.";
    const result = await analyzeSentimentLocal(text);
    
    expect(result.score).toBe('Negative');
    expect(result.explanation).toContain('negative words');
  });

  it('should return neutral for text with no emotional words', async () => {
    const text = "The book is on the table.";
    const result = await analyzeSentimentLocal(text);
    
    expect(result.score).toBe('Neutral');
    expect(result.confidence).toBe(0.5);
  });

  it('should handle mixed sentiment (net positive)', async () => {
    // "good" (pos), "bad" (neg), "excellent" (pos) => Net +1
    const text = "The concept was good, implementation was bad, but overall excellent.";
    const result = await analyzeSentimentLocal(text);
    
    expect(result.score).toBe('Positive');
  });
});
