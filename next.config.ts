import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Force cache invalidation with unique build ID
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
