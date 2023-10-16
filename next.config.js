/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ui-avatars.com', 'farshaxan.blr1.cdn.digitaloceanspaces.com'],
  },
}

module.exports = nextConfig

