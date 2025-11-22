import { TextStats } from '../types';

/**
 * Core analysis logic to extract metrics from the provided text.
 * This function is pure and synchronous, making it easy to test and fast to run.
 * 
 * @param text - The raw input text string.
 * @returns TextStats object containing all calculated metrics.
 */
export const analyzeText = (text: string): TextStats => {
  // Edge case: Return default zero values if input is empty or null.
  if (!text) {
    return {
      wordCount: 0,
      charCount: 0,
      charCountNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      mostFrequentWord: 'N/A',
      mostFrequentWordCount: 0,
      longestWord: 'N/A',
    };
  }

  // Basic character counts
  const charCount = text.length;
  // Remove all whitespace (\s) to count only visible characters
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  
  // Paragraph Analysis:
  // We split by one or more newlines (\n+). 
  // We filter out empty strings to avoid counting trailing newlines as paragraphs.
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  // Sentence Analysis:
  // This uses a Regex lookahead heuristic.
  // Split by punctuation (. ! ?) followed by a space or the end of the string.
  // This handles standard English sentence structures effectively.
  const sentenceCount = text.split(/[.!?]+(?:\s|$)/).filter(s => s.trim().length > 0).length;

  // Word Analysis:
  // \b matches word boundaries. 
  // [\w-]+ matches alphanumeric characters including underscores and hyphens.
  // This ensures "co-operate" counts as one word, while "hello world" is two.
  const words = text.match(/\b[\w-]+\b/g) || [];
  const wordCount = words.length;

  // Frequency & Longest Word Calculation:
  // We iterate through the word list once (O(n)) to determine both longest word
  // and word frequency map to ensure performance on large texts.
  const frequencyMap: Record<string, number> = {};
  let maxFreq = 0;
  let mostFreqWord = '';
  let longest = '';

  for (const w of words) {
    const lower = w.toLowerCase(); // specific case-insensitive counting
    
    // Check for longest word
    if (w.length > longest.length) {
      longest = w;
    }

    // Update Frequency Map
    frequencyMap[lower] = (frequencyMap[lower] || 0) + 1;
    
    // Track max frequency on the fly to avoid a second loop
    if (frequencyMap[lower] > maxFreq) {
      maxFreq = frequencyMap[lower];
      mostFreqWord = lower;
    }
  }

  return {
    wordCount,
    charCount,
    charCountNoSpaces,
    sentenceCount,
    paragraphCount,
    mostFrequentWord: mostFreqWord || 'N/A',
    mostFrequentWordCount: maxFreq,
    longestWord: longest || 'N/A',
  };
};

/**
 * Helper function to format the statistics into a CSV string for export.
 */
export const generateCSV = (stats: TextStats): string => {
  const headers = [
    "Metric", "Value"
  ];
  const rows = [
    ["Word Count", stats.wordCount],
    ["Character Count (Total)", stats.charCount],
    ["Character Count (No Spaces)", stats.charCountNoSpaces],
    ["Sentence Count", stats.sentenceCount],
    ["Paragraph Count", stats.paragraphCount],
    // CSV cells containing commas typically need quoting, but simple stats are usually safe.
    ["Most Frequent Word", `${stats.mostFrequentWord} (${stats.mostFrequentWordCount})`],
    ["Longest Word", stats.longestWord],
  ];

  // Join rows with newlines to create the final CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  return csvContent;
};