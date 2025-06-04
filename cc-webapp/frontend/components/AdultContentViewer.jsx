'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // Or your pre-configured apiClient
import { Eye, X, Lock, Image as ImageIcon, Video as VideoIcon, AlertTriangle } from 'lucide-react';

// Modal Component (can be kept here or moved to its own file)
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out animate-fadeIn"
      onClick={onClose} // Click outside to close
    >
      <div
        className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-xl max-w-3xl w-full relative text-white transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-3xl font-bold z-10 p-1"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
      {/* Basic animation styles (can be in globals.css or a <style jsx global> tag if preferred and supported) */}
      <style jsx global>{`
        .animate-fadeIn { animation: fadeInModal 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleInModal 0.3s ease-out forwards; }
        @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleInModal { from { transform: scale(0.95); opacity: 0.7; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default function AdultContentViewer({ userId = 1 }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchUnlockStatus = async () => {
      setIsLoading(true);
      setError(null);
      setIsRevealed(false);
      setContent(null); // Reset content on new fetch
      try {
        const response = await axios.get(`http://localhost:8000/api/unlock?user_id=${userId}`);
        setContent(response.data);
      } catch (err) {
        if (err.response) {
          const errorMsg = err.response.data.detail || 'Failed to unlock content.';
          if (err.response.status === 400 && errorMsg.toLowerCase().includes("all stages already unlocked")) {
            setError("Congratulations! All content stages are already unlocked.");
          } else if (err.response.status === 403) {
            setError(`Access Denied: ${errorMsg}`);
          } else if (err.response.status === 404 && errorMsg.toLowerCase().includes("user not found")){
            setError("User profile not found. Cannot load content.");
          } else if (err.response.status === 404 && errorMsg.toLowerCase().includes("content for stage")){
             setError("No new content available for your current level, or the next stage's content is not yet defined.");
          }
          else {
            setError(`Error (${err.response.status}): ${errorMsg}`);
          }
        } else {
          setError('Network error: Could not connect to the server. Please try again.');
        }
        console.error("Error fetching unlock status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchUnlockStatus();
    else { setError("User ID not provided. Cannot fetch content."); setIsLoading(false); }
  }, [userId]);

  const handleRevealClick = () => {
    if (content && content.media_url) {
      setIsRevealed(true);
      setIsModalOpen(true);
    } else if (content) { // Content exists but no media_url
        setError("Full media is not available for this content stage.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Keep it revealed if they opened modal, or set isRevealed(false) to re-blur on modal close
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-800 rounded-lg shadow-xl">
        <Lock size={48} className="animate-pulse mb-4 text-purple-400" />
        <p className="text-lg">Checking your access & loading exclusive content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-800 text-red-200 border border-red-700 rounded-lg shadow-xl max-w-md mx-auto">
        <AlertTriangle size={48} className="mb-4 text-red-400" />
        <p className="font-semibold text-xl mb-2">Access Issue</p>
        <p className="text-center text-sm">{error}</p>
      </div>
    );
  }

  if (!content || !content.stage) { // Check for content.stage as unlock endpoint returns content even if "all unlocked"
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-yellow-800 text-yellow-200 border border-yellow-700 rounded-lg shadow-xl max-w-md mx-auto">
        <Info size={48} className="mb-4 text-yellow-400" />
        <p className="font-semibold text-xl mb-2">No New Content</p>
        <p className="text-center text-sm">No new exclusive content is available for you at this moment, or all stages are complete. Keep up the great work!</p>
      </div>
    );
  }

  let mediaElement = null;
  if (content.media_url) {
    if (content.media_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null) {
      mediaElement = <img src={content.media_url} alt={`Full content for Stage ${content.stage}: ${content.name || ''}`} className="w-full max-h-[80vh] object-contain rounded-md" />;
    } else if (content.media_url.match(/\.(mp4|webm|ogv|ogg)$/i) != null) {
      mediaElement = <video controls autoPlay muted loop src={content.media_url} className="w-full max-h-[80vh] rounded-md outline-none bg-black"><p>Your browser does not support the video tag.</p></video>;
    } else {
      mediaElement = <div className="text-center"><a href={content.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Media Content (External Link)</a></div>;
    }
  } else {
    mediaElement = <p className="text-center text-gray-400 py-10">Full media is not available for this stage.</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-700">
      <header className="mb-5">
        <h2 className="text-3xl font-bold text-purple-400">Stage {content.stage}: {content.name || 'Unlocked Content'}</h2>
        {content.description && <p className="text-sm text-gray-300 mt-1.5">{content.description}</p>}
      </header>

      <div
        className={`relative group mb-5 border-2 ${isRevealed && isModalOpen ? 'border-purple-400' : 'border-purple-600 hover:border-purple-400'} rounded-lg overflow-hidden shadow-lg aspect-video transition-all duration-300 ${content.thumbnail_url ? 'cursor-pointer' : ''}`}
        onClick={content.thumbnail_url && !isModalOpen ? handleRevealClick : undefined}
      >
        {content.thumbnail_url ? (
          <img
            src={content.thumbnail_url}
            alt={`Teaser for Stage ${content.stage}: ${content.name || ''}`}
            className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${isRevealed && isModalOpen ? 'blur-none' : 'blur-md group-hover:blur-sm'}`}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={48} className="mb-2" /> <span>No Thumbnail Available</span>
          </div>
        )}
        {!isRevealed && content.thumbnail_url && !isModalOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye size={56} className="text-white opacity-80 mb-2" />
            <span className="text-white font-semibold text-lg">Click to Reveal</span>
          </div>
        )}
      </div>

      {content.media_url && (
        <button
          onClick={handleRevealClick}
          disabled={isModalOpen}
          className="w-full mt-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out text-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Eye size={22} className="mr-2.5" />
          {isModalOpen ? 'Viewing Full Content...' : 'Reveal Full Content'}
        </button>
      )}
      {!content.media_url && (
        <p className="text-center text-gray-500 mt-4 text-sm">Full media for this stage is not yet available.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3 className="text-2xl font-bold mb-4 text-purple-300 border-b border-gray-700 pb-2">Stage {content.stage} - Full View</h3>
        {mediaElement}
        <button
            onClick={handleCloseModal}
            className="mt-5 w-full px-5 py-2.5 bg-gray-600 text-gray-100 rounded-md hover:bg-gray-500 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
            Close Viewer
        </button>
      </Modal>
    </div>
  );
}
