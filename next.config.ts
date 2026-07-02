import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/kia-ara",
        permanent: true, // 301 Redirect (Permanent)
      },
    ];
  },
};

export default nextConfig;
