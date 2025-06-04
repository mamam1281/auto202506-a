'use client';

import AdultContentViewer from '@/components/AdultContentViewer';
// Optional: Add a component to get actual userId if auth exists
// import { useAuth } from '@/context/AuthContext'; // Example

export default function AdultContentPage() {
  // const { userId } = useAuth() || { userId: 1 }; // Example if using auth context
  const userId = 1; // Placeholder for now, as per instructions

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 bg-gray-900 min-h-screen">
      <header className="mb-8 pt-4 sm:pt-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 tracking-tight">
          Exclusive Content Chamber
        </h1>
        <p className="text-md sm:text-lg text-gray-400 mt-3 max-w-xl mx-auto">
          Unlock and view your specially curated adult content below. Eligibility is determined by your engagement and segment.
        </p>
      </header>
      <main className="pb-12">
        {userId ? (
          <AdultContentViewer userId={userId} />
        ) : (
          <div className="text-center p-10 text-red-300 bg-gray-800 border border-red-700 rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p>User ID not available. Please log in to view exclusive content.</p>
          </div>
        )}
      </main>
    </div>
  );
}
