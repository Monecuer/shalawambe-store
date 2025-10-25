'use client';

import { useEffect, useState, useMemo } from 'react';
import GlowBackground from '../components/GlowBackground';
import ProductCard from '../components/ProductCard';
import ShopNowAI from '../components/ShopNowAI';
import TopProducts from '../components/TopProducts';
import Notifications from '../components/Notifications';

type Item = { name: string; price: number; imageUrl?: string; category?: string; top10?: boolean };

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      console.log('🟢 Starting fetch for /products.json...');
      try {
        const res = await fetch('/products.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const rawList = Array.isArray(data) ? data : data.products || [];

        const clean = rawList
          .filter((p: any) => p && p.name && p.price)
          .map((p: any) => ({
            ...p,
            imageUrl: `/images/${p.name
              .replace(/\s+/g, '-')
              .toLowerCase()
              .replace(/[^\w-]/g, '')}.jpg`,
          }));

        console.log(`✅ Loaded ${clean.length} products.`);
        setItems(clean);
      } catch (err) {
        console.error('❌ Failed to load products:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => p.category && set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [items]);

  const visible = items.filter((p) => {
    const s = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(s) ||
      (p.category || '').toLowerCase().includes(s);
    const matchCat = activeCat === 'All' || p.category === activeCat;
    return matchSearch && matchCat;
  });

  return (
    <main>
      <GlowBackground />

      {/* 🧠 AI Banner */}
      <ShopNowAI />

      {/* 🔔 Notification Trigger */}
      <div className="flex justify-end mt-2 px-4">
        <Notifications />
      </div>

      {/* ⭐ Top Products Section */}
      <TopProducts />

      <section className="max-w-6xl mx-auto p-3 sm:p-4">
        <header className="py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="logo"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Shalawambe Catalogues
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm">
                Shop Smart. Shop Shalawambe.
              </p>
            </div>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-40 sm:w-64 outline-none text-sm"
            placeholder="Search…"
          />
        </header>

        {/* Category Buttons */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 ${
                  activeCat === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm">Loading Products…</p>
          </div>
        ) : visible.length === 0 ? (
          // No Products Found
          <div className="flex flex-col items-center justify-center py-24">
            <img
              src="/no-results.png"
              alt="No products"
              className="w-24 h-24 opacity-70 mb-3"
            />
            <p className="text-gray-500 text-sm text-center">
              No products found 🥲<br />
              Try searching something else 🤓
            </p>
          </div>
        ) : (
          // Product Grid
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
            {visible.map((p, i) => (
              <ProductCard key={i} p={p} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs sm:text-sm text-slate-600">
          <div>Powered by <strong>Monecuer Inc</strong></div>
          <div>All rights reserved © 2025</div>
        </footer>
      </section>
    </main>
  );
}
