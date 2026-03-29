/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [],
    // Allow local images in /public
    unoptimized: false,
  },
  // Enable strict mode for React
  reactStrictMode: true,
  // Compress output
  compress: true,
  // PoweredBy header removal for security
  poweredByHeader: false,
};

module.exports = nextConfig;
