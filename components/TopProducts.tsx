'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from './CartContext';

export default function TopProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => {
        const list = data.products || data;
        const top = list.filter((p: any) => p.top10);
        setProducts(top);
      });
  }, []);

  if (products.length === 0)
    return <p className="text-center text-gray-500">No Top Products yet.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((p: any, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl bg-white shadow-md hover:shadow-lg overflow-hidden"
        >
          <img
            src={p.imageUrl || `/images/${p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.jpg`}
            alt={p.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-3">
            <h3 className="font-semibold text-sm">{p.name}</h3>
            <p className="text-blue-600 font-bold">${p.price}</p>
          </div>

          <button
            onClick={() => addToCart(p)}
            className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-md transition-transform transform hover:scale-110"
          >
            <ShoppingCart size={18} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
