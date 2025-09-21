import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA and offline optimizations
  experimental: {
    optimizePackageImports: ['@mistralai/mistralai', 'openai'],
  },
  
  // Enable compression for better performance on slow networks
  compress: true,
  
  // Optimize images for faster loading
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Enable static optimization
  output: 'standalone',
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
