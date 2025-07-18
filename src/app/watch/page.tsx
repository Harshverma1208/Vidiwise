"use client";

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Sparkles, 
  ArrowLeft,
  Share2,
  AlertCircle,
  ChevronDown,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/legacy/image';

// Components
import VideoPlayer from '~/components/VideoPlayer/VideoPlayer';
import Transcript from '~/components/Transcript/Transcript';
import EnhancedTranscript from '~/components/EnhancedTranscript/EnhancedTranscript';
import Summary from '~/components/Summary/Summary';
import Chat from '~/components/Chat/Chat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useToast } from '~/components/ui/use-toast';

interface TranscriptItem {
  transcriptText: string;
  duration: string;
  offset: string;
  videoId: string;
}

interface VideoData {
  success: boolean;
  videoId: string;
  metaData: {
    title: string;
    channelTitle: string;
    thumbnail: string;
    provider: string;
  };
  transcript: TranscriptItem[];
  summary: string;
  fullTranscriptText: string;
  enhancedData?: {
    transcriptVariable: string;
    formattedTranscriptWithTimestamps: string;
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
  };
}

const WatchPageContent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // State
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get URL from query params
  const videoUrl = searchParams.get('url');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch video data
  useEffect(() => {
    if (!videoUrl) {
      setError('No video URL provided');
      setIsLoading(false);
      return;
    }

    if (!session) {
      router.push('/api/auth/signin?callbackUrl=' + encodeURIComponent('/watch?url=' + encodeURIComponent(videoUrl)));
      return;
    }

    const fetchVideoData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/transcript-production?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch video data');
        }

        // Handle case where transcript fetching failed but we still have metadata
        if (data.success === false) {
          console.log('⚠️ Transcript not available, but checking for metadata...');
          
          if (data.metaData) {
            // Set video data with empty transcript but keep metadata
            setVideoData({
              success: true,
              videoId: data.videoId,
              metaData: data.metaData,
              transcript: [],
              summary: 'No transcript available for this video. The video may not have captions enabled.',
              fullTranscriptText: ''
            });
            setSummaryLoading(false);
            
            toast({
              title: "Limited Functionality",
              description: "Transcript not available, but you can still watch the video",
              variant: "default"
            });
            return;
          } else {
            throw new Error(data.error || 'No transcript available for this video');
          }
        }

        console.log('✅ Video data loaded successfully');
        console.log('📊 Metadata:', data.metaData);
        console.log('📝 Transcript segments:', data.transcript?.length || 0);
        console.log('📄 Summary available:', !!data.summary);
        
        // Check for enhanced data
        if (data.enhancedData) {
          console.log('✨ Enhanced transcript data available!');
          console.log('📝 Transcript Variable Length:', data.enhancedData.transcriptVariable?.length || 0);
          console.log('🤖 AI Analysis Available:', !!data.enhancedData.aiAnalysis);
          console.log('📊 Enhanced Metadata:', data.enhancedData.metadata);
        } else {
          console.log('⚠️ Using standard transcript display (no enhanced data)');
        }
        
        setVideoData(data);
        setSummaryLoading(false);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
        toast({
          title: "Error Loading Video",
          description: err instanceof Error ? err.message : 'Failed to load video data',
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoUrl, session, router, toast]);

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: videoData?.metaData.title || 'Video Insights',
          text: 'Check out this video analysis on Vidiwise',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "The link has been copied to your clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsProfileDropdownOpen(false);
      console.log('🔄 Signing out user...');
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Force redirect to home page even if signOut fails
      window.location.href = '/';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-700">Processing Video</h2>
          <p className="text-gray-500">Extracting transcript and generating insights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Unable to Load Video</h2>
          <p className="text-gray-600">{error || 'Something went wrong while processing the video.'}</p>
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Return Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:block">Back</span>
              </motion.button>
              
              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:block">Home</span>
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:block">Share</span>
              </motion.button>

              {session?.user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-600 transition-transform ${
                        isProfileDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user?.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <Link
                          href={`/c/${session.user?.id}/profile`}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          View Profile
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video and Content Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {videoData.metaData.title}
              </h1>
              <p className="text-gray-600 mt-2">
                by {videoData.metaData.channelTitle}
              </p>
            </motion.div>

            {/* Video Player */}
            <VideoPlayer 
              videoId={videoData.videoId} 
              title={videoData.metaData.title}
              isLoading={false}
            />

            {/* Transcript and Summary Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              <Tabs defaultValue="transcript" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="transcript" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Summary
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="transcript" className="mt-0">
                  {videoData.enhancedData ? (
                    <EnhancedTranscript
                      transcriptVariable={videoData.enhancedData.transcriptVariable}
                      formattedTranscriptWithTimestamps={videoData.enhancedData.formattedTranscriptWithTimestamps}
                      transcript={videoData.transcript}
                      aiAnalysis={videoData.enhancedData.aiAnalysis}
                      metadata={videoData.enhancedData.metadata}
                      loading={false}
                      onRetry={() => {
                        console.log('🔄 Retrying enhanced transcript...');
                        window.location.reload();
                      }}
                    />
                  ) : (
                    <Transcript 
                      transcripts={videoData.transcript.map(item => ({
                        ...item,
                        id: parseInt(item.offset),
                        createdAt: new Date(),
                        updatedAt: new Date()
                      }))} 
                      loading={false}
                      onRetry={() => {
                        console.log('🔄 Retrying transcript fetch...');
                        window.location.reload();
                      }}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="summary" className="mt-0">
                  <Summary 
                    summary={videoData.summary} 
                    isLoading={summaryLoading}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Chat Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <Chat
                showMobileChat={showMobileChat}
                setshowMobileChat={setShowMobileChat}
                transcripts={videoData.transcript.map(item => ({
                  ...item,
                  id: parseInt(item.offset),
                  createdAt: new Date(),
                  updatedAt: new Date()
                }))}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Chat Button */}
      {!showMobileChat && (
        <motion.button
          onClick={() => setShowMobileChat(!showMobileChat)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

const WatchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <WatchPageContent />
    </Suspense>
  );
};

export default WatchPage; 