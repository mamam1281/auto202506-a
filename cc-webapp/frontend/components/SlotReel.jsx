'use client';
import { motion } from 'framer-motion';

export default function SlotReel({ symbol, spinning, index }) {
  const animation = {
    animate: {
      y: [0, -40, 0],
      transition: { duration: 0.5, repeat: spinning ? Infinity : 0 },
    },
  };

  return (
    <motion.div
      className="w-16 h-16 flex items-center justify-center text-3xl bg-gray-700 rounded"
      variants={animation}
      animate={spinning ? 'animate' : ''}
      key={index}
    >
      {symbol}
    </motion.div>
  );
}
