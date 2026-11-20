import NextLink from 'next/link';
import { FC } from 'react';
import { Image, ImageData } from '../../content/image/image';
import { Section } from '../../layout/section/section';

type Props = {
  /** Invitation to get in touch, line breaks are kept. */
  text: string;
  /** Square portrait of the contact person, shown round. */
  image?: ImageData | null;
  email?: string | null;
  phone?: string | null;
  /** Link to book an appointment, shown before e-mail and phone. */
  appointment?: { label: string; href: string } | null;
};

const linkClass =
  'hover:border-wehrli hover:text-wehrli mb-2 border-b-2 border-black text-center font-bold no-underline transition-colors duration-150';

/** A contact person with portrait, text and links to book an appointment, write an e-mail or call. */
export const ContactBlock: FC<Props> = ({ text, image, email, phone, appointment }) => (
  <Section>
    <div className="grid grid-flow-row place-content-center items-center justify-items-center gap-6 px-4 text-center lg:grid-flow-col lg:gap-12 lg:px-14 lg:text-left">
      {image && (
        <div className="h-36 w-36 lg:h-52 lg:w-52">
          <Image image={image} sizes={image.sizes ?? undefined} fit="fill" rounded="full" />
        </div>
      )}
      <div>
        <p className="text-wehrli mb-4 text-base font-bold whitespace-pre-line lg:mb-8 lg:text-xl">{text}</p>
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:justify-start lg:gap-4">
          {appointment && (
            <NextLink className={linkClass} href={appointment.href}>
              {appointment.label}
            </NextLink>
          )}
          {email && (
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className={linkClass}>
              {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  </Section>
);
