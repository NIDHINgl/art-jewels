/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ['image/webp', 'image/avif'],
    // Allow images served by the backend (local + production)
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      // Production — replace with your actual backend domain
      // { protocol: 'https', hostname: 'api.yourdomain.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
