'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from './CartContext';

type Item = { name: string; price: number; imageUrl?: string };

export default function ProductCard({ p }: { p: Item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!p || !p.name) return null;

  const handleAdd = () => {
    addToCart({ ...p, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md p-3 transition-all hover:shadow-lg hover:-translate-y-1 duration-200 overflow-hidden group"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative"
        whileHover={{ rotate: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {p?.imageUrl ? (
          <motion.img
            src={p.imageUrl}
            alt={p.name}
            className="w-5/6 h-5/6 object-contain drop-shadow-md"
            whileHover={{
              scale: 1.1,
              rotate: 2,
              transition: { type: 'spring', stiffness: 300, damping: 10 },
            }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}

        {/* Glow overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl"
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <div className="mt-2 text-center">
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-gray-800">
          {p.name}
        </h3>
        <p className="text-blue-600 font-bold text-sm sm:text-base">${p.price}</p>
      </div>

      {/* Add to Cart button */}
      <motion.button
        onClick={handleAdd}
        disabled={added}
        whileTap={{ scale: 0.9 }}
        animate={{
          backgroundColor: added ? '#22c55e' : '#2563eb',
        }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-3 right-3 p-2 rounded-full text-white shadow-md hover:shadow-xl"
      >
        {added ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
      </motion.button>
    </motion.div>
  );
}
