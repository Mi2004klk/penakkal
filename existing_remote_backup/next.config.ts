import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // We pre-optimized images using sharp in download-media.mjs
  },
  trailingSlash: true,

};

export default nextConfig;
