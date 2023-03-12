/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['arweave.net', 'seekpng.com', 'dweb.link', 'cdn2.vectorstock.com'],
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
      {
        protocol: 'https',
        hostname: '*.dweb.link',
      },
      {
        protocol: 'https',
        hostname: 'shdw-drive.genesysgo.net',
      },
    ],
  },
}

module.exports = nextConfig
