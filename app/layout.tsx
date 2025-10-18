import "../styles/globals.css";
import { CartProvider } from "../components/CartContext";
import FloatingCartButton from "../components/FloatingCartButton";

export const metadata = {
  title: "Shalawambe Catalogues",
  description: "Shop Smart. Shop Shalawambe."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0055FF" />
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
