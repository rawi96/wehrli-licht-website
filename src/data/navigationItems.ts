import { Navigation } from '../types/Navigation'

export const websiteNavigationItems: Navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  {
    title: 'Angebot',
    items: [
      { name: 'Lichtplanung', href: '/angebot/lichtplanung' },
      { name: 'Lichtberatung', href: '/angebot/lichtberatung' },
      { name: 'Lampenschirme', href: '/angebot/lampenschirme' },
      { name: 'Wohnraumleuchten', href: '/angebot/wohnraumleuchten' },
      { name: 'Sonderanfertigungen', href: '/angebot/sonderanfertigungen' },
    ],
  },
  { name: 'Über uns', href: '/ueber-uns' },

  { name: 'Projekte', href: '/projekte' },
  { name: 'Kontakt', href: '/kontakt' },
]

export const shopNavigationItems: Navigation = [
  { name: 'Zurück zur Website', href: '/' },
  { name: 'Shop', href: '/shop' },
]
