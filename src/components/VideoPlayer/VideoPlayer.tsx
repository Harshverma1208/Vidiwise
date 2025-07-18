import React from 'react';
"use client";

import { motion } from 'framer-motion';

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  isLoading?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title, isLoading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="glass-card p-4"
    >
      <div className={`aspect-video rounded-xl overflow-hidden bg-gray-900 ${isLoading && "animate-pulse bg-gray-300"}`}>
        {videoId && !isLoading ? (
          <iframe
            width="100%"
            height="100%"
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
            title={title || "YouTube Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white/80">Loading video...</p>
              </div>
            ) : (
              <div className="text-white/60 text-center">
                <p>Video not available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoPlayer; 