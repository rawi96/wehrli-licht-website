const { withPlausibleProxy } = require('next-plausible')

const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
})

module.exports = withPlausibleProxy()(
  withPWA({
    // next.js config
  })
)
