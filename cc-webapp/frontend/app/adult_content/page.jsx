// cc-webapp/frontend/app/adult_content/page.jsx
'use client';

import React from 'react'; // React import for clarity
import AdultContentViewer from '@/components/AdultContentViewer';
import Link from 'next/link';
import Head from 'next/head'; // For older Next.js versions or specific client-side title updates
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion'; // Added for animations
import { useEffect } from 'react'; // For setting document title if needed

// For Next.js 13+ App Router, metadata can be exported for server components:
// export const metadata = {
//   title: 'Exclusive Content - CC Webapp',
//   description: 'View your unlocked adult content stages.',
// };

export default function AdultContentPage() {
  const currentUserId = 1; // As per guideline, use 1 or accept as prop

  // If this page must be a Client Component and needs to set the title:
  useEffect(() => {
    document.title = 'Exclusive Content - CC Webapp';
  }, []);

  return (
    <>
      {/* Fallback for title if not using App Router metadata export or for dynamic client titles */}
      <Head>
        <title>Exclusive Content - CC Webapp</title>
        <meta name="description" content="View your unlocked adult content stages." />
      </Head>
      <div className="container mx-auto px-2 sm:px-4 py-8 bg-gray-900 min-h-screen text-white selection:bg-purple-500 selection:text-white">
        <header className="mb-6 sm:mb-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-0 left-0 sm:left-2"
          >
            <Link href="/" legacyBehavior={false}>
              <a className="text-purple-400 hover:text-purple-300 transition-colors p-2 rounded-full hover:bg-gray-700 flex items-center text-sm">
                <ArrowLeft size={18} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </a>
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 pt-8 sm:pt-0"
          >
            Exclusive Content Chamber
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-md text-gray-400 mt-2"
          >
            View your unlocked special content below.
          </motion.p>
        </header>
        <main className="w-full">
          <AdultContentViewer userId={currentUserId} />
        </main>
        <footer className="text-center mt-10 py-6 border-t border-gray-700">
          <Link href="/" legacyBehavior={false}>
            <a className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-purple-300 rounded-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <Home size={16} className="mr-2" />
              Back to Home
            </a>
          </Link>
        </footer>
      </div>
    </>
  );
}
