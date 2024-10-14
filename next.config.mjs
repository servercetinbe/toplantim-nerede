import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbo: {
      enabled: true,
    },
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
};

export default withNextIntl(nextConfig);
