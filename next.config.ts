import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.144"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c915814.parspack.net",
        pathname: "/c915814/**",
      },
    ],
  },
};

export default nextConfig;
