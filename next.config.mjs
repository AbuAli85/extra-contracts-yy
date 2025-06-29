/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.example.com', // For placeholder images if needed
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // For placeholder images if needed
      },
    ],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
