// cc-webapp/frontend/app/profile/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import apiClient from '@/utils/apiClient'; // If you have a central apiClient
import { useRouter } from 'next/navigation';
import Head from 'next/head'; // For older Next.js or specific client-side title needs
import { BarChart2, Clock, Gift, Zap, AlertTriangle, Info, PlayCircle, UserCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
// Ensure React is imported if not automatically handled by your JSX transform
// import React from 'react'; (already imported by React, { useState... })

// For Next.js 13+ App Router, metadata can be exported for server components:
// export const metadata = {
//   title: 'Your Profile & Insights - CC Webapp',
//   description: 'View your personalized recommendations and game statistics.',
// };

export default function ProfilePage() {
  const router = useRouter();
  const currentUserId = 1; // As per guideline, use 1 or accept as prop

  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // apiClient setup (use global if available, or define per component)
  const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });


  useEffect(() => {
    let isMounted = true; // Prevent state updates if component is unmounted
    const fetchRecommendation = async () => {
      if (!currentUserId) {
        if(isMounted) setError("User ID not available. Cannot fetch profile data.");
        if(isMounted) setIsLoading(false);
        return;
      }
      if(isMounted) setIsLoading(true);
      if(isMounted) setError(null);
      if(isMounted) setRecommendation(null); // Reset on new fetch
      try {
        const response = await apiClient.get(`/user-segments/${currentUserId}/recommendation`);
        if (isMounted) setRecommendation(response.data);
      } catch (err) {
        if (!isMounted) return;
        let errorMessage = "Failed to fetch recommendations. Please try again later.";
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = `No recommendation data found for user ${currentUserId}. Keep playing to generate insights!`;
          } else {
            errorMessage = `Error (${err.response.status}): ${err.response.data?.detail || 'Could not fetch recommendations.'}`;
          }
        } else if (err.request) {
          errorMessage = 'No response from server. Check your connection or if the backend is running.';
        }
        setError(errorMessage);
        console.error("Error fetching recommendations:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecommendation();
    return () => { isMounted = false; }; // Cleanup
  }, [currentUserId]); // Re-fetch if userId changes (e.g. after login)

  const formatProbability = (prob) => {
    if (typeof prob !== 'number' || isNaN(prob)) return 'N/A';
    return `${(prob * 100).toFixed(0)}%`;
  };

  const handleLogout = () => {
    // Placeholder for actual logout logic (e.g., clear token, call API, update auth context)
    console.log("User logged out (placeholder action)");
    alert("Logout functionality not fully implemented in this demo.");
    // router.push('/'); // Example: Redirect to home after logout
  };

  // If this page must be a Client Component and needs to set the title dynamically:
  useEffect(() => {
    if (recommendation) {
      document.title = `Profile: ${recommendation.rfm_group || 'User'} - CC Webapp`;
    } else {
      document.title = 'Your Profile & Insights - CC Webapp';
    }
  }, [recommendation]);


  return (
    <>
      {/* <Head> component for Next.js < 13 or specific client-side updates */}
      <Head>
        <title>Your Profile & Insights - CC Webapp</title>
        <meta name="description" content="View your personalized recommendations and game statistics." />
      </Head>
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 bg-gray-900 min-h-screen text-white selection:bg-indigo-500 selection:text-white">
        <header className="text-center mb-8 sm:mb-10">
           <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
            className="inline-block p-2 bg-gray-700 rounded-full mb-3"
          >
            <UserCircle size={56} className="text-indigo-300" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"
          >
            Your Profile & Game Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-md text-gray-400 mt-2"
          >
            Personalized tips to maximize your fun and rewards!
          </motion.p>
        </header>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-indigo-300 min-h-[200px] p-6">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="p-2"
            >
              <Zap size={40} />
            </motion.div>
            <p className="text-lg mt-2">Fetching your personalized insights...</p>
          </div>
        )}

        {!isLoading && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-800 border border-red-600 text-red-200 px-4 sm:px-6 py-5 rounded-lg shadow-lg max-w-lg mx-auto text-center flex flex-col items-center"
          >
            <AlertTriangle size={36} className="mb-3 text-red-300" />
            <p className="font-semibold text-md mb-1">Oops! Could not load insights.</p>
            <p className="text-xs sm:text-sm">{error}</p>
          </motion.div>
        )}

        {!isLoading && !error && recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-lg mx-auto bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-indigo-700 hover:border-indigo-500 transition-colors"
          >
            <div className="flex items-center mb-5 pb-4 border-b border-gray-700">
              <BarChart2 size={36} className="text-indigo-400 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">Your Next Best Move</h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  RFM: <span className="font-medium text-indigo-300">{recommendation.rfm_group || 'N/A'}</span>,
                  Risk: <span className="font-medium text-indigo-300">{recommendation.risk_profile || 'N/A'}</span>,
                  Streak: <span className="font-medium text-indigo-300">{recommendation.streak_count ?? '0'} days</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
              <motion.div whileHover={{ x: 5 }} className="flex items-center p-3 sm:p-4 bg-gray-700 rounded-lg shadow-md transition-shadow hover:shadow-purple-500/40">
                <Gift size={24} className="text-purple-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-300">Personalized Reward Chance</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-300">{formatProbability(recommendation.recommended_reward_probability)}</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="flex items-center p-3 sm:p-4 bg-gray-700 rounded-lg shadow-md transition-shadow hover:shadow-cyan-500/40">
                <Clock size={24} className="text-cyan-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-300">Optimal Engagement Window</p>
                  <p className="text-lg sm:text-xl font-bold text-cyan-300">{recommendation.recommended_time_window || 'Anytime'}</p>
                </div>
              </motion.div>
            </div>

            <motion.button
              onClick={() => router.push('/slots')} // Example game page
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out text-md sm:text-lg font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlayCircle size={20} className="mr-2" />
              Play Now & Test Your Luck!
            </motion.button>
          </motion.div>
        )}

        {!isLoading && !error && !recommendation && (
           <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-gray-700 border border-yellow-700_ text-yellow-300 px-4 sm:px-6 py-5 rounded-lg shadow-lg max-w-lg mx-auto text-center flex flex-col items-center"
          >
            <Info size={36} className="mb-3 text-yellow-400" />
            <p className="font-semibold text-md mb-1">Insights Pending</p>
            <p className="text-xs sm:text-sm">No specific recommendation available at this time. Keep playing to unlock personalized tips!</p>
          </motion.div>
        )}

        <div className="mt-12 text-center">
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 text-xs text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05, color: '#f87171' /* red-400 */ }}
            >
              <LogOut size={14} className="mr-2" /> Logout (Placeholder)
            </motion.button>
        </div>
      </div>
    </>
  );
}
