import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/iphone-store',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
