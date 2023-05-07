import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'

export default function NotFound() {
  return (
    <>
      <Hero
        image={{
          src: '/images/essbereich.jpg',
          altText: 'Essbereich Beleuchtung',
        }}
        title={'Hier gibts leider nichts zu sehen.'}
        intro={'Die Seite wurde nicht gefunden.'}
        primaryButton={{ text: 'Home', link: '/' }}
        secondaryButton={{ text: 'Kontakt', link: '/kontakt' }}
      />

      <Footer />
    </>
  )
}
