/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['arweave.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
    ],
  },
}

module.exports = nextConfig
