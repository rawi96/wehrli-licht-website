import { Navigation } from '../types/Navigation'

export const navigationItems: Navigation = [
  { name: 'Home', href: '/' },
  { name: 'Online Shop', href: '/shop' },
  {
    title: 'Angebot',
    items: [
      { name: 'Lichtplanung', href: '#' },
      { name: 'Lichtberatung', href: '#' },
      { name: 'Lampenschirme', href: '#' },
      { name: 'Wohnraumleuchten', href: '#' },
      { name: 'Sonderanfertigungen', href: '#' },
    ],
  },
  { name: 'Über uns', href: '/ueber-uns' },

  { name: 'Projekte', href: '/projekte' },
  { name: 'Kontakt', href: '/kontakt' },
]
