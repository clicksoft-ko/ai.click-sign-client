/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env.NEXT_PUBLIC_DOMAIN,
        process.env.NEXT_PUBLIC_LOCAL_DOMAIN,
      ],
    },
  },
  images: {
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
