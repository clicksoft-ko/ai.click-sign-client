/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_BACKEND_URL],
    },
  },
  images: {
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
