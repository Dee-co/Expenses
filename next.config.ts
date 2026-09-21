import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,

  allowedDevOrigins: [
    "172.20.10.2",
    "confirm-sprig-rebuild.ngrok-free.dev",
  ],
};

export default nextConfig;