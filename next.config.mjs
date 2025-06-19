/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true, // Useful for static exports or if image optimization is handled elsewhere
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co").hostname,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false, // Recommended to disable for explicit path-based routing
  },
}

export default nextConfig
