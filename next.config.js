const { withPlausibleProxy } = require('next-plausible')

const withPWA = require('next-pwa')

module.exports = withPlausibleProxy()(
  withPWA({
    reactStrictMode: true,
    pwa: {
      dest: 'public',
    },
    eslint: {
      dirs: ['src'],
    },
    async redirects() {
      return [
        {
          source: '/shop',
          destination: 'https://shop.wehrli.licht.ch',
          permanent: true,
        },
      ]
    },
  })
)
