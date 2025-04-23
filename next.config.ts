import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  eslint: {
    dirs: ["app", "components", "lib"],
  },
  turbopack: {
    rules: {
      "*.mdx": { loaders: ["raw-loader"], as: "*.js" },
    },
  },
  webpack: config => {
    config.module.rules.push({ test: /\.mdx$/, use: "raw-loader" });
    return config;
  },

  rewrites: async () => [{ source: "/", destination: "/about" }],
};

export default nextConfig;
