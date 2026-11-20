import { FC } from 'react';
import { Button } from '../../actions/button/button';

type Props = {
  shopHref: string;
  labels?: { title: string; text: string; toShop: string };
};

const DEFAULT_LABELS = { title: 'Zahlung abgebrochen', text: 'Warenkorb ist noch da.', toShop: 'Zum Shop' };

/** The page after an online payment was cancelled: the cart is kept. */
export const CheckoutCancelled: FC<Props> = ({ shopHref, labels = DEFAULT_LABELS }) => (
  <div className="mx-auto max-w-lg py-12">
    <h1 className="text-xl font-bold">{labels.title}</h1>
    <p className="mt-2 text-sm">{labels.text}</p>
    <div className="mt-8">
      <Button variant="primary" href={shopHref} showArrow={false}>
        {labels.toShop}
      </Button>
    </div>
  </div>
);
