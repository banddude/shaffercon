/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Only use base path in production (GitHub Pages)
  basePath: process.env.NODE_ENV === 'production' ? '/shaffercon-migration' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shaffercon-migration' : '',
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Ensure trailing slashes for GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
