import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "namps-ui",
    "namps-native",
    "react-native-web",
    "react-native-reanimated",
    "react-native-svg",
  ],
  webpack: (config, { webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": "react-native-web",
      "@react-native/assets-registry/registry": path.resolve(__dirname, "shims/assets-registry-registry.js"),
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
      })
    );
    return config;
  },
};

export default nextConfig;
