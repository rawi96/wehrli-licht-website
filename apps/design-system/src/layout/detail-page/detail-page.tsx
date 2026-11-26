import NextLink from 'next/link';
import { FC, ReactNode } from 'react';
import { BREADCRUMBS_GAP, PAGE_HEAD_TOP } from '../page-head/page-head';
import { Image, ImageData } from '../../content/image/image';

type Contact = {
  name: string;
  /** Role below the name, e.g. «Geschäftsinhaberin». */
  role?: string | null;
  /** Square portrait, shown round. */
  image?: ImageData | null;
  appointment?: { label: string; href: string } | null;
  email?: string | null;
  phone?: string | null;
};

type Props = {
  /** The breadcrumb trail, above the title. */
  breadcrumbs?: ReactNode;
  /** The page's H1. */
  title: string;
  /** Lead text below the title. */
  intro?: string | null;
  /** Wide picture between the head and the content. */
  image?: ImageData | null;
  /** The contact person for the page, as a bar below the picture. */
  contact?: Contact | null;
  /** The page's blocks. */
  children: ReactNode;
};

/** The contact person as a dark bar: portrait, name and role on the left, appointment, phone and e-mail on the right. */
const ContactBar: FC<{ contact: Contact }> = ({ contact }) => (
  <div className="surface-dark bg-wehrli mt-6 flex flex-col gap-5 rounded-md p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between lg:mt-8 lg:p-8">
    <div className="flex items-center gap-4">
      {contact.image && (
        <div className="relative h-16 w-16 shrink-0 rounded-full ring-2 ring-white/25">
          <Image image={contact.image} sizes="64px" fit="fill" rounded="full" />
        </div>
      )}
      <p className="text-xs text-white/70">
        Ihre Ansprechperson
        <span className="block text-base font-bold text-white">{contact.name}</span>
        {contact.role && <span className="block">{contact.role}</span>}
      </p>
    </div>
    <div className="flex flex-col gap-3">
      {contact.appointment && (
        <NextLink
          href={contact.appointment.href}
          className="text-wehrli hover:bg-wehrli-50 rounded-md bg-white px-4 py-2.5 text-center text-sm font-bold no-underline transition-colors"
        >
          {contact.appointment.label}
        </NextLink>
      )}
      {(contact.phone ?? contact.email) && (
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="font-bold text-white/85 hover:text-white">
              {contact.phone}
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="font-bold text-white/85 hover:text-white">
              {contact.email}
            </a>
          )}
        </p>
      )}
    </div>
  </div>
);

/**
 * Detail page (a page without sub-pages, see docs/adr/0002-page-levels.md): title and lead in reading width, a wide
 * picture, the contact person as a bar, then the content in the full column.
 */
export const DetailPage: FC<Props> = ({ breadcrumbs, title, intro, image, contact, children }) => {
  return (
    <article>
      <header className={PAGE_HEAD_TOP}>
        {breadcrumbs ? <div className={BREADCRUMBS_GAP}>{breadcrumbs}</div> : null}
        <div className="max-w-3xl">
          <h1 className="text-wehrli md:text-title text-xl leading-tight font-bold text-balance break-words hyphens-auto">
            {title}
          </h1>
          {intro && <p className="mt-6 text-base leading-normal text-black lg:text-lg">{intro}</p>}
        </div>
      </header>
      {image && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-md lg:mt-12 lg:aspect-[21/8]">
          {/* Settles in once on load (a slight zoom out); transform only, so the LCP and layout are unaffected. */}
          <div className="animate-head-settle absolute inset-0 motion-reduce:animate-none">
            <Image image={image} sizes="(min-width: 1400px) 1280px, 92vw" priority absolute />
          </div>
        </div>
      )}
      {contact && <ContactBar contact={contact} />}
      {children}
    </article>
  );
};
