'use client';
import { useState } from 'react';
import { useCart } from './CartContext';
import { ShoppingCart, CheckCircle } from 'lucide-react';

type Item = { name: string; price: number; imageUrl?: string };

export default function ProductCard({ p }: { p: Item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Safety check: if product is invalid, skip rendering
  if (!p || !p.name) return null;

  const handleAdd = () => {
    addToCart({ ...p, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md p-3 transition hover:shadow-lg hover:-translate-y-1 duration-200">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {p?.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      <h3 className="mt-2 font-semibold text-sm sm:text-base line-clamp-2">{p.name}</h3>
      <p className="text-blue-600 font-bold text-sm sm:text-base">${p.price}</p>

      {/* Floating Add-to-Cart button (bottom-right corner) */}
      <button
        onClick={handleAdd}
        disabled={added}
        className={`absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
          added ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {added ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
      </button>
    </div>
  );
}
