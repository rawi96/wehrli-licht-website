import Link from 'next/link';

type AddressProps = {
  size?: 's' | 'l';
  companyName?: string | null;
  street?: string | null;
  zip?: string | null;
  place?: string | null;
  phone?: string | null;
  email?: string | null;
  mapsLink?: string | null;
};

export const Address = ({ size = 's', companyName, street, zip, place, phone, email, mapsLink }: AddressProps) => (
  <address
    className={`${size === 's' ? 'text-sm' : 'leading-6'} text-center not-italic`}
    itemScope
    itemType="https://schema.org/Organization"
  >
    {mapsLink && (
      <span className="inline-block">
        <Link
          href={mapsLink}
          target="_blank"
          itemProp="address"
          itemScope
          itemType="https://schema.org/PostalAddress"
          className="hover:opacity-50"
        >
          {companyName && <p itemProp="name">{companyName}</p>}
          {street && <p itemProp="streetAddress">{street}</p>}
          {zip && <span itemProp="postalCode">{zip}</span>} {place && <span itemProp="addressLocality">{place}</span>}
        </Link>
        <p className="mt-4">
          {phone && (
            <Link className="block p-4 underline hover:opacity-50" href={`tel:${phone}`} itemProp="telephone">
              <span
                className={`${size === 'l' ? 'border-black' : 'text-white'} ${'relative inline-flex items-center border px-6 py-4 text-sm lg:px-6'}`}
              >
                {phone}
              </span>
            </Link>
          )}
          {email && (
            <Link className="block p-4 underline hover:opacity-50" href={`mailto:${email}`} itemProp="email">
              <span
                className={`${size === 'l' ? 'border-black' : 'text-white'} ${'relative inline-flex items-center border px-6 py-4 text-sm lg:px-6'}`}
              >
                {email}
              </span>
            </Link>
          )}
        </p>
      </span>
    )}
  </address>
);
