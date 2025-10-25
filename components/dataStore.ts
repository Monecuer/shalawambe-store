// components/dataStore.ts
// Single source of truth for Admin overrides (no backend).
export type Product = {
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;      // can be /images/... or data:image/...;base64,...
  top10?: boolean;
};

// ---- Auth (local only) ----
const ADMIN_USER = 'admin';
const ADMIN_PASS = '263FX@admin';
const ADMIN_PIN  = '12321232';

const AUTH_KEY = 'shalawambe_admin';
const PIN_OK   = 'shalawambe_pin_ok';

// ---- Products storage ----
const PRODUCTS_KEY = 'products'; // array<Product> overrides

export function isAuthed(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}
export function login(u: string, p: string): boolean {
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}
export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(PIN_OK);
}

export function hasPin(): boolean {
  return localStorage.getItem(PIN_OK) === 'true';
}
export function verifyPin(pin: string): boolean {
  const ok = pin === ADMIN_PIN;
  if (ok) localStorage.setItem(PIN_OK, 'true');
  return ok;
}

// Merge strategy: local overrides (if present) replace products.json by name.
export async function loadMergedProducts(): Promise<Product[]> {
  // 1) load base from /products.json
  let base: Product[] = [];
  try {
    const res = await fetch('/products.json', { cache: 'no-store' });
    const data = await res.json();
    base = (Array.isArray(data) ? data : data.products || []) as Product[];
  } catch {
    base = [];
  }

  // 2) load overrides from localStorage
  const raw = localStorage.getItem(PRODUCTS_KEY);
  const overrides: Product[] = raw ? JSON.parse(raw) : [];

  if (!overrides.length) return base;

  // map by name for quick replacement
  const map = new Map<string, Product>();
  base.forEach(p => map.set(p.name, p));
  overrides.forEach(o => map.set(o.name, { ...map.get(o.name), ...o }));

  return Array.from(map.values());
}

export function saveProductsLocal(list: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
}
export function clearLocalProducts() {
  localStorage.removeItem(PRODUCTS_KEY);
}

export function downloadJSON(list: Product[]) {
  const payload = JSON.stringify({ products: list }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.override.json';
  a.click();
  URL.revokeObjectURL(url);
}
