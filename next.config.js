/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_DOMAIN],
    },
  },
  images: {
    minimumCacheTTL: 90,
  },
};

module.exports = nextConfig;
