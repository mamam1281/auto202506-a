'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // Or your pre-configured apiClient

// Basic Modal Component (can be moved to its own file if complex)
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full relative transform transition-all animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-light"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
      {/* Basic animation styles (could be in globals.css) */}
      <style jsx global>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0.7; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default function AdultContentViewer({ userId = 1 }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null); // Expected: { stage, name, description, thumbnail_url, media_url }
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUnlockStatus = async () => {
      setIsLoading(true);
      setError(null);
      setContent(null); // Reset content on new fetch
      try {
        // Ensure this matches the backend endpoint from previous subtask (unlock.py)
        // which returns { stage, name, description, thumbnail_url, media_url }
        const response = await axios.get(`http://localhost:8000/api/unlock?user_id=${userId}`);
        setContent(response.data);
      } catch (err) {
        if (err.response) {
          const errorMsg = err.response.data.detail || 'Failed to unlock content.';
          if (err.response.status === 400 && errorMsg.toLowerCase().includes("all stages already unlocked")) {
            setError("Congratulations! All content stages are already unlocked.");
          } else if (err.response.status === 403) {
            setError(`Access Denied: ${errorMsg}`);
          } else if (err.response.status === 404) {
            setError(`Not Found: ${errorMsg}`); // E.g. User not found, or content for next stage not found
          }
           else {
            setError(`Error ${err.response.status}: ${errorMsg}`);
          }
        } else {
          setError('Could not connect to the server. Please check your network.');
        }
        console.error("Error fetching unlock status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUnlockStatus();
    } else {
      setError("User ID not provided. Cannot fetch content.");
      setIsLoading(false);
    }
  }, [userId]);

  const handleRevealClick = () => {
    if (content && content.media_url) { // Only open modal if there's media
        setIsModalOpen(true);
    } else if (content) {
        alert("Full media is not available for this content.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="text-center p-10 text-gray-700">Loading exclusive content status...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-md shadow-sm">{error}</div>;
  }

  if (!content) {
    // This case might be hit if API call succeeds but returns no data (e.g. 204, or empty object)
    // Or if the unlock endpoint determines no new content is available without it being an "error" like 400/403
    return <div className="text-center p-10 text-gray-700">No new exclusive content available for you at this moment.</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-3 text-gray-800">Stage {content.stage}: {content.name || 'Unlocked Content'}</h2>
      {content.description && <p className="text-gray-600 mb-5 text-sm">{content.description}</p>}

      <div className="mb-5 border rounded-lg overflow-hidden shadow-md aspect-video bg-gray-100">
        {content.thumbnail_url ? (
          <img src={content.thumbnail_url} alt={`Teaser for Stage ${content.stage}: ${content.name || ''}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">No Thumbnail Available</div>
        )}
      </div>

      <button
        onClick={handleRevealClick}
        disabled={!content.media_url}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-150 ease-in-out text-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {content.media_url ? 'Reveal Full Content' : 'Full Content Not Available'}
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Stage {content.stage} - Full View</h3>
        {content.media_url ? (
          // Simple check for video based on common extensions, improve if needed
          content.media_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null ? (
            <img src={content.media_url} alt={`Full content for Stage ${content.stage}: ${content.name || ''}`} className="w-full max-h-[70vh] object-contain rounded-md" />
          ) : content.media_url.match(/\.(mp4|webm|ogv|ogg)$/i) != null ? (
            <video controls autoPlay src={content.media_url} className="w-full max-h-[70vh] rounded-md bg-black">
              Your browser does not support the video tag.
            </video>
          ) : (
             <a href={content.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block text-center">
                View Media Content (Unknown Type)
             </a>
          )
        ) : (
          <p className="text-gray-700">No full media available for this stage.</p>
        )}
        <button
            onClick={handleCloseModal}
            className="mt-6 px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        >
            Close
        </button>
      </Modal>
    </div>
  );
}
