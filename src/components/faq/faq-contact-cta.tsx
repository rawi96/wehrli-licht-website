import { Heading } from '@/components/nodes';
import { faqCardClass, faqKontaktLinkClass } from '@/components/faq/faq-styles';
import Link from 'next/link';
import { FC } from 'react';

export const FaqContactCta: FC = () => (
  <section className={`mt-12 scroll-mt-28 lg:mt-16 ${faqCardClass}`} aria-labelledby="faq-contact-heading">
    <Heading level="2" id="faq-contact-heading">
      Noch Fragen?
    </Heading>
    <p className="mt-3 max-w-2xl text-sm lg:text-base">
      Ihre Frage ist nicht dabei? Auf unserer{' '}
      <Link href="/kontakt" className={faqKontaktLinkClass}>
        Kontaktseite
      </Link>{' '}
      finden Sie alle Wege, uns zu erreichen – per Telefon, E-Mail oder Termin im Atelier Goldach.
    </p>
  </section>
);
