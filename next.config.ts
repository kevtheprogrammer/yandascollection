import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // 👈 disables ESLint blocking the build
  },
};


export default nextConfig;
