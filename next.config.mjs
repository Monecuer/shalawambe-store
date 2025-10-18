import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  output: 'export', // ✅ now outside the PWA plugin
  images: { unoptimized: true },
  trailingSlash: true,
};

export default withPWA(nextConfig);
