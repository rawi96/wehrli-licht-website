import { global } from './global'

export const contact = {
  title: 'So finden Sie uns am schnellsten',
  intro: 'Wir freuen uns, wenn Sie vorbei kommen.',
  primaryButton: {
    text: 'Anfahrt anzeigen',
    link: 'https://goo.gl/maps/bskYrHQAgCZQm7XFA?coh=178571&entry=tt',
  },
  secondaryButton: {
    text: 'Anrufen',
    link: `tel:${global.address.tel}`,
  },
}
