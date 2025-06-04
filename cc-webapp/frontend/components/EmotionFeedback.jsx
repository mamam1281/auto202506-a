// cc-webapp/frontend/components/EmotionFeedback.jsx
'use client';

import React from 'react'; // Ensure React is imported if using JSX transform older than React 17
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, Zap, AlertTriangle } from 'lucide-react';

const emotionConfig = {
  happiness: {
    bannerClass: 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
    textClass: 'text-green-700 dark:text-green-300 font-semibold', // Adjusted for better contrast in dark mode
    icon: <CheckCircle className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0" size={20} />
  },
  frustration: {
    bannerClass: 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
    textClass: 'text-red-700 dark:text-red-300 font-semibold',
    icon: <XCircle className="text-red-500 dark:text-red-400 mr-2 flex-shrink-0" size={20} />
  },
  determination: {
    bannerClass: 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
    textClass: 'text-blue-700 dark:text-blue-300 font-semibold',
    icon: <Zap className="text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" size={20} />
  },
  warning: { // Added a warning type for more versatility
    bannerClass: 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-800 dark:border-yellow-600 dark:text-yellow-200', // Adjusted dark for yellow
    textClass: 'text-yellow-700 dark:text-yellow-300 font-semibold',
    icon: <AlertTriangle className="text-yellow-500 dark:text-yellow-400 mr-2 flex-shrink-0" size={20} />
  },
  neutral: { // Default
    bannerClass: 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200',
    textClass: 'text-gray-700 dark:text-gray-300 font-semibold',
    icon: <Info className="text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" size={20} />
  },
};

export default function EmotionFeedback({ emotion, message, isVisible }) {
  const currentConfig = emotionConfig[emotion] || emotionConfig.neutral;
  // Using a combination of message and a timestamp/random element for the key
  // ensures that if the same message for the same emotion is triggered consecutively,
  // it will still re-animate. Using just `message` might not re-animate if message is identical.
  // For this component, the parent controls `isVisible`. If parent wants to show a new message
  // of the same type, it can toggle isVisible or change the message content.
  // A key based on `message` and `emotion` is good for re-animation if `message` content changes.
  const animationKey = `${emotion}-${message}`; // Simpler key, relies on message content changing for re-animation if already visible.

  return (
    <AnimatePresence mode="wait">
      {isVisible && message && (
        <motion.div
          key={animationKey} // Key change triggers animation if message/emotion changes
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: 'anticipate' } }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`p-3 mb-4 border-l-4 rounded-md shadow-md flex items-start ${currentConfig.bannerClass}`}
          role="alert"
          aria-live="assertive"
        >
          {currentConfig.icon}
          <div className="flex-grow min-w-0"> {/* Added min-w-0 for better flex handling of text overflow */}
            <p className={`text-sm ${currentConfig.textClass}`}>
              {emotion ? emotion.charAt(0).toUpperCase() + emotion.slice(1) : 'Notification'}
            </p>
            <p className="text-xs sm:text-sm break-words">{message}</p> {/* Added break-words for long messages */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
