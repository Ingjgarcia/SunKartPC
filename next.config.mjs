/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim() !== ""
        ? process.env.NEXTAUTH_URL
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://sunkart-pc.vercel.app",
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET || "adventureos-super-secret-key-production-fallback-12345",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
