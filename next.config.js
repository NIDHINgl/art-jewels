/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ['image/webp', 'image/avif'],
    unoptimized: process.env.NEXT_PUBLIC_API_URL?.includes('ngrok') ||
                 process.env.NEXT_PUBLIC_API_URL?.includes('trycloudflare') ||
                 false,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.trycloudflare.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;