'use client';

import { useCart } from '../../components/CartContext';
import { ShoppingCart, Trash2, MessageCircle, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const whatsappNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP || '+263782286544';

  const handleOrder = () => {
    const msg = `🛒 *Shalawambe Order:*\n${cart
      .map((i) => `• ${i.quantity} × ${i.name} ($${i.price.toFixed(2)})`)
      .join('\n')}\n\n*Total:* $${total.toFixed(2)}\n\n© Shalawambe`;
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
          <ShoppingCart className="w-6 h-6" />
          My Cart
        </h1>
        <Link href="/" className="text-blue-600 text-sm hover:underline">
          ← Continue Shopping
        </Link>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Your cart is empty.</p>
          <Link href="/" className="text-blue-600 text-sm mt-2 inline-block">
            Go shopping →
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {cart.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-12 h-12 rounded-md object-cover border"
                />
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-md">
                  <button
                    onClick={() => updateQuantity(item.name, item.quantity - 1)}
                    className="p-1 hover:bg-gray-200 rounded-l-md"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.name, item.quantity + 1)}
                    className="p-1 hover:bg-gray-200 rounded-r-md"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="font-semibold text-sm w-14 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <Trash2
                  className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => removeFromCart(item.name)}
                  aria-label="Remove item"
                />
              </div>
            </div>
          ))}

          <div className="bg-white shadow-md rounded-lg p-4 mt-6">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOrder}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md w-full transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </button>

              <button
                onClick={clearCart}
                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md w-full transition-all"
              >
                <Trash2 className="w-5 h-5" />
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-xs text-gray-500 mt-12">
        <p>© 2025 Shalawambe Catalogues — Powered by Monecuer Inc.</p>
      </footer>
    </div>
  );
}
