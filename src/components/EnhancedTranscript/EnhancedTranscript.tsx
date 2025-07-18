"use client";

import React, { useState, useEffect } from 'react'
import { FileText, Clock, Brain, Search, Copy, Download, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptSegment {
  text: string;
  duration: string;
  offset: string;
  videoId: string;
}

interface EnhancedTranscriptProps {
  // The main transcript variable (as requested)
  transcriptVariable: string;
  
  // Formatted transcript with timestamps
  formattedTranscriptWithTimestamps: string;
  
  // Segment data for interactive display
  transcript: TranscriptSegment[];
  
  // AI analysis from Gemini API
  aiAnalysis: {
    summary: string;
    keyTopics: string[];
    insights: string;
  };
  
  // Metadata
  metadata: {
    duration: number;
    segmentCount: number;
    wordCount: number;
  };
  
  loading?: boolean;
  onRetry?: () => void;
}

const EnhancedTranscript: React.FC<EnhancedTranscriptProps> = ({
  transcriptVariable,
  formattedTranscriptWithTimestamps,
  transcript,
  aiAnalysis,
  metadata,
  loading = false,
  onRetry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedSegments, setHighlightedSegments] = useState<number[]>([]);
  const [showRawTranscript, setShowRawTranscript] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  console.log('📝 Enhanced Transcript Component Loaded:');
  console.log('📊 Transcript Variable Length:', transcriptVariable?.length || 0);
  console.log('🔢 Segments Count:', transcript?.length || 0);
  console.log('📈 Metadata:', metadata);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const results: number[] = [];
      transcript.forEach((segment, index) => {
        if (segment.text.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(index);
        }
      });
      setHighlightedSegments(results);
    } else {
      setHighlightedSegments([]);
    }
  }, [searchTerm, transcript]);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
      console.log(`✅ ${type} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download transcript
  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedTranscriptWithTimestamps], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Highlight search terms in text
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => (
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Processing transcript with AI...</p>
          <p className="text-sm text-gray-500">Extracting insights and generating summary</p>
        </div>
      </div>
    );
  }

  if (!transcriptVariable || transcript.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6 bg-gray-50 rounded-lg border border-gray-200">
        <FileText className="w-16 h-16 text-gray-400" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">No Transcript Available</h3>
          <p className="text-sm text-gray-600">This video doesn't have an available transcript.</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Enhanced Transcript Analysis</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{metadata.segmentCount}</div>
            <div className="text-sm text-gray-600">Segments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metadata.wordCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatTime(metadata.duration)}</div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{(transcriptVariable.length / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Characters</div>
          </div>
        </div>
      </motion.div>

      {/* AI Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Summary & Insights</h3>
          <button
            onClick={() => copyToClipboard(aiAnalysis.summary, 'AI Summary')}
            className="ml-auto p-2 text-gray-500 hover:text-purple-600 transition-colors"
            title="Copy summary"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="prose max-w-none">
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h4 className="text-md font-semibold text-purple-900 mb-2">Summary</h4>
            <div className="text-gray-700 whitespace-pre-line">
              {aiAnalysis.summary}
            </div>
          </div>

          {aiAnalysis.keyTopics && aiAnalysis.keyTopics.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Key Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.keyTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {aiAnalysis.insights && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-green-900 mb-2">Key Insights</h4>
              <div className="text-gray-700 whitespace-pre-line">
                {aiAnalysis.insights}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search in transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {highlightedSegments.length > 0 && (
            <span className="text-sm text-purple-600 font-medium">
              {highlightedSegments.length} result{highlightedSegments.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawTranscript(!showRawTranscript)}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showRawTranscript ? 'Show Formatted' : 'Show Raw Text'}
          </button>
          
          <button
            onClick={() => copyToClipboard(transcriptVariable, 'Full Transcript')}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy All
          </button>
          
          <button
            onClick={downloadTranscript}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </motion.div>

      {copiedToClipboard && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          ✅ Copied to clipboard!
        </motion.div>
      )}

      {/* Transcript Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Transcript with Timestamps
            </h3>
            <div className="text-sm text-gray-500">
              ({transcript.length} segments)
            </div>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {showRawTranscript ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg"
              >
                {transcriptVariable}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {transcript.map((segment, index) => {
                  const isHighlighted = highlightedSegments.includes(index);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex gap-4 p-3 rounded-lg transition-colors ${
                        isHighlighted 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="font-mono text-sm font-bold text-purple-600 min-w-[80px]">
                          {formatTime(parseFloat(segment.offset))}-
                          {formatTime(parseFloat(segment.offset) + parseFloat(segment.duration))}
                        </span>
                      </div>
                      
                      <div className="flex-1 text-gray-700 leading-relaxed">
                        {highlightText(segment.text, searchTerm)}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Debug Info (can be removed in production) */}
      <details className="bg-gray-100 p-4 rounded-lg text-xs">
        <summary className="cursor-pointer font-medium text-gray-700">
          🔧 Debug Information (Transcript Variable Status)
        </summary>
        <div className="mt-2 space-y-2 text-gray-600">
          <div>Transcript Variable Length: {transcriptVariable.length} characters</div>
          <div>Word Count: {metadata.wordCount}</div>
          <div>Segment Count: {metadata.segmentCount}</div>
          <div>Duration: {metadata.duration} seconds</div>
          <div>AI Summary Length: {aiAnalysis.summary.length} characters</div>
          <div>Key Topics: {aiAnalysis.keyTopics.length}</div>
          <div className="bg-white p-2 rounded mt-2">
            <div className="font-medium">Transcript Variable Preview (first 200 chars):</div>
            <div className="font-mono text-xs break-all">
              {transcriptVariable.substring(0, 200)}...
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};

export default EnhancedTranscript; 