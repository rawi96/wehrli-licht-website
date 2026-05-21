import {
  footerBodyTextClassName,
  footerFormattedTextClassName,
  footerHeadingClassName,
  footerLinkClassName,
  footerMutedTextClassName,
} from '@/components/layout/footer-styles';
import { HeaderFooterRecord } from '@/graphql/generated';
import Link from 'next/link';
import { FC } from 'react';

type Props = Pick<
  HeaderFooterRecord,
  | 'companyName'
  | 'street'
  | 'zip'
  | 'place'
  | 'phone'
  | 'email'
  | 'mapsLink'
  | 'openingHoursTitle'
  | 'openingHoursText'
  | 'holidayDisable'
  | 'holidayTitle'
  | 'holidayText'
>;

const hasText = (value?: string | null): boolean => Boolean(value?.trim());

export const FooterContact: FC<Props> = (props) => {
  const {
    companyName,
    street,
    zip,
    place,
    phone,
    email,
    mapsLink,
    openingHoursTitle,
    openingHoursText,
    holidayDisable,
    holidayTitle,
    holidayText,
  } = props;

  const hasAddress = hasText(street) || hasText(zip) || hasText(place);
  const hasZipOrPlace = hasText(zip) || hasText(place);
  const showHoliday = !holidayDisable && hasText(holidayTitle) && hasText(holidayText);
  const showHours = hasText(openingHoursTitle) && hasText(openingHoursText);

  const addressContent = (
    <>
      {hasText(street) && (
        <span className="block" itemProp="streetAddress">
          {street}
        </span>
      )}
      {hasZipOrPlace && (
        <span className="block">
          {hasText(zip) && <span itemProp="postalCode">{zip}</span>}
          {hasText(zip) && hasText(place) && ' '}
          {hasText(place) && <span itemProp="addressLocality">{place}</span>}
        </span>
      )}
    </>
  );

  return (
    <div className={footerBodyTextClassName}>
      <h3 id="footer-contact-heading" className={footerHeadingClassName}>
        Kontakt
      </h3>

      <div className="mt-3 grid gap-5 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1 lg:gap-4">
        <address
          className="space-y-1 not-italic"
          aria-labelledby="footer-contact-heading"
          itemScope
          itemType="https://schema.org/Organization"
        >
          {hasText(companyName) && (
            <p className="font-semibold text-white" itemProp="name">
              {companyName}
            </p>
          )}

          {hasAddress &&
            (hasText(mapsLink) ? (
              <p>
                <Link
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  className={footerLinkClassName}
                >
                  <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    {addressContent}
                  </span>
                </Link>
              </p>
            ) : (
              <p itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                {addressContent}
              </p>
            ))}

          {hasText(phone) && (
            <p>
              <span className={footerMutedTextClassName}>Tel. </span>
              <Link href={`tel:${phone.replace(/\s/g, '')}`} className={footerLinkClassName} itemProp="telephone">
                {phone}
              </Link>
            </p>
          )}
          {hasText(email) && (
            <p>
              <span className={footerMutedTextClassName}>E-Mail </span>
              <Link href={`mailto:${email}`} className={footerLinkClassName} itemProp="email">
                {email}
              </Link>
            </p>
          )}
        </address>

        {(showHoliday || showHours) && (
          <div className="space-y-4">
            {showHoliday && holidayTitle && holidayText && (
              <section aria-labelledby="footer-holiday-heading">
                <h4 id="footer-holiday-heading" className={footerHeadingClassName}>
                  {holidayTitle}
                </h4>
                <FooterFormattedText text={holidayText} />
              </section>
            )}

            {showHours && openingHoursTitle && openingHoursText && (
              <section aria-labelledby="footer-hours-heading">
                <h4 id="footer-hours-heading" className={footerHeadingClassName}>
                  {openingHoursTitle}
                </h4>
                <FooterFormattedText text={openingHoursText} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FooterFormattedText = ({ text }: { text: string }) => (
  <div className={footerFormattedTextClassName}>
    <div dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);
