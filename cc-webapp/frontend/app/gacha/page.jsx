'use client';

import Gacha from '@/components/Gacha';
// import { useAuth } from '@/context/AuthContext'; // Example for user ID
import Head from 'next/head'; // For setting page title

export default function GachaPage() {
  // const { userId } = useAuth() || { userId: 1 }; // Example if using auth context
  const userId = 1; // Placeholder for now, as per instructions

  return (
    <>
      <Head>
        <title>Gacha Shrine - CC Webapp</title>
        <meta name="description" content="Try your luck at the Mystic Gacha Shrine!" />
      </Head>
      <div className="container mx-auto px-2 sm:px-4 py-8 bg-gray-900 min-h-screen flex flex-col items-center justify-start pt-12 sm:pt-20">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 tracking-tighter">
            The Gacha Shrine
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mt-4 max-w-lg mx-auto">
            Step forth, challenger, and let fate decide your reward!
          </p>
        </header>
        <main className="w-full max-w-lg">
          {userId ? (
            <Gacha userId={userId} />
          ) : (
            <div className="text-center p-10 text-red-300 bg-gray-800 border border-red-700 rounded-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p>Please log in to participate in the Gacha.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
