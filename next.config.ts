import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA and offline optimizations
  experimental: {
    optimizePackageImports: ['@mistralai/mistralai', 'openai'],
    turbo: undefined, // Disable turbopack
  },
  
  // Development cache settings
  ...(process.env.NODE_ENV === 'development' && {
    // Disable caching in development
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
  }),
  
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
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      // Development: Disable caching for all pages
      ...(isDev ? [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate, private',
            },
            {
              key: 'Pragma',
              value: 'no-cache',
            },
            {
              key: 'Expires',
              value: '0',
            },
          ],
        }
      ] : []),
      
      // Service Worker
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      
      // Manifest (production caching)
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev ? 'no-cache' : 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
