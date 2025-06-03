'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // Or your apiClient, ensure it's configured for http://localhost:8000
import { useRouter } from 'next/navigation';
import { BarChart2, Clock, Gift, Zap, AlertTriangle, Info } from 'lucide-react'; // Example icons

export default function ProfilePage() {
  const router = useRouter();
  // In a real app, userId would come from auth context or route parameter if viewing others' profiles
  const userId = 1; // Hardcoded for now as per instructions

  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!userId) {
        setError("User ID not available. Please log in.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null); // Reset error before new fetch
      setRecommendation(null); // Reset recommendation
      try {
        // Ensure backend API endpoint is correct
        const response = await axios.get(`http://localhost:8000/api/user-segments/${userId}/recommendation`);
        setRecommendation(response.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError(`No recommendation data currently available for user ${userId}. Play more to get insights!`);
          } else {
            setError(`Error ${err.response.status}: ${err.response.data.detail || 'Failed to fetch recommendations.'}`);
          }
        } else if (err.request) {
          setError("Network error: Could not connect to the server. Please try again later.");
        } else {
          setError("An unexpected error occurred while fetching recommendations.");
        }
        console.error("Error fetching recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [userId]); // Re-fetch if userId changes (though it's hardcoded here)

  const formatProbability = (prob) => {
    if (typeof prob !== 'number') return 'N/A';
    return `${(prob * 100).toFixed(0)}%`;
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-slate-900 to-gray-800 min-h-screen text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">
          Your Profile & Insights
        </h1>
        <p className="text-xl text-gray-400">
          Personalized recommendations to enhance your gaming experience.
        </p>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-gray-400 p-10">
          <Zap size={56} className="animate-pulse text-purple-400 mb-4" />
          <p className="text-lg">Fetching your personalized insights...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="max-w-md mx-auto bg-red-800 border border-red-700 text-red-200 p-6 rounded-lg shadow-xl text-center">
          <div className="flex justify-center mb-3">
            <AlertTriangle size={40} className="text-red-400" />
          </div>
          <p className="text-xl font-semibold mb-1">Oops! An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {recommendation && !isLoading && !error && (
        <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          <div className="flex items-center mb-8 pb-4 border-b border-gray-700">
            <div className="p-3 bg-purple-600 rounded-full mr-5">
                <BarChart2 size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-purple-300">Your Next Best Move</h2>
              <p className="text-sm text-gray-400">
                RFM: <span className="font-semibold text-gray-300">{recommendation.rfm_group || 'N/A'}</span> |
                Risk: <span className="font-semibold text-gray-300">{recommendation.risk_profile || 'N/A'}</span> |
                Streak: <span className="font-semibold text-gray-300">{recommendation.streak_count} days</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start p-5 bg-gray-700 rounded-lg shadow-md">
              <div className="p-2 bg-purple-500 rounded-md mr-4 mt-1">
                <Gift size={24} className="text-white" />
              </div>
              <div>
                <p className="text-md font-semibold text-gray-300">Personalized Reward Chance</p>
                <p className="text-2xl font-bold text-purple-300">{formatProbability(recommendation.recommended_reward_probability)}</p>
                <p className="text-xs text-gray-500">Engage now for a higher chance to win!</p>
              </div>
            </div>

            <div className="flex items-start p-5 bg-gray-700 rounded-lg shadow-md">
              <div className="p-2 bg-indigo-500 rounded-md mr-4 mt-1">
                 <Clock size={24} className="text-white" />
              </div>
              <div>
                <p className="text-md font-semibold text-gray-300">Optimal Engagement Window</p>
                <p className="text-2xl font-bold text-indigo-300">{recommendation.recommended_time_window || 'Anytime'}</p>
                <p className="text-xs text-gray-500">This is when you're likely to have the best experience.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/slots')} // Assuming /slots is the primary game page
            className="mt-10 w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 ease-in-out text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50"
          >
            Try Your Luck: Play Slots!
          </button>
        </div>
      )}

      {!recommendation && !isLoading && !error && (
         <div className="max-w-md mx-auto bg-yellow-800 border border-yellow-700 text-yellow-200 p-6 rounded-lg shadow-xl text-center">
            <div className="flex justify-center mb-3">
                <Info size={40} className="text-yellow-400" />
            </div>
            <p className="text-xl font-semibold mb-1">Insights Pending</p>
            <p className="text-sm">No specific recommendation available at this time. Keep playing to unlock personalized tips and enhance your journey!</p>
        </div>
      )}
    </div>
  );
}
