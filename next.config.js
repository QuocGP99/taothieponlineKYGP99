/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/taothiep/admin',
        destination: '/admin',
      },
      {
        source: '/invitation/:slug',
        destination: '/thiep-moi/:slug',
      },
    ];
  },
};

module.exports = nextConfig;
