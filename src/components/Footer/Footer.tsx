"use client";

import Image from "next/legacy/image";
import Link from 'next/link';
import React from 'react'
import content from '~/config/content';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { Github, Twitter, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
    const { header } = content.home;
    
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <motion.div 
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Image 
                                src={"/logo.svg"} 
                                alt="Vidiwise logo" 
                                width={40} 
                                height={40}
                                className="rounded-lg"
                            />
                            <h3 className="text-2xl font-bold gradient-text">{header.title}</h3>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                            Turn any video into smart knowledge with AI-powered summaries, 
                            interactive transcripts, and intelligent chat assistance. Free to use, forever.
                        </p>
                        <div className="flex gap-4">
                            <Link 
                                href="/generate" 
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                Start Exploring
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Product Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-semibold text-lg mb-4">Product</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <Link href="#features" className="hover:text-white transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/generate" className="hover:text-white transition-colors">
                                    Try it Free
                                </Link>
                            </li>
                            <li>
                                <Link href="#keysteps" className="hover:text-white transition-colors">
                                    How it Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-semibold text-lg mb-4">Company</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="border-t border-gray-800 mt-12 pt-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-400">
                            <span>Made with</span>
                            <Heart size={16} className="text-red-500" />
                            <span>for video learners everywhere</span>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <Link 
                                href="https://github.com" 
                                className="text-gray-400 hover:text-white transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github size={20} />
                            </Link>
                            <Link 
                                href="https://twitter.com" 
                                className="text-gray-400 hover:text-white transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Twitter size={20} />
                            </Link>
                            <Link 
                                href="mailto:hello@vidiwise.com" 
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="text-center text-gray-500 text-sm mt-4">
                        <p>&copy; 2024 Vidiwise. All rights reserved.</p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
