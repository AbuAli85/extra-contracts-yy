import path from "path"
import { fileURLToPath } from "url"

// Create a __dirname constant that works in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
        protocol: "https",
        hostname: new URL(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ekdjxzhujettocosgzql.supabase.co",
        ).hostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config) => {
    // Allow absolute imports starting with /app to resolve from the repository root
    config.resolve.alias["/app"] = path.resolve(__dirname, "app")
    return config
  },
}

export default nextConfig
