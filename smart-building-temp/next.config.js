/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'out',
  // Ensure JavaScript is included in static export
  generateBuildId: () => 'build',
  // Remove i18n for static export
  // i18n: {
  //   locales: ['en', 'ar'],
  //   defaultLocale: 'en',
  //   localeDetection: false,
  // },
  // Remove rewrites for static export
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/smart-hospitality/:path*',
  //       destination: 'http://localhost:3001/api/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;