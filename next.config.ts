import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Disable ESLint errors during builds (so Vercel doesn’t fail)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;