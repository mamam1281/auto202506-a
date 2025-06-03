'use client'; // Needed if you plan to use hooks directly here or for client-side logic

import AdultContentViewer from '@/components/AdultContentViewer'; // Adjust path as needed
// If using a global context for userId:
// import { useAuth } from '@/context/AuthContext'; // Example

export default function AdultContentPage() {
  // In a real app, userId would come from authentication context/session
  // const { userId } = useAuth(); // Example if using AuthContext
  const userId = 1; // Placeholder for now, as per instructions

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Exclusive Content Portal
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Unlock and view your specially curated content below.
        </p>
      </header>

      {userId ? (
        <AdultContentViewer userId={userId} />
      ) : (
        <div className="text-center p-10 text-red-500 bg-red-100 border border-red-300 rounded-md">
          User not authenticated. Please log in to view content.
        </div>
      )}
    </div>
  );
}
