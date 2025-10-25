import { createRequire } from 'module';
import withPWAInit from 'next-pwa';

// Allow using require in ESM
const require = createRequire(import.meta.url);

// Initialize PWA plugin
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      path: require.resolve('path-browserify'),
    };
    return config;
  },

  // PWA and static export settings
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

// Export combined config
export default withPWA(nextConfig);
