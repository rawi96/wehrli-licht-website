/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
};

module.exports = nextConfig;
