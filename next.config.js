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

  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async headers() { // NB: for now completely open. Should makemore specific later on. 
    return [
      {
        // matching all API routes
        // source: "/rpc.walletconnect.com/v1/:path*",
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://loyalty-program-psi.vercel.app/" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig
