import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { Button } from '../../actions/button/button';
import { GalleryImage, ProductGallery } from '../product-gallery/product-gallery';
import { ProductSpecs, SpecRow } from '../product-specs/product-specs';

type Props = {
  name: string;
  images: GalleryImage[];
  /** Formatted price of the chosen variant. */
  price: string;
  deliveryTime?: string | null;
  /** Formatted shipping cost, e.g. "CHF 15.00" or "Gratis". */
  shippingCost: string;
  /** Option dropdowns, usually a VariationSelector. */
  variations?: ReactNode;
  onAddToCart: () => void;
  /** While the product is added: the button shows a spinner. */
  adding?: boolean;
  /** Link of the secondary button (book a viewing). */
  viewingHref: string;
  onViewingClick?: () => void;
  /** Contact form, prefilled with the product; the question line is hidden without it. */
  questionHref?: string | null;
  /** Rich text; the description heading is hidden without it. */
  description?: ReactNode;
  specs: SpecRow[];
  labels?: {
    addToCart: string;
    viewing: string;
    deliveryTime: string;
    shippingCost: string;
    question: string;
    questionLink: string;
    description: string;
    specs: string;
  };
};

const DEFAULT_LABELS = {
  addToCart: 'Zum Warenkorb hinzufügen',
  viewing: 'Besichtigungstermin vereinbaren',
  deliveryTime: 'Lieferzeit:',
  shippingCost: 'Versandkosten:',
  question: 'Fragen zu dieser Leuchte?',
  questionLink: 'Schreiben Sie uns',
  description: 'Beschreibung',
  specs: 'Technische Daten',
};

/** The product page: gallery beside name, price, options, buttons, description and technical data (two columns from lg). */
export const ProductDetail: FC<Props> = ({
  name,
  images,
  price,
  deliveryTime,
  shippingCost,
  variations,
  onAddToCart,
  adding,
  viewingHref,
  onViewingClick,
  questionHref,
  description,
  specs,
  labels = DEFAULT_LABELS,
}) => (
  <div className="mb-20 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
    {images.length > 0 && <ProductGallery images={images} label={name} />}

    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
      <h1 className="text-wehrli text-lg font-bold lg:text-xl">{name}</h1>

      <div className="mt-3">
        <p className="text-lg font-bold lg:text-xl">{price}</p>
        {deliveryTime && (
          <p className="mt-2 text-sm text-gray-600">
            {labels.deliveryTime} {deliveryTime}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-600">
          {labels.shippingCost} {shippingCost}
        </p>
      </div>

      <div className="mt-6">
        {variations}

        <div className="hidden lg:block">
          <div className="mt-3">
            <div className="mt-6 mb-10 flex items-center">
              <div className="mr-2">
                <Button variant="primary" onClick={onAddToCart} loading={adding}>
                  {labels.addToCart}
                </Button>
              </div>
              <Button variant="secondary" href={viewingHref} onClick={onViewingClick}>
                {labels.viewing}
              </Button>
            </div>
          </div>
        </div>
        <div className="block lg:hidden">
          <div className="w-full pt-6">
            <Button variant="primary" onClick={onAddToCart} fullWidth loading={adding}>
              {labels.addToCart}
            </Button>
          </div>

          <div className="pt-6 pb-10">
            <Button variant="secondary" href={viewingHref} onClick={onViewingClick} fullWidth>
              {labels.viewing}
            </Button>
          </div>
        </div>

        {questionHref && (
          <p className="-mt-4 mb-10 text-sm">
            {labels.question}{' '}
            <Link href={questionHref} className="text-wehrli font-bold underline">
              {labels.questionLink}
            </Link>
          </p>
        )}
      </div>

      {description ? (
        <>
          <div className="mt-8 mb-2">
            <p className="text-lg font-bold">{labels.description}</p>
          </div>
          {description}
        </>
      ) : null}

      <ProductSpecs rows={specs} title={labels.specs} />
    </div>
  </div>
);
