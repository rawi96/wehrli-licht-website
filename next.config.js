const { withPlausibleProxy } = require('next-plausible')

const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = withPlausibleProxy()(
  withPWA({
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.swell.store',
        },
      ],
    },
  })
)
