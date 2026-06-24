/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal self-contained server (.next/standalone) for Docker/Fly.io.
  output: "standalone",
};

module.exports = nextConfig;
