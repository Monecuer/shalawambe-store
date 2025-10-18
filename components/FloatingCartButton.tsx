'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import { useEffect, useState } from 'react';

export default function FloatingCartButton() {
  const { cart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [bounce, setBounce] = useState(false);

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // 🧠 Run only after mount (so we’re sure it’s client)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 💥 Bounce animation on update
  useEffect(() => {
    if (itemCount > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  // 🚫 Prevent server-side render mismatch
  if (!isClient) return null;

  return (
    <Link
      href="/cart"
      className={`fixed bottom-5 right-5 z-50 p-3 sm:p-4 rounded-full shadow-lg bg-blue-600 text-white transition-all hover:bg-blue-700 ${
        bounce ? 'animate-[bounceOnce_0.6s_ease]' : ''
      }`}
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
