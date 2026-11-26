import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { Button } from '../../actions/button/button';
import { CheckoutErrorAlert } from '../checkout-error-alert/checkout-error-alert';

export type CheckoutSuccessOrder = {
  /** Where the confirmation was sent. */
  email: string;
  number: string;
  payment: string;
  shipping: string;
  address?: string | null;
  deliveryTime?: string | null;
  /** Formatted total. */
  total: string;
  comment?: string | null;
  /** Below the summary, e.g. how to pay. */
  note?: string | null;
};

type Status =
  /** Paid online: the confirmation went out by email. */
  | { kind: 'paid' }
  /** Ordered with prepayment or payment on site: a summary of the order. */
  | { kind: 'ordered'; order: CheckoutSuccessOrder }
  /** Paid, but the confirmation email failed. */
  | { kind: 'emailFailed'; message: string }
  /** The page was opened without a valid order. */
  | { kind: 'invalid' };

type Props = {
  status: Status;
  shopHref: string;
  websiteHref: string;
  contactHref: string;
  labels?: {
    title: string;
    paidText: string;
    confirmationTo: string;
    number: string;
    payment: string;
    shipping: string;
    address: string;
    deliveryTime: string;
    total: string;
    comment: string;
    invalidTitle: string;
    invalidText: string;
    invalidLink: string;
    toShop: string;
    toWebsite: string;
  };
};

const DEFAULT_LABELS = {
  title: 'Vielen Dank!',
  paidText: 'Bestätigung per E-Mail wurde versendet.',
  confirmationTo: 'Bestätigung an',
  number: 'Nr.',
  payment: 'Zahlung',
  shipping: 'Versand',
  address: 'Adresse',
  deliveryTime: 'Lieferzeit',
  total: 'Total',
  comment: 'Kommentar',
  invalidTitle: 'Bestellung prüfen',
  invalidText:
    'Diese Seite ist ungültig oder die Zahlung wurde noch nicht bestätigt. Bitte prüfen Sie Ihre E-Mails oder melden Sie sich über unsere',
  invalidLink: 'Kontaktseite',
  toShop: 'Zum Shop',
  toWebsite: 'Zur Website',
};

const Actions: FC<{ shopHref: string; websiteHref: string; labels: typeof DEFAULT_LABELS }> = ({
  shopHref,
  websiteHref,
  labels,
}) => (
  <div className="mt-8 flex flex-wrap gap-3">
    <Button variant="primary" href={shopHref} showArrow={false}>
      {labels.toShop}
    </Button>
    <Button variant="secondary" href={websiteHref} showArrow={false}>
      {labels.toWebsite}
    </Button>
  </div>
);

const InlineRow: FC<{ label: string; children: ReactNode; small?: boolean }> = ({ label, children, small }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-gray-600">{label}</dt>
    <dd className={small ? 'text-xs' : undefined}>{children}</dd>
  </div>
);

/** The page after the order: thanks and a summary, or what went wrong. */
export const CheckoutSuccess: FC<Props> = ({ status, shopHref, websiteHref, contactHref, labels = DEFAULT_LABELS }) => {
  if (status.kind === 'emailFailed') {
    return (
      <div className="mx-auto max-w-lg py-12">
        <CheckoutErrorAlert message={status.message} contactHref={contactHref} />
        <div className="mt-8">
          <Button variant="secondary" href={shopHref} showArrow={false}>
            {labels.toShop}
          </Button>
        </div>
      </div>
    );
  }

  if (status.kind === 'invalid') {
    return (
      <div className="mx-auto max-w-lg py-12">
        <h1 className="font-bold">{labels.invalidTitle}</h1>
        <p className="mt-4 text-sm text-gray-600">
          {labels.invalidText}{' '}
          <Link href={contactHref} className="font-bold underline">
            {labels.invalidLink}
          </Link>
          .
        </p>
        <Actions shopHref={shopHref} websiteHref={websiteHref} labels={labels} />
      </div>
    );
  }

  if (status.kind === 'ordered') {
    const { order } = status;

    return (
      <div className="mx-auto max-w-lg py-8">
        <h1 className="font-bold">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {labels.confirmationTo}{' '}
          <a className="underline" href={`mailto:${order.email}`}>
            {order.email}
          </a>
        </p>

        <dl className="mt-6 space-y-1 border-t border-gray-200 pt-4 text-sm">
          <InlineRow label={labels.number} small>
            {order.number}
          </InlineRow>
          <InlineRow label={labels.payment}>{order.payment}</InlineRow>
          <InlineRow label={labels.shipping}>{order.shipping}</InlineRow>
          {order.address && (
            <div>
              <dt className="text-gray-600">{labels.address}</dt>
              <dd className="mt-1">{order.address}</dd>
            </div>
          )}
          {order.deliveryTime && <InlineRow label={labels.deliveryTime}>{order.deliveryTime}</InlineRow>}
          <div className="flex justify-between gap-4 font-bold">
            <dt>{labels.total}</dt>
            <dd>{order.total}</dd>
          </div>
          {order.comment && (
            <div>
              <dt className="text-gray-600">{labels.comment}</dt>
              <dd className="mt-1 whitespace-pre-wrap">{order.comment}</dd>
            </div>
          )}
        </dl>

        {order.note && <p className="mt-6 text-sm">{order.note}</p>}

        <Actions shopHref={shopHref} websiteHref={websiteHref} labels={labels} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <h1 className="font-bold">{labels.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{labels.paidText}</p>
      <Actions shopHref={shopHref} websiteHref={websiteHref} labels={labels} />
    </div>
  );
};
