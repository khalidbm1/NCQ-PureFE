/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/licenses/:path*',
        destination: 'http://localhost:3001/api/v1/:path*',
      },
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:3000/api/v1/auth/:path*',
      },
    ];
  },
}

module.exports = nextConfig