import React, { useState, useMemo, useCallback } from 'react';
import { 
  Type, 
  AlignLeft, 
  Hash, 
  FileText, 
  Zap, 
  Maximize2, 
  Download, 
  Trash2, 
  Copy, 
  CheckCircle2
} from 'lucide-react';
import { StatCard } from './components/StatCard';
import { SentimentCard } from './components/SentimentCard';
import { analyzeText, generateCSV } from './services/analyzer';
import { analyzeSentimentLocal } from './services/localSentiment';
import { TextStats, SentimentResult, AnalysisStatus } from './types';

/**
 * Main Application Component
 * 
 * Acts as the container/controller for the application. 
 * It manages global state (text input, sentiment results) and orchestrates 
 * the data flow to child components (StatCard, SentimentCard).
 */
const App: React.FC = () => {
  // State Management
  const [text, setText] = useState<string>('');
  const [sentimentStatus, setSentimentStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * Performance Optimization: useMemo
   * The analyzeText function can be computationally expensive for very large texts.
   * useMemo ensures we only recalculate stats when the `text` variable actually changes,
   * preventing unnecessary recalculations on other state updates (like copy success).
   */
  const stats: TextStats = useMemo(() => analyzeText(text), [text]);

  // Handler for text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Reset sentiment analysis if the user modifies the text to ensure consistency.
    if (sentimentStatus === AnalysisStatus.COMPLETED || sentimentStatus === AnalysisStatus.ERROR) {
      setSentimentStatus(AnalysisStatus.IDLE);
      setSentimentResult(null);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the text?')) {
      setText('');
      setSentimentStatus(AnalysisStatus.IDLE);
      setSentimentResult(null);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      // Reset success icon after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  /**
   * Export Functionality
   * Generates a Blob from the CSV string and creates a temporary 
   * download link to trigger the file download in the browser.
   */
  const handleExport = () => {
    const csvContent = generateCSV(stats);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `text_analysis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Async handler for Sentiment Analysis.
   * Wrapped in useCallback to maintain referential equality for child components.
   */
  const handleSentimentAnalysis = useCallback(async () => {
    if (!text.trim()) return;
    
    setSentimentStatus(AnalysisStatus.ANALYZING);
    try {
      // Trigger the local sentiment analysis service
      const result = await analyzeSentimentLocal(text);
      setSentimentResult(result);
      setSentimentStatus(AnalysisStatus.COMPLETED);
    } catch (error) {
      console.error(error);
      setSentimentStatus(AnalysisStatus.ERROR);
    }
  }, [text]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Component */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <AlignLeft className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">TextMetric Pro</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Advanced Text Analysis Tool
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input Area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px] lg:h-[calc(100vh-12rem)]">
              {/* Toolbar */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-xl">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Input Text</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopy} 
                    disabled={!text}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy Text"
                  >
                    {copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleClear}
                    disabled={!text}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear Text"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Main Text Input Area */}
              <textarea
                className="flex-grow p-6 w-full resize-none focus:outline-none text-gray-700 leading-relaxed font-mono text-base bg-white rounded-b-xl"
                placeholder="Paste or type your text here to begin analysis..."
                value={text}
                onChange={handleTextChange}
                spellCheck={false}
              />
              
              {/* Footer Info (Quick Stats) */}
              <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between bg-gray-50 rounded-b-xl">
                <span>{stats.charCount} characters</span>
                <span>{stats.wordCount} words</span>
              </div>
            </div>
          </div>

          {/* Right Column: Metrics & Analysis Dashboard */}
          <div className="flex flex-col gap-6 h-full overflow-y-auto pb-10">
            
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-gray-800">Real-time Metrics</h2>
               <button 
                  onClick={handleExport}
                  disabled={!text || stats.wordCount === 0}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
               >
                 <Download className="w-4 h-4" />
                 Export CSV
               </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              
              {/* 1. Word Count */}
              <StatCard 
                title="Word Count" 
                value={stats.wordCount} 
                icon={Type} 
                colorClass="text-indigo-600" 
              />
              
              {/* 2. Character Count (Total) - Separate Box */}
              <StatCard 
                title=" Character Count" 
                value={stats.charCount} 
                icon={Hash} 
                colorClass="text-blue-600" 
              />

              {/* 3. Character Count (No Spaces) - Separate Box with Total Label */}
              <StatCard 
                title="Character Count (Excluding Spaces)" 
                value={stats.charCountNoSpaces} 
                subtext={
                  <span>
                    Total Characters: <strong>{stats.charCount}</strong>
                  </span>
                }
                icon={Hash} 
                colorClass="text-teal-600" 
              />

              {/* 4. Sentence Count */}
              <StatCard 
                title="Sentence Count" 
                value={stats.sentenceCount} 
                icon={FileText} 
                colorClass="text-orange-500" 
              />

              {/* 5. Paragraph Count */}
               <StatCard 
                title="Paragraph Count" 
                value={stats.paragraphCount} 
                icon={AlignLeft} 
                colorClass="text-purple-500" 
              />

              {/* 6. Most Frequent Word */}
               <StatCard 
                title="Most Frequent Word" 
                value={stats.mostFrequentWord} 
                subtext={stats.mostFrequentWord !== 'N/A' ? `${stats.mostFrequentWordCount} occurrences` : ''}
                icon={Zap} 
                colorClass="text-yellow-500" 
              />

              {/* 7. Longest Word */}
               <StatCard 
                title="Longest Word" 
                value={stats.longestWord} 
                subtext={stats.longestWord !== 'N/A' ? `${stats.longestWord.length} chars` : ''}
                icon={Maximize2} 
                colorClass="text-cyan-600" 
              />
            </div>

            {/* Sentiment Analysis Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">AI Insights</h2>
              <SentimentCard 
                status={sentimentStatus} 
                result={sentimentResult} 
                onAnalyze={handleSentimentAnalysis}
                disabled={!text.trim()}
              />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;