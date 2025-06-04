'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // Or your apiClient
import { useRouter } from 'next/navigation';
import { BarChart2, Clock, Gift, Zap, AlertTriangle, Info, PlayCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const userId = 1; // Placeholder, replace with actual user ID from auth context

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
      setError(null);
      setRecommendation(null); // Reset on new fetch
      try {
        const response = await axios.get(`http://localhost:8000/api/user-segments/${userId}/recommendation`);
        setRecommendation(response.data);
      } catch (err) {
        if (err.response) {
            if (err.response.status === 404) {
                // Assuming 404 from this endpoint means no recommendation data specifically
                setError(`No recommendation data currently available for user ${userId}. Keep playing to unlock insights!`);
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
  }, [userId]);

  const formatProbability = (prob) => {
    if (typeof prob !== 'number') return 'N/A';
    return `${(prob * 100).toFixed(0)}%`;
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen text-white">
      <header className="text-center mb-12 pt-4 sm:pt-0"> {/* Adjusted padding for banner */}
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Your Profile & Insights
        </h1>
        <p className="text-lg text-gray-300 mt-3">Personalized recommendations to enhance your experience.</p>
      </header>

      <main> {/* Removed pt-12 as banner will be part of layout flow or main content pushed down */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-purple-400 p-10">
            <Zap size={52} className="animate-ping mb-4" />
            <p className="text-lg">Fetching your personalized insights...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-6 py-5 rounded-lg shadow-xl max-w-lg mx-auto text-center flex flex-col items-center">
            <AlertTriangle size={36} className="mb-3 text-red-400" />
            <p className="text-xl font-semibold mb-1">Accessing Insights Failed</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {recommendation && !isLoading && !error && (
          <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-purple-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-center mb-8 pb-4 border-b border-gray-700">
              <div className="p-3 bg-purple-600 rounded-full mr-5 shadow-md">
                  <BarChart2 size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Your Next Best Move</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  RFM: <span className="font-semibold text-gray-200">{recommendation.rfm_group || 'N/A'}</span> |
                  Risk: <span className="font-semibold text-gray-200">{recommendation.risk_profile || 'N/A'}</span> |
                  Streak: <span className="font-semibold text-gray-200">{recommendation.streak_count ?? '0'} days</span>
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center p-5 bg-gray-700 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow">
                <div className="p-2.5 bg-purple-500 rounded-lg mr-4">
                  <Gift size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-md font-semibold text-gray-200">Personalized Reward Chance</p>
                  <p className="text-2xl font-bold text-purple-300">{formatProbability(recommendation.recommended_reward_probability)}</p>
                </div>
              </div>

              <div className="flex items-center p-5 bg-gray-700 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-shadow">
                <div className="p-2.5 bg-indigo-500 rounded-lg mr-4">
                   <Clock size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-md font-semibold text-gray-200">Optimal Engagement Window</p>
                  <p className="text-2xl font-bold text-indigo-300">{recommendation.recommended_time_window || 'Anytime'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/slots')} // Assuming /slots is a relevant game page
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-60 flex items-center justify-center"
            >
              <PlayCircle size={24} className="mr-2.5" />
              Play Now & Test Your Luck!
            </button>
          </div>
        )}

        {!isLoading && !error && !recommendation && (
           <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 px-6 py-5 rounded-lg shadow-xl max-w-lg mx-auto text-center flex flex-col items-center">
            <Info size={36} className="mb-3 text-yellow-400" />
            <p className="text-xl font-semibold mb-1">Insights Pending</p>
            <p className="text-sm">No specific recommendation available at this time. Keep playing to unlock personalized tips and enhance your journey!</p>
          </div>
        )}
      </main>
    </div>
  );
}
