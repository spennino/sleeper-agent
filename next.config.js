/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sleepercdn.com',
        port: '',
        pathname: '/avatars/**',
      },
    ],
  },
}

module.exports = nextConfig