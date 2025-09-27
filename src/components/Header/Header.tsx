"use client";

import React from 'react'
import Image from "next/legacy/image"
import Link from 'next/link'
import Button from '../ui/Button'
import content from '~/config/content'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { header } = content.home;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="relative">
                  <Image 
                    src={"/logo.svg"} 
                    alt="Vidiwise logo" 
                    width={32} 
                    height={32}
                    className="rounded-lg"
                  />
                </div>
                <h1 className="gradient-text text-xl font-bold tracking-tight">
                  {header.title}
                </h1>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8">
              {header.links.map((link, index) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    className={`${
                      link.active 
                        ? "text-gray-900 font-semibold" 
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors duration-200 hover:font-semibold text-sm`}
                    href={link.url}
                    rel="noreferrer"
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
            
            {/* CTA Section */}
            <div className="flex items-center gap-4">
              <Link href="/generate">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-sm">
                  Start Exploring
                </Button>
              </Link>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              {header.links.map((link) => (
                <Link
                  key={link.id}
                  className="block text-gray-600 hover:text-gray-900 py-2"
                  href={link.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              <Link
                href="/generate"
                className="block w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 rounded-full">
                  Start Exploring
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;