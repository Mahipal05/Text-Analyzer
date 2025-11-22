import React from 'react';
import { Sparkles, Loader2, AlertCircle, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { SentimentResult, AnalysisStatus } from '../types';

interface SentimentCardProps {
  status: AnalysisStatus;          // Current state of the async operation
  result: SentimentResult | null;  // The data returned from analysis
  onAnalyze: () => void;           // Callback to trigger analysis
  disabled: boolean;               // Prevent clicks if input is empty
}

/**
 * SentimentCard Component
 * 
 * Handles the UI for the Sentiment Analysis feature.
 * This component implements "Conditional Rendering" to handle 4 distinct states:
 * 1. IDLE: Waiting for user action.
 * 2. ANALYZING: Showing a loading spinner.
 * 3. COMPLETED: Displaying the result (Positive/Negative/Neutral).
 * 4. ERROR: Displaying a failure message.
 */
export const SentimentCard: React.FC<SentimentCardProps> = ({ status, result, onAnalyze, disabled }) => {
  
  // Helper to select the correct icon based on sentiment score
  const getIcon = () => {
    if (!result) return <Sparkles className="w-6 h-6 text-indigo-600" />;
    switch (result.score) {
      case 'Positive': return <ThumbsUp className="w-6 h-6 text-green-500" />;
      case 'Negative': return <ThumbsDown className="w-6 h-6 text-red-500" />;
      default: return <Minus className="w-6 h-6 text-gray-500" />;
    }
  };

  // Helper to determine card border/background styling based on result
  const getColor = () => {
    if (!result) return 'bg-indigo-50 border-indigo-100';
    switch (result.score) {
      case 'Positive': return 'bg-green-50 border-green-100';
      case 'Negative': return 'bg-red-50 border-red-100';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`rounded-xl p-6 border shadow-sm transition-all ${getColor()}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Sentiment Analysis
        </h3>
        {/* Badge showing confidence score if analysis is done */}
        {status === AnalysisStatus.COMPLETED && result && (
          <span className={`px-2 py-1 text-xs font-bold rounded-full 
            ${result.score === 'Positive' ? 'bg-green-100 text-green-700' : 
              result.score === 'Negative' ? 'bg-red-100 text-red-700' : 
              'bg-gray-200 text-gray-700'}`}>
            {Math.round(result.confidence * 100)}% Confidence
          </span>
        )}
      </div>

      {/* Content Body - Dynamic based on Status */}
      <div className="min-h-[80px] flex items-center justify-center">
        
        {/* State: IDLE */}
        {status === AnalysisStatus.IDLE && (
          <button
            onClick={onAnalyze}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${disabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}`}
          >
            <Sparkles className="w-4 h-4" />
            Analyze Text
          </button>
        )}

        {/* State: ANALYZING (Loading) */}
        {status === AnalysisStatus.ANALYZING && (
          <div className="flex flex-col items-center text-indigo-600">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm font-medium">Analyzing...</span>
          </div>
        )}

        {/* State: ERROR */}
        {status === AnalysisStatus.ERROR && (
           <div className="flex flex-col items-center text-red-500 text-center">
            <AlertCircle className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Analysis Failed</span>
            <span className="text-xs text-gray-400 mt-1">Could not process text locally.</span>
            <button onClick={onAnalyze} className="mt-2 text-xs underline text-indigo-600">Try Again</button>
          </div>
        )}

        {/* State: COMPLETED */}
        {status === AnalysisStatus.COMPLETED && result && (
          <div className="w-full">
            <div className="flex items-center gap-3 mb-2">
              {getIcon()}
              <span className="text-2xl font-bold text-gray-900">{result.score}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};