import type { Config } from 'tailwindcss'
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 500: "#0055FF", 600: "#0048d6" } },
      boxShadow: { glow: "0 0 60px rgba(0,85,255,0.25)" }
    }
  },
  plugins: []
} satisfies Config
