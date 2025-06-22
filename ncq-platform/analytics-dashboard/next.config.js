/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables
  env: {
    ANALYTICS_API_URL: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:4000',
    WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4001',
    AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001/api/auth',
  },
  
  // Image optimization
  images: {
    domains: ['analytics.ncq.sa', 'cdn.ncq.sa', 'api.ncq.sa'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers for security and analytics
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss: ws: https:;",
          },
        ],
      },
    ];
  },
  
  // Redirects for analytics routes
  async redirects() {
    return [
      {
        source: '/analytics',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/reports',
        destination: '/dashboard/reports',
        permanent: true,
      },
    ];
  },
  
  // Webpack configuration for D3.js and large datasets
  webpack: (config, { isServer }) => {
    // Handle D3.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Optimize for large data processing
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          d3: {
            test: /[\\/]node_modules[\\/]d3/,
            name: 'd3',
            chunks: 'all',
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|chart\.js)/,
            name: 'charts',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

module.exports = nextConfig;