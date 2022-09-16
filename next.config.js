/** @type {import('next').NextConfig} */
// import withPlugins from "next-compose-plugins";

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

module.exports = withPWA({
  nextConfig,
});
