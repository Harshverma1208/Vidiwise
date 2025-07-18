'use client';

import React from 'react'
import Image from "next/legacy/image"
import Link from 'next/link'
import Button from '../ui/Button'
import content from '~/config/content'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { User, Menu, X, ChevronDown, Settings, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Header = () => {
  const { header } = content.home;
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            
            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-3">
                  <Link href="/generate">
                    <Button className="hidden sm:block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-sm">
                      Dashboard
                    </Button>
                  </Link>
                  
                  {/* Profile Dropdown */}
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
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/api/auth/signin">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-sm">
                      Sign in with Google
                    </Button>
                  </Link>
                </motion.div>
              )}
              
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
              {session && (
                <>
                  <Link
                    href="/generate"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 rounded-full">
                      Dashboard
                    </Button>
                  </Link>
                  
                  <Link
                    href={`/c/${session.user?.id}/profile`}
                    className="flex items-center gap-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings size={16} />
                    Profile Settings
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700 w-full text-left"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              )}
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
