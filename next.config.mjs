/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: true, 
    },
  },
  reactStrictMode: true, 
  swcMinify: true, 
};

export default nextConfig;
