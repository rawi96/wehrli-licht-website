import { CHECKOUT_ERROR_ALERT_COPY, CheckoutErrorAlertVariant } from '@/constants/checkout-errors';
import Link from 'next/link';

type Props = {
  variant: CheckoutErrorAlertVariant;
};

export const CheckoutErrorAlert = ({ variant }: Props) => {
  return (
    <div role="alert" className="border-error rounded border-2 bg-[#fdecec] p-4 text-[#b91c1c]">
      <p className="text-base leading-snug font-bold">Etwas ist schiefgelaufen</p>
      <p className="mt-2 text-sm leading-relaxed">{CHECKOUT_ERROR_ALERT_COPY[variant]}</p>
      <p className="mt-3 text-sm">
        <Link href="/kontakt" className="font-bold underline underline-offset-2">
          Zur Kontaktseite
        </Link>
      </p>
    </div>
  );
};
