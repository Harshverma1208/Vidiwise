import React from 'react'
import { type TranscriptProps } from '~/app/c/[creatorId]/vid/[vidId]/page';
import { AlertCircle, RefreshCw, FileText } from 'lucide-react';

const Transcript = ({ 
  transcripts, 
  loading, 
  onRetry 
}: { 
  transcripts: TranscriptProps[], 
  loading: boolean,
  onRetry?: () => void 
}) => {

  console.log('🎬 Transcript component received:', {
    transcriptsCount: transcripts.length,
    loading,
    firstItem: transcripts[0]
  });

  return (
    <div className="transcript relative overflow-y-scroll md:space-y-5">
      <div className="pb-5 text-xl leading-10">
        {loading && transcripts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">Extracting transcript...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </div>
        )}
        
        {transcripts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">No Transcript Available</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>This video doesn't have an available transcript.</p>
                <p className="text-xs">Possible reasons:</p>
                <ul className="text-xs text-left list-disc list-inside space-y-1 max-w-md">
                  <li>The video doesn't have closed captions enabled</li>
                  <li>Auto-generated captions are disabled</li>
                  <li>The video is too new or private</li>
                  <li>YouTube's transcript API is temporarily unavailable</li>
                </ul>
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Try popular educational videos, TED Talks, or videos with manual captions for better results.
                </div>
              </div>
            </div>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
            
            <div className="text-xs text-gray-400 text-center">
              <p>💡 Try a different video or check if the video has captions enabled on YouTube</p>
            </div>
          </div>
        )}
        
        {transcripts.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <FileText className="w-4 h-4 text-green-600" />
              <span>{transcripts.length} transcript segments found</span>
            </div>
            
            {transcripts.map((item: TranscriptProps, index: number) => {
              return (
                <div key={index} className="flex flex-wrap pb-2 my-4 items-center border-b border-gray-200">
                  <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="text-nowrap md:text-md font-mono text-sm font-bold text-purple-600">
                      {formatTime(parseFloat(item.offset))}-
                      {formatTime(
                        parseFloat(item.offset.toString()) +
                          parseFloat(item.duration.toString()),
                      )}
                      :{" "}
                    </div>

                    <div className="text-md leading-relaxed tracking-wider text-gray-700">
                      {item.transcriptText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export default Transcript
