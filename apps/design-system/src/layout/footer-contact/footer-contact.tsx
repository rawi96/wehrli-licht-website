import Link from 'next/link';
import { FC, ReactNode } from 'react';
import {
  FOOTER_BODY_TEXT_CLASS,
  FOOTER_HEADING_CLASS,
  FOOTER_LINK_CLASS,
  FOOTER_MUTED_TEXT_CLASS,
} from '../footer/footer-styles';

/** A titled text in the contact column, e.g. opening hours or holiday notice. */
export type FooterNotice = {
  title: string;
  /** Rich text (the website renders the CMS HTML). */
  text: ReactNode;
};

export type FooterContactProps = {
  companyName?: string | null;
  street?: string | null;
  zip?: string | null;
  place?: string | null;
  phone?: string | null;
  email?: string | null;
  /** Map link around the address. */
  mapsHref?: string | null;
  /** Shown above the opening hours, e.g. holiday closures. */
  holiday?: FooterNotice | null;
  openingHours?: FooterNotice | null;
  labels?: { title?: string; phone?: string; email?: string };
};

const hasText = (value?: string | null): value is string => Boolean(value?.trim());

const NoticeText: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className={`mt-1.5 ${FOOTER_BODY_TEXT_CLASS} [&_a]:text-white [&_a]:underline [&_a]:hover:text-white [&_li+li]:mt-0.5 [&_p]:m-0 [&_p+p]:mt-1.5 [&_ul]:mt-1`}
  >
    {children}
  </div>
);

/** Contact column of the footer: address (schema.org Organization), phone, e-mail, holiday notice and opening hours. */
export const FooterContact: FC<FooterContactProps> = ({
  companyName,
  street,
  zip,
  place,
  phone,
  email,
  mapsHref,
  holiday,
  openingHours,
  labels,
}) => {
  const hasAddress = hasText(street) || hasText(zip) || hasText(place);
  const hasZipOrPlace = hasText(zip) || hasText(place);

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
    <div className={FOOTER_BODY_TEXT_CLASS}>
      <h3 id="footer-contact-heading" className={FOOTER_HEADING_CLASS}>
        {labels?.title ?? 'Kontakt'}
      </h3>

      <div className="mt-3 grid gap-5 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1 lg:gap-4">
        <address
          className="space-y-1 not-italic"
          aria-labelledby="footer-contact-heading"
          itemScope
          itemType="https://schema.org/Organization"
        >
          {hasText(companyName) && (
            <p className="text-white" itemProp="name">
              {companyName}
            </p>
          )}

          {hasAddress &&
            (hasText(mapsHref) ? (
              <p>
                <Link
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  className={FOOTER_LINK_CLASS}
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
              <span className={FOOTER_MUTED_TEXT_CLASS}>{labels?.phone ?? 'Tel.'} </span>
              <Link href={`tel:${phone.replace(/\s/g, '')}`} className={FOOTER_LINK_CLASS} itemProp="telephone">
                {phone}
              </Link>
            </p>
          )}
          {hasText(email) && (
            <p>
              <span className={FOOTER_MUTED_TEXT_CLASS}>{labels?.email ?? 'E-Mail'} </span>
              <Link href={`mailto:${email}`} className={FOOTER_LINK_CLASS} itemProp="email">
                {email}
              </Link>
            </p>
          )}
        </address>

        {(holiday ?? openingHours) && (
          <div className="space-y-4">
            {holiday && (
              <section aria-labelledby="footer-holiday-heading">
                <h4 id="footer-holiday-heading" className={FOOTER_HEADING_CLASS}>
                  {holiday.title}
                </h4>
                <NoticeText>{holiday.text}</NoticeText>
              </section>
            )}

            {openingHours && (
              <section aria-labelledby="footer-hours-heading">
                <h4 id="footer-hours-heading" className={FOOTER_HEADING_CLASS}>
                  {openingHours.title}
                </h4>
                <NoticeText>{openingHours.text}</NoticeText>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
