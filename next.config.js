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

  reactStrictMode: false,  // this is normally set to true 
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aqua-famous-sailfish-288.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
