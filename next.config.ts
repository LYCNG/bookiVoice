import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
    ],
  },
  // @ts-ignore
  allowedDevOrigins: ["192.168.22.152"],
};

export default nextConfig;
