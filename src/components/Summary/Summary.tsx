import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SummaryProps {
  summary: string;
  isLoading?: boolean;
}

const Summary: React.FC<SummaryProps> = ({ summary, isLoading = false }) => {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-center">
            AI is analyzing the video and generating a summary...
          </p>
          <div className="space-y-2 w-full max-w-md">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
          </div>
        </div>
      ) : summary ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose max-w-none"
        >
          <div className="text-gray-700 leading-relaxed space-y-3">
            <ReactMarkdown 
              className="markdown-content"
              components={{
                p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-900 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-medium text-gray-900 mb-2">{children}</h3>,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 italic">
            No AI summary available for this video.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This could be due to missing transcript data or processing limitations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Summary; 