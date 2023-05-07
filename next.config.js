const { withPlausibleProxy } = require('next-plausible')

const withPWA = require('next-pwa')

module.exports = module.exports = withPlausibleProxy()(
  withPWA({
    reactStrictMode: true,
    pwa: {
      dest: 'public',
    },

    async redirects() {
      return [
        {
          source: '/shop',
          destination: 'https://wehrli-licht.ch/shop/',
          permanent: true,
        },
      ]
    },
  })
)
