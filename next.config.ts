import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 78, 84, 86, 88, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
