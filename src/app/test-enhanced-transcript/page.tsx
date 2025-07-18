'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Sparkles, Database, Brain } from 'lucide-react';
import EnhancedTranscript from '~/components/EnhancedTranscript/EnhancedTranscript';

interface EnhancedTranscriptData {
  transcriptVariable: string;
  formattedTranscriptWithTimestamps: string;
  transcript: Array<{
    transcriptText: string;
    duration: string;
    offset: string;
    videoId: string;
  }>;
  aiAnalysis: {
    summary: string;
    keyTopics: string[];
    insights: string;
  };
  metadata: {
    duration: number;
    segmentCount: number;
    wordCount: number;
  };
}

export default function TestEnhancedTranscriptPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcriptData, setTranscriptData] = useState<EnhancedTranscriptData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processTranscript = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError(null);
    setTranscriptData(null);

    try {
      console.log('🎬 Processing YouTube URL with Enhanced Transcript API...');
      
      const response = await fetch(`/api/enhanced-transcript?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process transcript');
      }

      console.log('✅ Enhanced transcript data received:', data);

      // Transform the data to match our component interface
      const enhancedData: EnhancedTranscriptData = {
        transcriptVariable: data.transcriptVariable,
        formattedTranscriptWithTimestamps: data.formattedTranscriptWithTimestamps,
        transcript: data.transcript,
        aiAnalysis: data.aiAnalysis,
        metadata: data.metadata
      };

      setTranscriptData(enhancedData);
      
      // Log the stored transcript variable (as requested)
      console.log('📝 TRANSCRIPT VARIABLE STORED:');
      console.log('Full Text Length:', enhancedData.transcriptVariable.length);
      console.log('Preview:', enhancedData.transcriptVariable.substring(0, 200) + '...');

    } catch (err) {
      console.error('❌ Error processing transcript:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processTranscript();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Youtube className="w-10 h-10 text-red-600" />
            <Sparkles className="w-8 h-8 text-purple-600" />
            <Database className="w-8 h-8 text-blue-600" />
            <Brain className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced YouTube Transcript Processor
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test the enhanced transcript system that stores the complete transcript in a variable 
            and processes it with Gemini AI to generate comprehensive summaries, insights, and formatted output.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Youtube className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Enter YouTube URL to Process
            </h2>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={processTranscript}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Process with AI
                </>
              )}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Features Overview */}
        {!transcriptData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Database className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Transcript Variable</h3>
              <p className="text-sm text-gray-600">
                Stores the complete transcript in a variable for processing
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Brain className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Gemini AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Generates summaries, key topics, and insights using Google's Gemini API
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Enhanced Display</h3>
              <p className="text-sm text-gray-600">
                Beautiful formatted output with timestamps and search functionality
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Youtube className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">YouTube Integration</h3>
              <p className="text-sm text-gray-600">
                Works with any YouTube video that has available transcripts
              </p>
            </div>
          </motion.div>
        )}

        {/* Enhanced Transcript Display */}
        {transcriptData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EnhancedTranscript
              transcriptVariable={transcriptData.transcriptVariable}
              formattedTranscriptWithTimestamps={transcriptData.formattedTranscriptWithTimestamps}
              transcript={transcriptData.transcript}
              aiAnalysis={transcriptData.aiAnalysis}
              metadata={transcriptData.metadata}
              loading={false}
              onRetry={() => {
                setTranscriptData(null);
                setError(null);
              }}
            />
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <div className="h-16 w-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-xl font-medium text-gray-700 mb-2">
                Processing Transcript with Enhanced AI
              </p>
              <div className="space-y-1 text-sm text-gray-500">
                <p>📥 Fetching YouTube transcript...</p>
                <p>📝 Storing in transcript variable...</p>
                <p>🤖 Analyzing with Gemini AI...</p>
                <p>✨ Generating enhanced summary and insights...</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works:</h3>
          <ol className="space-y-2 text-blue-800">
            <li>1. <strong>Transcript Fetching:</strong> Uses youtube-transcript-api to get video transcript</li>
            <li>2. <strong>Variable Storage:</strong> Stores the complete transcript text in a variable</li>
            <li>3. <strong>AI Processing:</strong> Sends the transcript variable to Gemini API for analysis</li>
            <li>4. <strong>Enhanced Output:</strong> Displays formatted transcript with timestamps and AI-generated summary</li>
            <li>5. <strong>Interactive Features:</strong> Search, copy, download, and topic extraction</li>
          </ol>
        </motion.div>

        {/* Example URLs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Try these example URLs:</h3>
          <div className="space-y-2">
            {[
              'https://www.youtube.com/watch?v=yQq1-_ujXnM',
              'https://www.youtube.com/watch?v=TQMbvJNRpLE',
              'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            ].map((url, index) => (
              <button
                key={index}
                onClick={() => setVideoUrl(url)}
                className="block w-full text-left px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-mono"
              >
                {url}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 