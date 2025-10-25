'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff } from 'lucide-react';

const MESSAGES = [
  "🔥 Don't miss our hot deals!",
  "🛍️ Buy now and save big!",
  "⚡ Fast WhatsApp checkout available!",
  "💰 Grab your discount today!",
  "🎉 Top 10 items trending right now!",
  "🕒 Limited stock — shop before it’s gone!",
];

export default function Notifications() {
  const [enabled, setEnabled] = useState<boolean>(true);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('shalawambe_notify');
    if (saved === 'off') setEnabled(false);
  }, []);

  // Start notifications loop
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      if (Notification.permission === 'granted') {
        new Notification('🛍️ Shalawambe Deals', {
          body: randomMessage,
          icon: '/icons/icon-192.png',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  // Stop notifications forever
  const disableNotifications = () => {
    setEnabled(false);
    localStorage.setItem('shalawambe_notify', 'off');
  };

  if (!enabled) return null;

  return (
    <motion.button
      onClick={disableNotifications}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-full text-xs sm:text-sm hover:bg-blue-700 shadow-md transition"
      title="Click to stop notifications forever"
    >
      <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>Notifications Active</span>
    </motion.button>
  );
}
