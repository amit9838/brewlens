import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['formulae.brew.sh'], // For potential images
  },
  reactCompiler: true,
};

export default nextConfig;
