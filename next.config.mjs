/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: true, 
    },
  },
  reactStrictMode: true, 
  swcMinify: true, 
  compiler : {
    emotion : true,
  }
};

export default nextConfig;
