const path = require('node:path');
const { withBotId } = require('botid/next/config');
const { getCmsRedirects } = require('./cms-redirects');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The design system is consumed as TypeScript source (no build step of its own).
  transpilePackages: ['@wehrli/design-system'],
  // Monorepo root, so file tracing and Turbopack see the workspace packages.
  outputFileTracingRoot: path.join(__dirname, '../..'),
  turbopack: { root: path.join(__dirname, '../..') },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.datocms-assets.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        // DatoCMS requires a slug for each page and we use "home" for the home page.
        // We redirect it here, because its prettier to have / instead of /home for the home page.
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        // URLs of the website before the current one.
        source: '/index.php/:path*',
        destination: '/:path*',
        permanent: true,
      },
      ...(await getCmsRedirects()),
    ];
  },
};

module.exports = withBotId(nextConfig);
