import { getSiteUrl } from '@/utils/site-url';
import type { Metadata } from 'next';

const SITE_NAME = 'Wehrli Licht GmbH';
const FAQ_PATH = '/faq';

const DEFAULT_TITLE = 'Häufig gestellte Fragen | Wehrli Licht';
const DEFAULT_DESCRIPTION =
  'Antworten zu Lichtberatung, Lichtplanung, Lampenschirmen nach Mass und dem Leuchten-Shop von Wehrli Licht in Goldach – Ostschweiz und ganze Schweiz.';

type FaqPageMetaInput = {
  title?: string | null;
  description?: string | null;
  noIndex?: boolean;
};

export const buildFaqPageMetadata = ({ title, description, noIndex }: FaqPageMetaInput = {}): Metadata => {
  const pageTitle = title?.trim() ?? DEFAULT_TITLE;
  const pageDescription = description?.trim() ?? DEFAULT_DESCRIPTION;
  const url = `${getSiteUrl()}${FAQ_PATH}`;

  return {
    title: { absolute: pageTitle },
    description: pageDescription,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE_NAME,
      locale: 'de_CH',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDescription,
    },
  };
};
