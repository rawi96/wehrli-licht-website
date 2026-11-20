import Link from 'next/link';
import { FC } from 'react';

type Props = {
  message: string;
  /** Contact page, linked below the message. */
  contactHref: string;
  labels?: { title: string; contactLink: string };
};

const DEFAULT_LABELS = { title: 'Etwas ist schiefgelaufen', contactLink: 'Zur Kontaktseite' };

/** An order that could not be completed: what happened and a link to the contact page. */
export const CheckoutErrorAlert: FC<Props> = ({ message, contactHref, labels = DEFAULT_LABELS }) => (
  <div role="alert" className="border-error bg-error-50 text-error-700 rounded-lg border-2 p-4">
    <p className="text-base leading-snug font-bold">{labels.title}</p>
    <p className="mt-2 text-sm leading-relaxed">{message}</p>
    <p className="mt-3 text-sm">
      <Link href={contactHref} className="font-bold underline underline-offset-2">
        {labels.contactLink}
      </Link>
    </p>
  </div>
);
