import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  turbopack: {
    rules: {
      "*.mdx": { loaders: ["raw-loader"], as: "*.js" },
    },
  },
  webpack: config => {
    /* eslint-disable */
    config.module.rules.push({ test: /\.mdx$/, use: "raw-loader" });
    return config;
    /* eslint-enable */
  },

  rewrites: () => [{ source: "/", destination: "/about" }],
};

export default nextConfig;
