import { FC, ReactNode } from 'react';
import { FormError } from '../../forms/field/field';
import { CheckoutActions } from '../checkout-actions/checkout-actions';

export type CheckoutReviewLine = {
  id: string;
  name: string;
  quantity: number;
  selectionsLabel?: string | null;
  /** Formatted line total. */
  total: string;
};

type Props = {
  /** Text above the summary. */
  intro: ReactNode;
  contact: { name: string; email: string; phone: string };
  shipping: { method: string; address?: string | null; deliveryTime?: string | null };
  payment: { title: string; description: string };
  comment?: string | null;
  lines: CheckoutReviewLine[];
  /** Formatted totals. */
  subtotal: string;
  shippingCost: string;
  total: string;
  /** The cart is checked on the server: lines are hidden and ordering waits. */
  checking?: boolean;
  error?: string | null;
  submitting?: boolean;
  submitLabel: string;
  onBack: () => void;
  onSubmit: () => void;
  labels?: {
    contact: string;
    name: string;
    email: string;
    phone: string;
    shipping: string;
    deliveryTime: string;
    payment: string;
    comment: string;
    items: string;
    checking: string;
    subtotal: string;
    shippingCost: string;
    total: string;
  };
};

const DEFAULT_LABELS = {
  contact: 'Kontakt',
  name: 'Name',
  email: 'E-Mail',
  phone: 'Telefon',
  shipping: 'Versand',
  deliveryTime: 'Lieferzeit:',
  payment: 'Zahlung',
  comment: 'Kommentar',
  items: 'Artikel',
  checking: 'Warenkorb wird geprüft…',
  subtotal: 'Zwischentotal',
  shippingCost: 'Versand',
  total: 'Total',
};

const Row: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-gray-500">{label}</dt>
    <dd className="text-right">{children}</dd>
  </div>
);

/** Checkout step 4: everything entered, the verified lines and totals, and the order button. */
export const CheckoutReview: FC<Props> = ({
  intro,
  contact,
  shipping,
  payment,
  comment,
  lines,
  subtotal,
  shippingCost,
  total,
  checking,
  error,
  submitting,
  submitLabel,
  onBack,
  onSubmit,
  labels = DEFAULT_LABELS,
}) => (
  <div className="space-y-8">
    <p className="text-sm text-gray-600">{intro}</p>

    <section className="space-y-3">
      <h2 className="text-sm font-bold">{labels.contact}</h2>
      <dl className="space-y-1 text-sm">
        <Row label={labels.name}>{contact.name}</Row>
        <Row label={labels.email}>{contact.email}</Row>
        <Row label={labels.phone}>{contact.phone}</Row>
      </dl>
    </section>

    <section className="space-y-3">
      <h2 className="text-sm font-bold">{labels.shipping}</h2>
      <p className="text-sm">{shipping.method}</p>
      {shipping.address && <p className="text-sm text-gray-600">{shipping.address}</p>}
      {shipping.deliveryTime && (
        <p className="text-sm text-gray-600">
          {labels.deliveryTime} {shipping.deliveryTime}
        </p>
      )}
    </section>

    <section className="space-y-3">
      <h2 className="text-sm font-bold">{labels.payment}</h2>
      <p className="text-sm font-bold">{payment.title}</p>
      <p className="text-sm text-gray-600">{payment.description}</p>
    </section>

    {comment && (
      <section className="space-y-3">
        <h2 className="text-sm font-bold">{labels.comment}</h2>
        <p className="text-sm whitespace-pre-wrap text-gray-600">{comment}</p>
      </section>
    )}

    <section className="space-y-3 border-t border-gray-200 pt-6">
      <h2 className="text-sm font-bold">{labels.items}</h2>
      {checking && <p className="text-sm text-gray-500">{labels.checking}</p>}
      <ul className="space-y-3 text-sm">
        {!checking &&
          lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-4">
              <span>
                {line.quantity}× {line.name}
                {line.selectionsLabel && <span className="block text-gray-500">{line.selectionsLabel}</span>}
              </span>
              <span className="shrink-0">{line.total}</span>
            </li>
          ))}
      </ul>
      <dl className="space-y-1 border-t border-gray-100 pt-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">{labels.subtotal}</dt>
          <dd>{subtotal}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">{labels.shippingCost}</dt>
          <dd>{shippingCost}</dd>
        </div>
        <div className="flex justify-between gap-4 font-bold">
          <dt>{labels.total}</dt>
          <dd>{total}</dd>
        </div>
      </dl>
    </section>

    {error && <FormError>{error}</FormError>}

    <CheckoutActions
      onBack={onBack}
      nextLabel={submitLabel}
      onNext={onSubmit}
      loading={submitting}
      disabled={!!checking || lines.length === 0}
    />
  </div>
);
