// cc-webapp/frontend/app/slots/page.jsx
'use client';

import React from 'react';
import { SlotMachine } from '../../components/ui/game/slots'; // 새 버전 경로로 수정
// import Head from 'next/head'; // For Pages Router. App Router uses metadata export.
import { useEffect } from 'react'; // For setting document title if needed in client component

export default function SlotsPage() {
  const currentUserId = 1; // As per guideline, using a placeholder

  // For App Router, metadata should ideally be exported from a Server Component,
  // or from this page if it were a Server Component.
  // If this page must be a Client Component and needs to set the title:
  useEffect(() => {
    document.title = 'Cosmic Slots - CC Webapp';
  }, []);

  return (
    <>
      {/*
      <Head>
        <title>Cosmic Slots - CC Webapp</title>
        <meta name="description" content="Try your luck at the Cosmic Slots and win big rewards!" />
      </Head>
      */}
      <div className="container mx-auto px-2 sm:px-4 py-8 bg-gray-900 min-h-screen flex flex-col items-center justify-center selection:bg-green-500 selection:text-white">
        {/* Optional: Add a page-specific header if desired */}
        {/*
        <header className="mb-8 sm:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500">
            Cosmic Slots Adventure
          </h1>
          <p className="text-md sm:text-lg text-gray-300 mt-3">Align the celestial symbols for great fortune!</p>
        </header>
        */}        <main className="w-full max-w-lg"> {/* Constrain width of the slot machine for better focus */}
          {/* <SlotMachine userId={currentUserId} /> */}
          <div className="text-center text-white">슬롯머신 개발 중...</div>
        </main>
        <footer className="text-center mt-10 text-xs text-gray-500 pb-8">
          <p>Slot machine outcomes are determined purely by chance. Enjoy responsibly.</p>
          <p>&copy; {new Date().getFullYear()} CC Webapp. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

// For Next.js 13+ App Router, metadata can be exported if this were a Server Component:
// export const metadata = {
//   title: 'Cosmic Slots - CC Webapp',
//   description: 'Try your luck at the Cosmic Slots and win big rewards!',
// };
