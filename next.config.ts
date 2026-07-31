import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
    experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  
  images: {



    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },{
        protocol:"https",
        hostname:"13ua6gt4kqagacct.public.blob.vercel-storage.com",
      }
    ],
  },
  // @ts-ignore
  allowedDevOrigins: ["192.168.22.152"],
};

export default nextConfig;
