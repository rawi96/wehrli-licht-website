import { CheckoutActions } from '../checkout-actions/checkout-actions';
import { RadioCardOption, RadioCards } from '../radio-cards/radio-cards';

type Props<T extends string> = {
  /** Shipping methods; their descriptions carry the cost. */
  options: RadioCardOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Delivery time of the cart, e.g. "2–3 Wochen". */
  deliveryTime?: string | null;
  /** The back button leads back to the shop. */
  backHref: string;
  onContinue: () => void;
  labels?: { legend: string; deliveryTime: string; continue: string };
};

const DEFAULT_LABELS = { legend: 'Versandart', deliveryTime: 'Lieferzeit:', continue: 'Weiter' };

/** Checkout step 1: pickup or shipping. */
export const CheckoutShippingStep = <T extends string>({
  options,
  value,
  onChange,
  deliveryTime,
  backHref,
  onContinue,
  labels = DEFAULT_LABELS,
}: Props<T>) => (
  <div className="space-y-6">
    <RadioCards name="shipping" legend={labels.legend} options={options} value={value} onChange={onChange} />

    {deliveryTime && (
      <p className="mt-4 text-sm text-gray-600">
        {labels.deliveryTime} {deliveryTime}
      </p>
    )}

    <CheckoutActions backHref={backHref} nextLabel={labels.continue} onNext={onContinue} />
  </div>
);
