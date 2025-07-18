"use client";

import { useCallback, useEffect, useState } from "react";
import { BiHome, BiQuestionMark, BiSolidShareAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Chat from "~/components/Chat/Chat";
import Transcript from "~/components/Transcript/Transcript";
import {
  fetchTranscriptDBCreator,
  fetchTranscriptionRows,
  fetchVideoTranscrptDB,
} from "~/lib/helpers/transcript";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";
import { TiArrowBack } from "react-icons/ti";
import { useToast } from "~/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { MdDashboard } from "react-icons/md";
import { motion } from "framer-motion";
import { Play, Share2, Home, MessageCircle, FileText, Sparkles } from "lucide-react";

export interface TranscriptProps {
  videoId: string;
  id: number;
  createdAt: Date;
  updatedAt: Date | null;
  transcriptText: string;
  duration: string;
  offset: string;
}

export interface Transcription {
  id: number;
  title: string;
  videoId: string;
  summary: string;
}

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [showMobileChat, setshowMobileChat] = useState(false);
  const [res, setres] = useState<TranscriptProps[] | []>([]);
  const [vidId, setvidId] = useState("");
  const [para, setpara] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const [transcript, settranscript] = useState<Transcription>({
    id: 0,
    title: "",
    videoId: "",
    summary: "",
  });

  useEffect(() => {
    async function init() {
      const path = window.location.pathname;
      const segments = path.split("/");
      const videoId = segments[segments.length - 1];
      const creatorId = segments[segments.length - 3];

      if (videoId && creatorId) {
        setisLoading(true);
        setvidId(videoId);

        const transcriptData = await fetchTranscriptDBCreator(videoId, creatorId);
        if (transcriptData.length > 0) {
          settranscript(transcriptData[0]);
        }

        const transcriptRows = await fetchTranscriptionRows(videoId);
        setres(transcriptRows);
        setisLoading(false);
      }
    }

    init();
  }, []);

  const showToast = () => {
    toast({
      title: "Resources Available Soon",
      description: "We are working on making this feature available soon.",
    });
  };

  const copyToClipboard = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "The link has been copied to your clipboard",
    });
  };

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
                onClick={() => {
                  const path: string = window.location.pathname;
                  const parts: string[] = path.split("/vid");
                  router.push(parts[0] ?? "/generate");
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdDashboard className="w-5 h-5" />
                <span className="hidden sm:block">Dashboard</span>
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

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:block">Share</span>
              </motion.button>
              
              <motion.button
                onClick={showToast}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors opacity-60"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="w-5 h-5" />
                <span className="hidden sm:block">Resources</span>
              </motion.button>
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
                {transcript.title || "Loading..."}
              </h1>
            </motion.div>

            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-4"
            >
              <div className={`aspect-video rounded-xl overflow-hidden bg-gray-900 ${!vidId && "animate-pulse bg-gray-300"}`}>
                {vidId && (
                  <iframe
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${vidId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            </motion.div>

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
                  <Transcript transcripts={res} loading={isLoading} />
                </TabsContent>
                
                <TabsContent value="summary" className="mt-0">
                  <div className="prose max-w-none">
                    {transcript.summary ? (
                      <div className="text-gray-700 leading-relaxed">
                        {transcript.summary}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic text-center py-8">
                        No AI summary available for this video.
                      </div>
                    )}
                  </div>
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
                setshowMobileChat={setshowMobileChat}
                transcripts={res}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Chat Button */}
      {!showMobileChat && (
        <motion.button
          onClick={() => setshowMobileChat(!showMobileChat)}
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

export default Page;
