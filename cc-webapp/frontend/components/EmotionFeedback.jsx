'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, Zap } from 'lucide-react'; // Example icons

const emotionConfig = {
  happiness: {
    bannerClass: 'bg-green-50 border-green-400 text-green-700', // Adjusted border
    textClass: 'text-green-700 font-semibold', // Adjusted text color for better contrast on bg-green-50
    icon: <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={22} />
  },
  frustration: {
    bannerClass: 'bg-red-50 border-red-400 text-red-700',
    textClass: 'text-red-700 font-semibold',
    icon: <XCircle className="text-red-500 mr-3 flex-shrink-0" size={22} />
  },
  determination: {
    bannerClass: 'bg-blue-50 border-blue-400 text-blue-700',
    textClass: 'text-blue-700 font-semibold',
    icon: <Zap className="text-blue-500 mr-3 flex-shrink-0" size={22} />
  },
  neutral: { // Default
    bannerClass: 'bg-gray-50 border-gray-400 text-gray-700',
    textClass: 'text-gray-700 font-semibold',
    icon: <Info className="text-gray-500 mr-3 flex-shrink-0" size={22} />
  },
};

export default function EmotionFeedback({ emotion, message, isVisible }) {
  const config = emotionConfig[emotion] || emotionConfig.neutral;
  // Use message content combined with a timestamp or a unique ID for the key
  // to ensure re-animation even if the same message text appears for a different event.
  // For simplicity, if message is the primary trigger for change, it can be part of the key.
  // If isVisible just toggles the same message, then isVisible state change handles animation.
  // The key here helps if 'message' itself changes while 'isVisible' might already be true.
  const keyForAnimation = `${message}-${emotion}-${Date.now()}`;


  return (
    <AnimatePresence mode="wait"> {/* 'mode="wait"' can help with smoother transitions if items are rapidly changing */}
      {isVisible && message && (
        <motion.div
          key={keyForAnimation} // Key change triggers enter/exit animations
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.25, ease: "easeIn" } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`p-3.5 mb-4 border-l-4 rounded-r-md shadow-lg flex items-start ${config.bannerClass}`}
          role="alert"
        >
          {config.icon}
          <div className="flex-grow">
            <p className={`text-sm font-bold ${config.textClass}`}>{emotion ? emotion.charAt(0).toUpperCase() + emotion.slice(1) : 'Notification'}</p>
            <p className="text-sm mt-0.5">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
