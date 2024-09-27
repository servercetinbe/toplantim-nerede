/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      turbo: true, // Turbopack'i etkinleştir
    },
    reactStrictMode: true,  // (Opsiyonel) React Strict Mode
    swcMinify: true,        // (Opsiyonel) SWC minify
  };
  
  export default nextConfig;
  