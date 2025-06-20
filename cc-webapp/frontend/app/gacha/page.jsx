// cc-webapp/frontend/app/gacha/page.jsx
'use client';

import React, { useEffect } from 'react'; // React import for clarity
import { motion } from 'framer-motion'; // Import motion for animations
// import Gacha from '@/components/archive/Gacha'; // TODO: 재구현 필요
// import { useAuth } from '@/context/AuthContext'; // Example if using auth context
// import Head from 'next/head'; // next/head is for Pages Router. For App Router, use metadata export.

// For App Router, metadata should be exported if needed (cannot be in client component directly)
// This can be done in a parent server component or this page if it were a server component.
// Since this page is 'use client', we'd typically put metadata in a parent layout.js or page.js (server component).
// For simplicity, if this page is the main entry for /gacha, and it's a client component,
// document.title can be set in a useEffect hook if needed, or metadata handled by a higher layout.

export default function GachaPage() {
  // const { userId } = useAuth() || { userId: 1 }; // Example for dynamic userId
  const currentUserId = 1; // As per guideline, using a placeholder

  // If you need to set document title from a client component:
  useEffect(() => {
    document.title = 'Gacha Shrine - CC Webapp';
  }, []);

  return (
    <>
      {/* <Head> tags from next/head are not used in App Router.
          Instead, export a metadata object from server components or use specific functions.
          If this page MUST be client component and needs to modify head, it's more complex.
          Usually, parent layout.js (server component) handles global metadata.
      <Head>
        <title>Gacha Shrine - CC Webapp</title>
        <meta name="description" content="Try your luck at the Mystic Gacha Shrine and win exclusive rewards!" />
      </Head>
      */}
      <div className="container mx-auto px-2 sm:px-4 py-8 bg-gray-900 min-h-screen flex flex-col items-center justify-start pt-10 sm:pt-16">
        <header className="mb-8 sm:mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 tracking-tight"
          >
            The Gacha Shrine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-md sm:text-lg text-gray-300 mt-3 max-w-md mx-auto"
          >
            Test your luck and win exclusive rewards! What wonders will fate bestow upon you?
          </motion.p>        </header>
        <main className="w-full flex justify-center">
          {/* <Gacha userId={currentUserId} /> */}
          {/* TODO: Gacha 컴포넌트 재구현 필요 */}
          <div className="text-center py-20">
            <h2 className="text-xl text-gray-400 mb-4">🎰 Under Construction 🎰</h2>
            <p className="text-gray-500">Gacha 게임 컴포넌트를 재구현 중입니다.</p>
          </div>
        </main>
        <footer className="text-center mt-10 sm:mt-12 text-xs text-gray-500 pb-8">
          <p>Gacha results are determined by chance. Please play responsibly.</p>
          <p>&copy; {new Date().getFullYear()} CC Webapp. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

// If this file could be a Server Component, or its parent is:
// export const metadata = {
//   title: 'Gacha Shrine - CC Webapp',
//   description: 'Try your luck at the Mystic Gacha Shrine and win exclusive rewards!',
// };
