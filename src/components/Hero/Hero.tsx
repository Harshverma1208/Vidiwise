'use client';

import React from "react";
import Title, { SubTitle } from "../ui/Title";
import content from "~/config/content";
import Image from "next/legacy/image";
import Button from "../ui/Button";
import { ArrowRight, Play, Zap } from "lucide-react";
import SearchButton from "./SearchButton";
"use client";

import { motion } from 'framer-motion';
import Link from "next/link";

const Hero = () => {
  const { hero } = content.home;
  
  // Mock data for user display (will be replaced with API call later)
  const userImages = [
    { name: "Alice", image: "https://avatars.githubusercontent.com/u/1?v=4" },
    { name: "Bob", image: "https://avatars.githubusercontent.com/u/2?v=4" },
    { name: "Charlie", image: "https://avatars.githubusercontent.com/u/3?v=4" },
    { name: "Diana", image: "https://avatars.githubusercontent.com/u/4?v=4" },
    { name: "Eve", image: "https://avatars.githubusercontent.com/u/5?v=4" },
  ];
  
  const userCount = 2500;
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            {/* Main heading with animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight">
                <span className="block">{hero.title[0]}</span>
                <span className="block gradient-text">{hero.title[1]}</span>
              </h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {hero.subtitle}
                </p>
              </motion.div>
            </motion.div>

            {/* CTA Section with animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col items-center space-y-8"
            >
              {/* Main CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <SearchButton />
                <Link href="#features">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 px-8 py-3 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
                  >
                    <Play size={20} />
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex flex-wrap justify-center gap-6 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-green-500" />
                  <span>Instant transcripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-blue-500" />
                  <span>AI summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-purple-500" />
                  <span>Chat with videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-orange-500" />
                  <span>100% Free</span>
                </div>
              </motion.div>
              
              {/* User testimonial */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col items-center space-y-4"
              >
                <UserCards userImages={userImages} />
                <p className="text-gray-600 font-medium">
                  Join {userCount.toLocaleString()}+ users transforming videos into knowledge
                </p>
              </motion.div>
            </motion.div>

            {/* Video showcase */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-16 max-w-5xl mx-auto"
            >
              <div className="glass-card p-4 shadow-glass hover:shadow-2xl transition-all duration-500">
                <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
                  <iframe
                    width="100%"
                    height="500"
                    title="Vidiwise Walkthrough"
                    className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
                    src={`https://www.youtube.com/embed/fBqrn4nXFlc`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// UserCards component
const UserCards = ({ userImages }: { userImages: { name: string; image: string }[] }) => {
  return (
    <div className="flex -space-x-2">
      {userImages.map((user, index) => (
        <motion.div
          key={user.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
          className="relative"
        >
          <Image
            src={user.image}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full border-3 border-white shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Hero;
