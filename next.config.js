/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAPBOX_GL_ACCESS_TOKEN: process.env.MAPBOX_GL_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;
