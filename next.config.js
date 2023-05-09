const { withPlausibleProxy } = require('next-plausible')

const withPWA = require('next-pwa')

module.exports = module.exports = withPlausibleProxy()(
  withPWA({
    // next.js config
  })
)
