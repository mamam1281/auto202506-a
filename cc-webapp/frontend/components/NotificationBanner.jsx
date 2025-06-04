// cc-webapp/frontend/components/NotificationBanner.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Or your preferred apiClient
import { X, Bell, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBanner({
  userId = 1,
  autoCloseDelay = 10000, // 10 seconds, pass 0 or null to disable auto-close
  fetchInterval = 60000, // Check for new notifications every 60 seconds, pass 0 or null to disable polling
}) {
  const [notification, setNotification] = useState(null); // Stores { id: Date.now(), message: "..." }
  const [isVisible, setIsVisible] = useState(false);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false); // Prevents re-fetch for current session after manual close
  const [error, setError] = useState(null); // Stores error message if fetch fails

  const autoCloseTimerRef = useRef(null);
  const fetchIntervalRef = useRef(null);

  const fetchPendingNotification = async (isInitialFetch = false) => {
    if (!userId) { // No user, do nothing
        if (isInitialFetch) setIsVisible(false); // Ensure hidden if no user from the start
        return;
    }
    // If manually closed in this session, only allow refetch if isManuallyClosed is reset by parent (e.g. on userId change)
    if (isManuallyClosed && !isInitialFetch) {
        return;
    }

    setError(null); // Clear previous errors on new fetch attempt
    try {
      // console.log(`[NotificationBanner] Fetching notification for user ${userId}...`);
      const response = await axios.get(`http://localhost:8000/api/notification/pending/${userId}`);

      if (response.data && response.data.message) {
        // Use a unique ID for the notification if backend provides one, otherwise generate
        const newNotification = {
          id: response.data.id || Date.now(), // Prefer backend ID if available
          message: response.data.message
        };
        setNotification(newNotification);
        setIsVisible(true); // Show the banner
        setIsManuallyClosed(false); // Reset manual close if a new message is fetched
        // console.log(`[NotificationBanner] Received: ${newNotification.message}`);
      } else {
        // No message or empty message, means no pending notification
        if (isVisible) setIsVisible(false); // Hide if it was visible before
        setNotification(null);
        // console.log(`[NotificationBanner] No pending message for user ${userId}.`);
      }
    } catch (err) {
      console.error("Error fetching pending notification:", err.response ? err.response.data : err.message);
      setError("Could not fetch notifications at this time."); // Set error state for potential display
      if (isVisible) setIsVisible(false); // Hide banner on error
    }
  };

  useEffect(() => {
    fetchPendingNotification(true); // Initial fetch on mount or userId change

    if (fetchInterval > 0) {
      fetchIntervalRef.current = setInterval(() => fetchPendingNotification(), fetchInterval);
    }

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [userId, fetchInterval]); // Removed isManuallyClosed from here; manual close should stop polling logic inside fetch.

  useEffect(() => {
    // Auto-close logic
    if (isVisible && notification && autoCloseDelay && autoCloseDelay > 0) {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
      autoCloseTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        // Backend marks notification as sent. If user doesn't interact and it auto-closes,
        // it's considered "seen" by timeout. Next poll will get next pending, if any.
      }, autoCloseDelay);
    }
    // Clear timer if component becomes invisible or notification changes (e.g. new one fetched)
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [isVisible, notification, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setIsManuallyClosed(true); // Prevent re-fetching for this "session" of the banner
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    // To persist "do not show again" across page loads/re-mounts,
    // one might use sessionStorage or localStorage here.
  };

  const animationKey = notification ? notification.id : 'no-notification-present';

  return (
    <AnimatePresence mode="wait">
      {isVisible && notification && notification.message && (
        <motion.div
          key={animationKey}
          initial={{ opacity: 0, y: -70, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.9, transition: { duration: 0.3, ease: 'anticipate' } }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-auto max-w-[calc(100%-2rem)] sm:max-w-md md:max-w-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3.5 rounded-md shadow-xl z-[100] flex items-start justify-between dark:bg-yellow-700 dark:text-yellow-50 dark:border-yellow-400"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start min-w-0"> {/* min-w-0 for text truncation */}
            <Bell size={20} className="mr-3 mt-0.5 text-yellow-600 dark:text-yellow-300 flex-shrink-0" />
            <span className="text-sm font-medium break-words">{notification.message}</span>
          </div>
          <button
            onClick={handleClose}
            className="ml-3 p-1 rounded-full text-yellow-600 hover:text-yellow-800 hover:bg-yellow-200 dark:text-yellow-200 dark:hover:text-yellow-50 dark:hover:bg-yellow-600 transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
      {/* Optional: Display a very subtle error indicator if fetching failed, and not manually closed.
          This is generally not done for passive notification systems to avoid clutter.
          Errors are logged to console.
      {error && !isManuallyClosed && (
        <div className="fixed bottom-4 right-4 text-xs text-red-500 p-2 bg-red-100 rounded-md shadow-lg z-[99]">
          <AlertTriangle size={14} className="inline mr-1"/> Notif. service error.
        </div>
      )}
      */}
    </AnimatePresence>
  );
}
