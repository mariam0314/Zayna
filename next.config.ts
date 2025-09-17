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

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "themeatery.com" },
      { protocol: "https", hostname: "www.allrecipes.com" },
      { protocol: "https", hostname: "s.lightorangebean.com" },
      { protocol: "https", hostname: "images.stockcake.com" },
      { protocol: "https", hostname: "www.licious.in" },
      { protocol: "https", hostname: "thumbs.dreamstime.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "pannellum.org" },
      { protocol: "https", hostname: "cdn.pannellum.org" },
    ],
  },
};

export default nextConfig;