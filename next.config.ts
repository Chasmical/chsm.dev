import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    turbo: {
      rules: {
        "*.mdx": { loaders: ["raw-loader"], as: "*.js" },
      },
    },
  },
  eslint: {
    dirs: ["app", "components", "lib"],
  },
  webpack: config => {
    config.module.rules.push({ test: /\.mdx$/, use: "raw-loader" });
    return config;
  },

  rewrites: async () => [{ source: "/", destination: "/about" }],
};

export default nextConfig;
