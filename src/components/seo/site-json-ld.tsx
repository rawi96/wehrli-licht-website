import { JsonLd } from '@/components/seo/json-ld';
import { getCompanyProfile } from '@/utils/company-profile';
import { toLines } from '@/utils/text';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { getSiteUrl } from '@/utils/site-url';
import { SITE_NAME } from '@/constants/site';

/**
 * Site-wide structured data: the business (local SEO, knowledge panel, AI answers) and the
 * website. Everything comes from DatoCMS: contact data from «Header & Footer», business facts
 * from «Firmenprofil (SEO & KI)». Empty CMS fields are simply omitted.
 */
export const SiteJsonLd = async () => {
  // Structured data must never take a page down: skip what DatoCMS cannot deliver. The company
  // profile is optional, so its failure only drops the business facts, not the contact data.
  const logError = (error: unknown) => {
    console.error('[site-json-ld] DatoCMS unavailable', error);

    return null;
  };
  const [headerFooter, profile] = await Promise.all([
    getHeaderFooter().catch(logError),
    getCompanyProfile().catch(logError),
  ]);
  if (!headerFooter) {
    return null;
  }

  const url = getSiteUrl();
  const businessId = `${url}/#business`;
  const sameAs = [headerFooter.instagramUrl, headerFooter.facebookUrl, headerFooter.linkedinUrl].filter(
    (link): link is string => Boolean(link),
  );
  const areaServed = toLines(profile?.areaServed);
  const expertise = toLines(profile?.expertise);

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'LightingStore',
            '@id': businessId,
            name: headerFooter.companyName ?? SITE_NAME,
            url,
            logo: `${url}/wehrli-licht-logo.svg`,
            image: `${url}/wehrli-licht-logo.svg`,
            ...(profile?.description && { description: profile.description }),
            ...(profile?.foundingYear && { foundingDate: String(profile.foundingYear) }),
            ...(headerFooter.phone && { telephone: headerFooter.phone }),
            ...(headerFooter.email && { email: headerFooter.email }),
            address: {
              '@type': 'PostalAddress',
              ...(headerFooter.street && { streetAddress: headerFooter.street }),
              ...(headerFooter.zip && { postalCode: headerFooter.zip }),
              ...(headerFooter.place && { addressLocality: headerFooter.place }),
              ...(profile?.addressRegion && { addressRegion: profile.addressRegion }),
              addressCountry: 'CH',
            },
            ...(profile?.location && {
              geo: {
                '@type': 'GeoCoordinates',
                latitude: profile.location.latitude,
                longitude: profile.location.longitude,
              },
            }),
            ...(headerFooter.mapsLink && { hasMap: headerFooter.mapsLink }),
            ...(areaServed.length > 0 && { areaServed: areaServed.map((name) => ({ '@type': 'Place', name })) }),
            ...(expertise.length > 0 && { knowsAbout: expertise }),
            ...(sameAs.length > 0 && { sameAs }),
          },
          {
            '@type': 'WebSite',
            '@id': `${url}/#website`,
            url,
            name: headerFooter.companyName ?? SITE_NAME,
            inLanguage: 'de-CH',
            publisher: { '@id': businessId },
          },
        ],
      }}
    />
  );
};
