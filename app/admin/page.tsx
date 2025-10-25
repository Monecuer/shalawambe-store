// app/admin/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Lock, LogOut, Save, Upload, Download, RefreshCcw,
  Star, Image as ImageIcon, Key, CheckCircle, XCircle, Search, Pencil, Camera
} from 'lucide-react';

import {
  Product, loadMergedProducts, saveProductsLocal, clearLocalProducts,
  isAuthed, login, logout, hasPin, verifyPin, downloadJSON
} from '../../components/dataStore';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pinOk, setPinOk]   = useState(false);

  const [u, setU]   = useState('admin');
  const [pw, setPw] = useState('');
  const [pin, setPin] = useState('');

  const [list, setList] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [saving, setSaving] = useState(false);

  // Load auth + products
  useEffect(() => {
    setAuthed(isAuthed());
    setPinOk(hasPin());
    (async () => setList(await loadMergedProducts()))();
  }, []);

  // Filtered view
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      it => it.name.toLowerCase().includes(s)
         || (it.category || '').toLowerCase().includes(s)
    );
  }, [list, q]);

  // Auth handlers
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (login(u, pw)) setAuthed(true);
    else alert('Invalid credentials.');
  }
  function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    if (verifyPin(pin)) setPinOk(true);
    else alert('Wrong PIN.');
  }

  // Product mutators
  function change(idx: number, patch: Partial<Product>) {
    setList(prev => {
      const next = prev.map((p,i) => i===idx ? { ...p, ...patch } : p);
      // live reflect in UI; persist only when pressing Save (as requested)
      return next;
    });
  }

  function handleSaveAll() {
    if (!pinOk) { alert('PIN required for saving.'); return; }
    setSaving(true);
    setTimeout(() => {
      saveProductsLocal(list);     // hard override products.json in the app
      setSaving(false);
    }, 400);
  }

  function handleResetLocal() {
    if (!pinOk) { alert('PIN required for reset.'); return; }
    if (!confirm('Clear local overrides and reload from products.json?')) return;
    clearLocalProducts();
    (async () => setList(await loadMergedProducts()))();
  }

  function handleImportJSON(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!ev.target.files?.[0]) return;
    const f = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const next: Product[] = (parsed.products || parsed || []).map((p: any) => ({
          name: String(p.name || ''),
          price: Number(p.price ?? 0),
          imageUrl: p.imageUrl || '',
          category: p.category || '',
          top10: Boolean(p.top10)
        }));
        setList(next); // not saved until Save
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(f);
    ev.target.value = '';
  }

  // Image upload -> DataURL (instant preview, offline)
  function handleImageUpload(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = String(ev.target?.result || '');
      // auto-name suggestion (not needed for DataURL but we keep consistency)
      const imageName = (list[idx].name || '')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      change(idx, { imageUrl: dataUrl }); // immediate UI update
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  // ---------- Screens ----------
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full card">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-blue-600" />
            <h1 className="font-bold text-lg">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-sm">Username</label>
              <input className="input w-full" value={u} onChange={e=>setU(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input className="input w-full" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
            </div>
            <button className="btn w-full">
              <Lock className="w-4 h-4" /> Sign in
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!pinOk) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-sm w-full card">
          <div className="flex items-center gap-2 mb-4">
            <Key className="text-amber-600" />
            <h1 className="font-bold text-lg">PIN Verification</h1>
          </div>
          <form onSubmit={handleVerifyPin} className="space-y-3">
            <div>
              <label className="text-sm">Admin PIN</label>
              <input className="input w-full" type="password" value={pin} onChange={e=>setPin(e.target.value)} />
              <p className="text-xs text-slate-500 mt-1">Required for editing & saving.</p>
            </div>
            <button className="btn w-full">
              <CheckCircle className="w-4 h-4" /> Verify PIN
            </button>
          </form>
          <button className="mt-3 flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm" onClick={() => { logout(); location.reload(); }}>
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </motion.div>
      </div>
    );
  }

  // Editor
  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600" />
          <h1 className="font-bold text-xl">Admin · Product Editor</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn" onClick={handleSaveAll} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="btn bg-emerald-600 hover:bg-emerald-700" onClick={() => downloadJSON(list)}>
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <label className="btn bg-slate-600 hover:bg-slate-700 cursor-pointer">
            <Upload className="w-4 h-4" /> Import
            <input type="file" accept="application/json" hidden onChange={handleImportJSON} />
          </label>
          <button className="btn bg-amber-600 hover:bg-amber-700" onClick={handleResetLocal}>
            <RefreshCcw className="w-4 h-4" /> Reset Local
          </button>
          <button className="btn bg-red-600 hover:bg-red-700" onClick={() => { logout(); location.href='/'; }}>
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="card mb-3">
        <div className="flex items-center gap-2">
          <Search className="text-slate-500" />
          <input className="input w-full" placeholder="Search name or category…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((it, idx) => (
          <motion.div
            key={`${it.name}-${idx}`}
            initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="card"
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border shrink-0">
                {it.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.imageUrl} alt={it.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                {/* Name */}
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-slate-500" />
                  <input
                    className="input w-full"
                    value={it.name}
                    onChange={e => change(idx, { name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>

                {/* Price + Category */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">$</span>
                    <input
                      className="input w-full"
                      type="number" step="0.01" min="0"
                      value={isNaN(Number(it.price)) ? '' : String(it.price)}
                      onChange={e => change(idx, { price: Number(e.target.value) })}
                      placeholder="Price"
                    />
                  </div>
                  <input
                    className="input w-full"
                    placeholder="Category"
                    value={it.category || ''}
                    onChange={e => change(idx, { category: e.target.value })}
                  />
                </div>

                {/* Image controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    className="input w-full"
                    placeholder="Image URL (/images/… or https…)"
                    value={it.imageUrl || ''}
                    onChange={e => change(idx, { imageUrl: e.target.value })}
                  />
                  <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={(e)=>handleImageUpload(idx, e)} />
                  </label>
                </div>

                {/* Top 10 toggle + hint */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                      it.top10 ? 'bg-yellow-500 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                    onClick={() => change(idx, { top10: !it.top10 })}
                    title="Toggle Top 10"
                  >
                    <Star className="w-4 h-4" />
                    {it.top10 ? 'Top' : 'Mark Top'}
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Press “Save” to persist overrides</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-slate-500 mt-10">
          <XCircle className="mx-auto mb-2" />
          No matching products.
        </div>
      )}
    </div>
  );
}
