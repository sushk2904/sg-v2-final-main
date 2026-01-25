/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/candidates/:path*',
        destination: 'http://127.0.0.1:8000/api/candidates/:path*',
      },
      // Add other API routes to proxy as needed
    ]
  },
}

export default nextConfig
