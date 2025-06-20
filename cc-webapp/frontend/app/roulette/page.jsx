// cc-webapp/frontend/app/roulette/page.jsx
'use client';

import React from 'react'; // React import for clarity
import Roulette from '@/components/archive/Roulette';
// import Head from 'next/head'; // For Pages Router. App Router uses metadata export.
import { useEffect } from 'react'; // For setting document title if needed in client component
import { motion } from 'framer-motion';

export default function RoulettePage() {
  const currentUserId = 1; // As per guideline, using a placeholder

  // If this page must be a Client Component and needs to set the title:
  useEffect(() => {
    document.title = 'Wheel of Fortune - CC Webapp';
  }, []);

  return (
    <>
      {/*
      <Head>
        <title>Wheel of Fortune - CC Webapp</title>
        <meta name="description" content="Spin the Wheel of Fortune for amazing prizes!" />
      </Head>
      */}
      <div className="container mx-auto px-2 sm:px-4 py-8 bg-gray-900 min-h-screen flex flex-col items-center justify-start pt-10 sm:pt-16 selection:bg-teal-500 selection:text-white">
        <header className="mb-8 sm:mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-500 tracking-tight"
          >
            Wheel of Fortune
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-md sm:text-lg text-gray-300 mt-3 max-w-md mx-auto"
          >
            Spin the wheel for dazzling prizes and test your luck!
          </motion.p>
        </header>
        <main className="w-full flex justify-center">
          <Roulette userId={currentUserId} />
        </main>
        <footer className="text-center mt-10 sm:mt-12 text-xs text-gray-500 pb-8">
          <p>Fortune favors the bold! All outcomes are determined by chance.</p>
          <p>&copy; {new Date().getFullYear()} CC Webapp. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

// For Next.js 13+ App Router, metadata can be exported if this were a Server Component:
// export const metadata = {
//   title: 'Wheel of Fortune - CC Webapp',
//   description: 'Spin the Wheel of Fortune for amazing prizes!',
// };
