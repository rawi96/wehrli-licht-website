import { FormError } from '../../forms/field/field';
import { CheckoutActions } from '../checkout-actions/checkout-actions';
import { RadioCardOption, RadioCards } from '../radio-cards/radio-cards';

type Props<T extends string> = {
  options: RadioCardOption<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string | null;
  onBack: () => void;
  onContinue: () => void;
  labels?: { legend: string; continue: string };
};

const DEFAULT_LABELS = { legend: 'Zahlungsart', continue: 'Weiter zur Zusammenfassung' };

/** Checkout step 3: the payment method. */
export const CheckoutPaymentStep = <T extends string>({
  options,
  value,
  onChange,
  error,
  onBack,
  onContinue,
  labels = DEFAULT_LABELS,
}: Props<T>) => (
  <div className="space-y-6">
    <RadioCards name="payment" legend={labels.legend} options={options} value={value} onChange={onChange} />

    {error && <FormError>{error}</FormError>}
    <CheckoutActions onBack={onBack} nextLabel={labels.continue} onNext={onContinue} />
  </div>
);
