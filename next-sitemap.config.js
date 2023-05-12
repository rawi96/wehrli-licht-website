// Pages that we consider to have a higher priority than others
const priorities = {
  '/': 1,
  '/angebot/lampenschirme': 0.8,
  '/angebot/lichtplanung': 0.8,
  '/angebot/lichtberatung': 0.8,
  '/angebot/showroom': 0.8,
  '/angebot/sonderanfertigungen': 0.8,
  '/angebot/wohnraumleuchten': 0.8,
}

module.exports = {
  siteUrl: process.env.DOMAIN || 'wehrli-licht-website.vercel.app',
  generateRobotsTxt: false,
  changefreq: 'daily',
  exclude: ['/404'],
  // The default priority should be 0.5 (source: https://www.sitemaps.org/PROTOCOL.html)
  priority: 0.5,
  transform: async ({ changefreq, priority, autoLastmod }, loc) => ({
    loc,
    changefreq,
    priority: priorities[loc] || priority,
    lastmod: autoLastmod && new Date().toISOString(),
  }),
}
