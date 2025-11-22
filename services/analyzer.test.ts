import { describe, it, expect } from 'vitest';
import { analyzeText } from './analyzer';

describe('Text Analyzer Service', () => {
  
  it('should return zero stats for empty input', () => {
    const result = analyzeText('');
    expect(result.wordCount).toBe(0);
    expect(result.charCount).toBe(0);
    expect(result.paragraphCount).toBe(0);
    expect(result.mostFrequentWord).toBe('N/A');
  });

  it('should count words and characters correctly for a simple sentence', () => {
    const text = "The quick brown fox.";
    const result = analyzeText(text);
    
    // "The", "quick", "brown", "fox" = 4 words
    expect(result.wordCount).toBe(4);
    // Length of string is 20
    expect(result.charCount).toBe(20);
    // "Thequickbrownfox." = 17 chars (3 spaces removed)
    expect(result.charCountNoSpaces).toBe(17);
  });

  it('should identify the longest word', () => {
    const text = "React is a JavaScript library";
    const result = analyzeText(text);
    expect(result.longestWord).toBe("JavaScript");
  });

  it('should identify the most frequent word (case insensitive)', () => {
    const text = "Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo";
    const result = analyzeText(text);
    expect(result.mostFrequentWord).toBe("buffalo");
    expect(result.mostFrequentWordCount).toBe(8);
  });

  it('should count paragraphs correctly based on newlines', () => {
    const text = "Paragraph one.\n\nParagraph two.\nParagraph three.";
    const result = analyzeText(text);
    expect(result.paragraphCount).toBe(3);
  });

  it('should handle special characters and punctuation gracefully', () => {
    const text = "Hello-World! This is test 123.";
    const result = analyzeText(text);
    // "Hello-World", "This", "is", "test", "123"
    expect(result.wordCount).toBe(5);
    expect(result.longestWord).toBe("Hello-World");
  });
});