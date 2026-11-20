import { JsonLd } from '@/components/seo/json-ld';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { getSiteUrl } from '@/utils/site-url';

export const SITE_DESCRIPTION =
  'Fachgeschäft für hochwertige Innenbeleuchtung in Goldach (SG): massgefertigte Lampenschirme, Lichtberatung, Lichtplanung und Leuchten für Wohnen und Gewerbe in der ganzen Schweiz.';

/**
 * Site-wide structured data: the business (local SEO, knowledge panel, AI
 * answers) and the website. Contact data comes from the DatoCMS footer.
 */
export const SiteJsonLd = async () => {
  // Structured data must never take a page down: skip it if DatoCMS is unavailable.
  const headerFooter = await getHeaderFooter().catch((error: unknown) => {
    console.error('[site-json-ld] header/footer unavailable', error);

    return null;
  });
  if (!headerFooter) {
    return null;
  }

  const url = getSiteUrl();
  const businessId = `${url}/#business`;
  const sameAs = [headerFooter.instagramUrl, headerFooter.facebookUrl, headerFooter.linkedinUrl].filter(
    (link): link is string => Boolean(link),
  );

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'LightingStore',
            '@id': businessId,
            name: headerFooter.companyName ?? 'Wehrli Licht GmbH',
            url,
            logo: `${url}/wehrli-licht-logo.svg`,
            image: `${url}/wehrli-licht-logo.svg`,
            description: SITE_DESCRIPTION,
            foundingDate: '1947',
            ...(headerFooter.phone && { telephone: headerFooter.phone }),
            ...(headerFooter.email && { email: headerFooter.email }),
            address: {
              '@type': 'PostalAddress',
              ...(headerFooter.street && { streetAddress: headerFooter.street }),
              ...(headerFooter.zip && { postalCode: headerFooter.zip }),
              addressLocality: headerFooter.place ?? 'Goldach',
              addressRegion: 'SG',
              addressCountry: 'CH',
            },
            ...(headerFooter.mapsLink && { hasMap: headerFooter.mapsLink }),
            areaServed: [
              { '@type': 'AdministrativeArea', name: 'Ostschweiz' },
              { '@type': 'Country', name: 'Schweiz' },
            ],
            knowsAbout: [
              'Lampenschirme nach Mass',
              'Lampenschirme neu überziehen und reparieren',
              'Lichtplanung',
              'Lichtberatung',
              'Leuchten',
            ],
            ...(sameAs.length > 0 && { sameAs }),
          },
          {
            '@type': 'WebSite',
            '@id': `${url}/#website`,
            url,
            name: 'Wehrli Licht',
            inLanguage: 'de-CH',
            publisher: { '@id': businessId },
          },
        ],
      }}
    />
  );
};
