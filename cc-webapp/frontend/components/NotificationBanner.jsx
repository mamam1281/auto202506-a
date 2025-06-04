'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // Or your apiClient
import { X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBanner({ userId = 1, autoCloseDelay = 10000 }) { // Default auto-close after 10s
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false); // To prevent re-fetch after manual close in session

  useEffect(() => {
    let isMounted = true;
    const fetchPendingNotification = async () => {
      if (!userId || isManuallyClosed) { // Don't fetch if no user or manually closed this session
        if (isMounted) setIsVisible(false); // Ensure it's not visible if no user or closed
        return;
      }
      try {
        console.log(`[NotificationBanner] Fetching notification for user ${userId}...`);
        const response = await axios.get(`http://localhost:8000/api/notification/pending/${userId}`);
        if (isMounted && response.data && response.data.message) {
          setNotificationMessage(response.data.message);
          setIsVisible(true);
          console.log(`[NotificationBanner] Received: ${response.data.message}`);

          // Auto-close after a delay if autoCloseDelay is set and positive
          if (autoCloseDelay > 0) {
            setTimeout(() => {
              if (isMounted) { // Check again if component is still mounted
                setIsVisible(false);
              }
            }, autoCloseDelay);
          }
        } else if (isMounted) {
          setNotificationMessage(null);
          setIsVisible(false);
          // console.log(`[NotificationBanner] No pending message for user ${userId} or empty message received.`);
        }
      } catch (error) {
        // Do not show error to user, just log it, as this is a passive component.
        console.error("[NotificationBanner] Error fetching pending notification:", error.response ? error.response.data : error.message);
        if (isMounted) setIsVisible(false);
      }
    };

    fetchPendingNotification();

    // Optional: Set up an interval to periodically check for new notifications
    // const intervalId = setInterval(fetchPendingNotification, 60000); // Check every 60 seconds

    return () => {
      isMounted = false;
      // clearInterval(intervalId); // Clear interval if using one
    };
  }, [userId, isManuallyClosed, autoCloseDelay]); // Re-fetch if userId changes, unless manually closed

  const handleClose = () => {
    setIsVisible(false);
    setIsManuallyClosed(true); // Prevent re-fetch for this session/component instance
    console.log("[NotificationBanner] Manually closed by user.");
  };

  return (
    <AnimatePresence>
      {isVisible && notificationMessage && (
        <motion.div
          initial={{ opacity: 0, y: -70, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -70, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" } }}
          transition={{ type: 'spring', stiffness: 280, damping: 25, duration: 0.4 }}
          // Using a unique key based on message can help if messages might rapidly change and need re-animation
          key={notificationMessage} // Re-animate if message content changes
          className="fixed top-4 left-1/2 transform -translate-x-1/2 w-auto max-w-[90%] sm:max-w-md md:max-w-lg bg-yellow-400 text-yellow-900 px-4 py-3 text-sm rounded-lg shadow-2xl z-[100] flex items-center justify-between border border-yellow-500"
          role="alert"
        >
          <div className="flex items-center min-w-0"> {/* min-w-0 for text truncation if needed */}
            <Bell size={20} className="mr-2.5 text-yellow-700 flex-shrink-0" />
            <span className="font-medium truncate_">{notificationMessage}</span> {/* Added truncate if message is very long */}
          </div>
          <button
            onClick={handleClose}
            className="ml-3 sm:ml-4 p-1 rounded-full text-yellow-700 hover:text-yellow-900 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
