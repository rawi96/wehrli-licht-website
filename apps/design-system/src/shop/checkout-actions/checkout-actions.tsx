import { FC } from 'react';
import { Button } from '../../actions/button/button';

type Props = {
  /** The back button links here, or calls `onBack`. */
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  nextLabel: string;
  /** `submit` makes the next button submit the surrounding form instead of calling `onNext`. */
  nextType?: 'button' | 'submit';
  onNext?: () => void;
  /** Spinner on the next button. */
  loading?: boolean;
  disabled?: boolean;
};

/** Back and next buttons below a checkout step. */
export const CheckoutActions: FC<Props> = ({
  backHref,
  onBack,
  backLabel = 'Zurück',
  nextLabel,
  nextType = 'button',
  onNext,
  loading,
  disabled,
}) => (
  <div className="flex justify-between gap-4">
    <Button variant="secondary" showArrow={false} href={backHref} onClick={onBack}>
      {backLabel}
    </Button>
    <Button variant="primary" type={nextType} onClick={onNext} loading={loading} disabled={disabled}>
      {nextLabel}
    </Button>
  </div>
);
