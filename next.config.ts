import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* dev: {
    // Add the problematic origin(s) to this array
    allowedDevOrigins: [
      'http://127.0.0.1:3000',
    ],
  } */
};

module.exports = nextConfig;
