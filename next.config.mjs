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
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ekdjxzhujettocosgzql.supabase.co").hostname,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      ],
  },
  webpack: (config) => {
    // Allow absolute imports from the /app directory
    config.resolve.alias['/app'] = path.resolve(__dirname, 'app')
    config.resolve.alias['app'] = path.resolve(__dirname, 'app')
    return config
  },
}

export default nextConfig
