/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push(
      "pino-pretty",
      "lokijs",
      "encoding"
    );
    return config;
  }, 
  reactStrictMode: false // this is normally set to true 
}

module.exports = nextConfig
