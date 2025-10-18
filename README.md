# Shalawambe Catalogue Lite (No Admin)

- Animated product cards (glow + tilt), **3 columns on mobile**.
- Logo top-left, **Powered by Monecuer** footer, © 2025 Elshaddai Anesu Mugugu.
- Buttons on each product: **WhatsApp** + **Call Now**.
- Data comes from **public/products.json** (name + price + optional imageUrl/category).

## Quickstart
```bash
npm install
npm run dev
```
Open http://localhost:3001

## Change WhatsApp & Call numbers
Create `.env.local` in the project root:
```
NEXT_PUBLIC_SHOP_WHATSAPP=+2637XXXXXXX
NEXT_PUBLIC_CALL_NUMBER=+2637XXXXXXX
```

## Update Products
Edit `public/products.json`. Put your image URLs in `imageUrl` if you have them.
If empty, a placeholder shows and you can add images later.

## APK (optional)
You can wrap this PWA into an Android APK using **Capacitor** or a **Trusted Web Activity (TWA)**.
I recommend TWA for speed:
- Install Bubblewrap: `npm i -g @bubblewrap/cli`
- Run `bubblewrap init --manifest=https://your-domain/manifest.webmanifest`
- `bubblewrap build` → this generates an APK to sign & upload.

