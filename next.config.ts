import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rentline.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
