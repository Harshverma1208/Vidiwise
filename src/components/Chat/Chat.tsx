'use client'

import React, { useEffect, useState, useRef } from 'react'
import { CgClose } from 'react-icons/cg';
import { IoMdSend } from "react-icons/io";
import { X, Send, MessageCircle, Sparkles } from "lucide-react";
import { type TranscriptProps } from '~/app/c/[creatorId]/vid/[vidId]/page';
import { textTotext } from '~/lib/helpers/gemini';
"use client";

import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({
  showMobileChat,
  setshowMobileChat,
  transcripts,
}: {
  showMobileChat: boolean;
  setshowMobileChat: (showMobileChat: boolean) => void;
  transcripts: TranscriptProps[];
}) => {
  const [chatTraining, setchatTraining] = useState(true);
  const suggestions = [
    "What is this video about?",
    "Summarize the key points",
    "What are the main topics covered?",
    "Explain this concept",
    "How does this work?",
    "What are the benefits mentioned?",
  ];
  const [para, setpara] = useState("")
  const [input, setinput] = useState("");
  const [chatResponse, setchatResponse] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    setisLoading(true);
    const question = input;
    setinput("");
    
    try {
      const answer = await textTotext(question, para);
      setChatHistory(prev => [...prev, { question, answer }]);
      setchatResponse(answer);
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setisLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setinput(suggestion);
  };

  useEffect(() => {
    let text = "";
    transcripts.forEach((item) => {
      text += item.transcriptText + " ";
    });
    setpara(text);
  }, [transcripts]);

  // Desktop Chat Sidebar
  const DesktopChat = () => (
    <div className="hidden lg:block h-full">
      <div className="glass-card h-[calc(100vh-12rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200/50">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Ask about this video</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatHistory.length === 0 && !isLoading && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm font-medium">Try asking:</p>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
              </div>
            )}

          {chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* User Question */}
              <div className="flex justify-end">
                <div className="max-w-[80%] p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg rounded-br-sm">
                  <p className="text-sm">{chat.question}</p>
                </div>
              </div>
              
              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-[90%] p-3 bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{chat.answer}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

            {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Thinking...</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Auto-scroll target */}
          <div ref={messagesEndRef} />
            </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <input
                value={input}
                onChange={(e) => setinput(e.target.value)}
                onKeyDown={handleEnter}
                type="text"
              className="flex-1 bg-transparent text-sm placeholder:text-gray-500 focus:outline-none"
              placeholder="Ask about this video..."
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="p-2 text-gray-400 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Chat Overlay
  const MobileChat = () => (
    <AnimatePresence>
      {showMobileChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setshowMobileChat(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-sm text-gray-600">Ask about this video</p>
                </div>
              </div>
              <motion.button
                onClick={() => setshowMobileChat(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile Chat Content - Same as desktop but scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && !isLoading && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm font-medium">Try asking:</p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          handleSuggestionClick(suggestion);
                          // Auto-submit on mobile for better UX
                          setTimeout(() => handleSubmit(), 100);
                        }}
                        className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex justify-end">
                    <div className="max-w-[80%] p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg rounded-br-sm">
                      <p className="text-sm">{chat.question}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="max-w-[90%] p-3 bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{chat.answer}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[90%] p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-gray-600">Thinking...</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Auto-scroll target for mobile */}
              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
              <input
                value={input}
                onChange={(e) => setinput(e.target.value)}
                onKeyDown={handleEnter}
                type="text"
                  className="flex-1 text-sm placeholder:text-gray-500 focus:outline-none"
                  placeholder="Ask about this video..."
                  disabled={isLoading}
                />
                <motion.button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="p-2 text-gray-400 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopChat />
      <MobileChat />
    </>
  );
};

export default Chat
