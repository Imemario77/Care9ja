/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", // localhost
        "rb0mjwb9-3000.uks1.devtunnels.ms", // Codespaces
      ],
    },
  },
};

export default nextConfig;
