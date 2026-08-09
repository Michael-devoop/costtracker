import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce serverless function size on Vercel
  experimental: {
    // Enable server actions optimizations
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
  // Compress responses
  compress: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Reduce bundle size by excluding server-only packages from client
  serverExternalPackages: ['jspdf', 'jspdf-autotable', 'xlsx', 'html2canvas'],
};

export default nextConfig;
