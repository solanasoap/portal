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
      {
        protocol: 'https',
        hostname: 'helius.xyz',
      },
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
      },
    ],
  },
}

module.exports = nextConfig
