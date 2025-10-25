import "../styles/globals.css";
import { CartProvider } from "../components/CartContext";
import FloatingCartButton from "../components/FloatingCartButton";

export const metadata = {
  title: "Shalawambe Catalogues",
  description: " Smart. Shop Shalawambe."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA and mobile-friendly meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Shalawambe" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body>
        <CartProvider>
          {children}
          <FloatingCartButton /> {/* ✅ Floating Cart with bounce animation */}
        </CartProvider>
      </body>
    </html>
  );
}
