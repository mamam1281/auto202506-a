// cc-webapp/frontend/components/AdultContentViewer.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Assuming apiClient is a pre-configured axios instance
// If apiClient.js exists and is configured:
// import apiClient from '@/utils/apiClient';
import { Eye, X, Lock, Image as ImageIcon, Video as VideoIcon, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} // Faster backdrop fade
      className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-[200] p-4"
      onClick={onClose} // Close on backdrop click
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }} // Slightly adjusted animation
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.15 } }} // Faster exit
        transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Spring physics
        className="bg-gray-800 p-1 sm:p-2 rounded-lg shadow-2xl max-w-3xl w-full relative text-white border border-purple-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-white transition-colors z-10 p-1 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function AdultContentViewer({ userId = 1 }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false); // Controls blur on thumbnail

  // Use a pre-configured axios instance if apiClient.js is set up
  // For this example, direct axios is used for clarity.
  const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Ensure this matches your backend API base
  });

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component is unmounted
    const fetchUnlockStatus = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      setIsRevealed(false);
      setContent(null);
      try {
        const response = await apiClient.get(`/unlock?user_id=${userId}`);
        if (isMounted) setContent(response.data);
      } catch (err) {
        if (!isMounted) return;
        let errorMessage = 'Failed to load content status. Please try again.';
        if (err.response) {
          const detail = err.response.data?.detail || 'An unexpected error occurred.';
          if (err.response.status === 400 && detail.toLowerCase().includes("all stages already unlocked")) {
            errorMessage = "Congratulations! All content stages are already unlocked.";
          } else if (err.response.status === 403) {
            errorMessage = `Access Denied: ${detail}`;
          } else if (err.response.status === 404) {
            if (detail.toLowerCase().includes("user not found")) {
              errorMessage = "User profile not found. Cannot load content.";
            } else if (detail.toLowerCase().includes("content for stage")) {
              errorMessage = "No new content available for your current level, or the next stage's content is not yet defined.";
            } else {
              errorMessage = `Error (${err.response.status}): Content not found or issue with request.`;
            }
          } else {
            errorMessage = `Error (${err.response.status}): ${detail}`;
          }
        } else if (err.request) {
          errorMessage = 'No response from server. Please check your connection.';
        }
        setError(errorMessage);
        console.error("Error fetching unlock status:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (userId) {
      fetchUnlockStatus();
    } else {
      setError("User ID not provided. Cannot load content.");
      setIsLoading(false);
    }
    return () => { isMounted = false; }; // Cleanup function
  }, [userId]); // apiClient removed from deps as it's stable instance

  const handleRevealClick = () => {
    if (content && content.media_url) {
      setIsRevealed(true);
      setIsModalOpen(true);
    } else if (content) {
      setError("No full media content available to reveal for this stage.");
      // Optionally, still set isRevealed if thumbnail exists
      if (content.thumbnail_url) setIsRevealed(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Consider if thumbnail should re-blur: setIsRevealed(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-400 dark:text-gray-500 min-h-[300px]">
        <motion.div
          animate={{ rotate: [0, 360, 0] }} // Example: a more engaging loading animation
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 bg-purple-600 rounded-full"
        >
          <Lock size={36} className="text-white" />
        </motion.div>
        <p className="mt-4 text-lg">Checking your access & loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-700 text-red-300 border border-red-600 rounded-lg shadow-lg min-h-[300px] max-w-lg mx-auto">
        <AlertTriangle size={40} className="mb-3 text-red-400" />
        <p className="font-semibold text-xl mb-2">Access Issue</p>
        <p className="text-center text-sm">{error}</p>
      </div>
    );
  }

  if (!content || !content.thumbnail_url) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-400 dark:text-gray-500 min-h-[300px] max-w-lg mx-auto bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <ShieldAlert size={40} className="mb-3 text-yellow-400" />
        <p className="text-lg font-semibold">No Content Available</p>
        <p className="text-center text-sm mt-1">No new exclusive content is currently available for you, or the content is missing a thumbnail. Keep playing to unlock more stages!</p>
      </div>
    );
  }

  let mediaElementInModal = null;
  if (content.media_url) {
    if (content.media_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null) {
      mediaElementInModal = <img src={content.media_url} alt={`Full content for Stage ${content.stage}: ${content.name || ''}`} className="w-full h-auto max-h-[85vh] object-contain rounded-md" />;
    } else if (content.media_url.match(/\.(mp4|webm|ogg|ogv)$/i) != null) { // Added ogv
      mediaElementInModal = <video controls autoPlay muted loop src={content.media_url} className="w-full max-h-[85vh] rounded-md outline-none bg-black"><p>Your browser does not support the video tag.</p></video>;
    } else {
      mediaElementInModal = <div className="text-center py-10"><a href={content.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline text-lg">View Media Content (External Link)</a></div>;
    }
  } else {
    mediaElementInModal = <p className="text-gray-400 text-center py-10 text-lg">Full media is not available for this stage.</p>;
  }

  return (
    <div className="p-2 sm:p-4 max-w-xl mx-auto bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-700">
      <header className="mb-4 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-400">Stage {content.stage}: {content.name || 'Unlocked Content'}</h2>
        {content.description && <p className="text-xs sm:text-sm text-gray-300 mt-1">{content.description}</p>}
      </header>

      <div
        className={`relative group mb-4 border-2 ${isRevealed ? 'border-purple-500' : 'border-purple-700 hover:border-purple-500'} rounded-lg overflow-hidden shadow-lg aspect-video transition-all duration-300 ${content.thumbnail_url && content.media_url && !isModalOpen ? 'cursor-pointer' : ''}`}
        onClick={content.thumbnail_url && content.media_url && !isModalOpen ? handleRevealClick : undefined}
      >
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={`Teaser for Stage ${content.stage}: ${content.name || ''}`}
            className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${isRevealed ? 'blur-none' : 'blur-md group-hover:blur-sm'}`}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={48} className="mb-2" /> <span>No Thumbnail Available</span>
          </div>
        )}
        {!isRevealed && content.thumbnail_url && content.media_url && !isModalOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye size={40} className="text-white opacity-90 mb-1" />
            <span className="text-white font-semibold text-md">Click to Reveal</span>
          </div>
        )}
      </div>

      {content.media_url && (
        <button
          onClick={handleRevealClick}
          disabled={isModalOpen}
          className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out text-md sm:text-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
        >
          <Eye size={20} className="mr-2" />
          {isModalOpen ? 'Viewing Full Content...' : 'Reveal Full Content'}
        </button>
      )}
      {!content.media_url && content.thumbnail_url && (
         <p className="text-center text-sm text-gray-400 mt-4">Full media for this stage is not yet available.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-1 sm:p-0"> {/* Modal content padding adjusted */}
          {mediaElementInModal}
        </div>
        <button
            onClick={handleCloseModal}
            className="mt-3 sm:mt-4 w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
            Close Viewer
        </button>
      </Modal>
    </div>
  );
}
