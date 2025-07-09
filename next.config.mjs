<<<<<<< HEAD
=======
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  eslint: {
<<<<<<< HEAD
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
=======
    ignoreDuringBuilds: false, // Use strict linting from .mjs
  },
  typescript: {
    ignoreBuildErrors: false, // Use strict type checking from .mjs
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
<<<<<<< HEAD
        protocol: "https",
        hostname: new URL(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ekdjxzhujettocosgzql.supabase.co",
        ).hostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
=======
        protocol: 'https',
        hostname: 'ekdjxzhujettocosgzql.supabase.co',
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
      },
    ],
    domains: [
      'ekdjxzhujettocosgzql.supabase.co',
    ],
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
<<<<<<< HEAD
  },
  webpack: (config) => {
    // config.resolve.alias["/app"] = path.resolve(__dirname, "app")
    return config
  },
}
=======
  },
  webpack: (config) => {
    // config.resolve.alias["/app"] = path.resolve(__dirname, "app")
    return config;
  },
};

export default withNextIntl(nextConfig);
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
