/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA({
  nextConfig,
  images: {
    domains: ["image.tmdb.org", "firebasestorage.googleapis.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/movie/:keyword/:page",
        destination: `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}&language=ko-KR&query=:keyword&page=:page`,
      },
    ];
  },
});
