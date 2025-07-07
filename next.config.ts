import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["1159-storage.lon1.cdn.digitaloceanspaces.com", "example.com", "www.blenheimlettings.co.uk"],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    APP_VERSION: process.env.APP_VERSION,
  },
};

export default nextConfig;
