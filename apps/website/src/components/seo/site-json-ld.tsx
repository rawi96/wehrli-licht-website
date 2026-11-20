import { JsonLd } from '@/components/seo/json-ld';
import { SITE_NAME } from '@/constants/site';
import { content } from '@/integrations';
import { getSiteUrl } from '@/utils/site-url';

/**
 * Site-wide structured data: the business (local SEO, knowledge panel, AI answers) and the
 * website. Everything comes from the CMS: contact data from the site layout, business facts from
 * the company profile. Empty CMS fields are simply omitted.
 */
export const SiteJsonLd = async () => {
  // Structured data must never take a page down: skip what the CMS cannot deliver. The company
  // profile is optional, so its failure only drops the business facts, not the contact data.
  const logError = (error: unknown) => {
    console.error('[site-json-ld] CMS unavailable', error);

    return null;
  };
  const [layout, profile] = await Promise.all([
    content.getSiteLayout().catch(logError),
    content.getCompanyProfile().catch(logError),
  ]);
  if (!layout) {
    return null;
  }

  const { contact, socialProfiles } = layout;

  const url = getSiteUrl();
  const businessId = `${url}/#business`;
  const sameAs = [socialProfiles.instagram, socialProfiles.facebook, socialProfiles.linkedin].filter(
    (link): link is string => Boolean(link),
  );
  const areaServed = profile?.areaServed ?? [];
  const expertise = profile?.expertise ?? [];

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'LightingStore',
            '@id': businessId,
            name: contact.companyName ?? SITE_NAME,
            url,
            logo: `${url}/wehrli-licht-logo.svg`,
            image: `${url}/wehrli-licht-logo.svg`,
            ...(profile?.description && { description: profile.description }),
            ...(profile?.foundingYear && { foundingDate: String(profile.foundingYear) }),
            ...(contact.phone && { telephone: contact.phone }),
            ...(contact.email && { email: contact.email }),
            address: {
              '@type': 'PostalAddress',
              ...(contact.street && { streetAddress: contact.street }),
              ...(contact.zip && { postalCode: contact.zip }),
              ...(contact.place && { addressLocality: contact.place }),
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
            ...(contact.mapsHref && { hasMap: contact.mapsHref }),
            ...(areaServed.length > 0 && { areaServed: areaServed.map((name) => ({ '@type': 'Place', name })) }),
            ...(expertise.length > 0 && { knowsAbout: expertise }),
            ...(sameAs.length > 0 && { sameAs }),
          },
          {
            '@type': 'WebSite',
            '@id': `${url}/#website`,
            url,
            name: contact.companyName ?? SITE_NAME,
            inLanguage: 'de-CH',
            publisher: { '@id': businessId },
          },
        ],
      }}
    />
  );
};
