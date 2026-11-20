import { FC } from 'react';
import { Button } from '../../actions/button/button';
import { Heading } from '../../typography/heading/heading';

type Props = {
  title?: string;
  text?: string;
  homeHref?: string;
  homeLabel?: string;
  contactHref?: string;
  contactLabel?: string;
};

/** Page shell for missing pages (404): title, text and links to the start and contact page, centered. */
export const NotFound: FC<Props> = ({
  title = 'Seite nicht gefunden',
  text = 'Die von Ihnen aufgerufene Seite konnte leider nicht gefunden werden.',
  homeHref = '/',
  homeLabel = 'Zur Startseite',
  contactHref = '/kontakt',
  contactLabel = 'Kontakt',
}) => (
  <div className="mx-auto my-24 grid min-h-[50vh] w-11/12 items-center justify-center text-center md:my-36">
    <div>
      <Heading level="1">{title}</Heading>
      <p className="peer my-2 md:max-w-prose lg:my-4">{text}</p>
      <div className="inline-flex flex-wrap gap-2 py-4 sm:w-auto sm:gap-4 md:flex-1 [&>a]:w-full [&>a]:sm:w-auto">
        <Button variant="primary" href={homeHref}>
          {homeLabel}
        </Button>
        <Button variant="secondary" href={contactHref}>
          {contactLabel}
        </Button>
      </div>
    </div>
  </div>
);
