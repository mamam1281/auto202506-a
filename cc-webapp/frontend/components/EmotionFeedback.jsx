'use client';

import { motion, AnimatePresence } from 'framer-motion';

const emotionStyles = {
  happiness: 'bg-green-100 border-green-500 text-green-700',
  frustration: 'bg-red-100 border-red-500 text-red-700',
  determination: 'bg-blue-100 border-blue-500 text-blue-700',
  neutral: 'bg-gray-100 border-gray-500 text-gray-700', // Default
};

export default function EmotionFeedback({ emotion, message, isVisible }) {
  // isVisible prop will control the presence in AnimatePresence
  // The parent component will be responsible for setting isVisible to true
  // when a message should appear, and false after a delay to make it disappear.

  const styleClasses = emotionStyles[emotion] || emotionStyles.neutral;

  return (
    <AnimatePresence>
      {isVisible && message && ( // Conditionally render based on isVisible and message
        <motion.div
          key="emotionFeedback" // Adding a key helps AnimatePresence track the component
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`p-4 mb-4 border rounded-md shadow-lg ${styleClasses}`}
          role="alert"
        >
          <p className="font-semibold">{emotion ? emotion.charAt(0).toUpperCase() + emotion.slice(1) : 'Notification'}:</p>
          <p>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
