import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  eslint: {
    ignoreDuringBuilds: false, // Use strict linting from .mjs
  },
  typescript: {
    ignoreBuildErrors: false, // Use strict type checking from .mjs
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ekdjxzhujettocosgzql.supabase.co',
      },
    ],
    domains: [
      'ekdjxzhujettocosgzql.supabase.co',
    ],
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
  },
  webpack: (config) => {
    // config.resolve.alias["/app"] = path.resolve(__dirname, "app")
    return config;
  },
};

export default withNextIntl(nextConfig);
