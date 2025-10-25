// components/TopProducts.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Product, loadMergedProducts } from './dataStore';

export default function TopProducts() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const all = await loadMergedProducts();
      const top = all.filter(p => p.top10).slice(0, 10);
      setItems(top);
    })();
  }, []);

  if (!items.length) return null;

  return (
    <section className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-3">
        <Star className="text-yellow-500" />
        <h2 className="font-bold text-lg">Top 10 Picks</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
        {items.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="card p-2"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
            </div>
            <div className="mt-1 text-[11px] leading-tight line-clamp-2">{p.name}</div>
            <div className="text-blue-600 font-semibold text-xs">${p.price.toFixed(2)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
