'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const MESSAGES = [
  'Shop now with Shalawambe 🛍️',
  'Best value, every day 💰',
  'Fast WhatsApp checkout ⚡',
  'Fresh deals. Hot picks 🔥',
  'Top 10 now trending ⭐',
];

export default function ShopNowAI() {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 perspective-1000">
      <motion.div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-3 sm:p-5 flex items-center gap-2 sm:gap-3 cursor-pointer backdrop-blur-md shadow-[0_0_25px_rgba(37,99,235,0.5)]"
        style={{
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        whileHover={{
          rotateX: -2,
          rotateY: 3,
          scale: 1.03,
          boxShadow: '0 0 35px rgba(37,99,235,0.6)',
        }}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
      >
        {/* Glow gradient background behind */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none"
          animate={{
            opacity: hover ? 0.6 : 0.4,
            scale: hover ? 1.05 : 1,
          }}
          transition={{ duration: 0.8 }}
        />

        {/* 🛍️ Shopping Bag Icon */}
        <motion.div
          animate={{ rotate: hover ? 5 : 0, scale: hover ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300 drop-shadow-md" />
        </motion.div>

        {/* Dynamic AI Text */}
        <div className="relative min-h-[1.4rem] sm:min-h-[1.75rem] overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="font-semibold text-xs sm:text-base tracking-wide text-white/90"
            >
              <motion.span
                animate={{
                  backgroundPositionX: ['0%', '100%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#fff,#dbeafe,#fff)]"
              >
                {MESSAGES[idx]}
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating shimmer overlay */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(115deg,rgba(255,255,255,0.15)_0%,transparent_40%,rgba(255,255,255,0.15)_100%)] pointer-events-none"
          animate={{
            x: hover ? ['-100%', '100%'] : '0%',
          }}
          transition={{
            duration: 2.5,
            repeat: hover ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
}
