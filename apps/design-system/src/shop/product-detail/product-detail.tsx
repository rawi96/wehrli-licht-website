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
  /** Link of the secondary button (book a viewing). */
  viewingHref: string;
  onViewingClick?: () => void;
  /** Contact form, prefilled with the product; the question line is hidden without it. */
  questionHref?: string | null;
  /** Rich text; the description heading is hidden without it. */
  description?: ReactNode;
  specs: SpecRow[];
  /** Texts; missing ones use the defaults. */
  labels?: Partial<{
    addToCart: string;
    viewing: string;
    deliveryTime: string;
    shippingCost: string;
    question: string;
    questionLink: string;
    description: string;
    specs: string;
  }>;
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
  viewingHref,
  onViewingClick,
  questionHref,
  description,
  specs,
  labels: labelOverrides,
}) => {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };

  return (
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

          {/* Stacked full-width buttons on mobile, side by side from lg. */}
          <div className="flex flex-col gap-6 pt-6 pb-10 lg:mt-6 lg:mb-10 lg:flex-row lg:items-center lg:gap-2 lg:pt-0 lg:pb-0">
            <Button variant="primary" onClick={onAddToCart}>
              {labels.addToCart}
            </Button>
            <Button variant="secondary" href={viewingHref} onClick={onViewingClick}>
              {labels.viewing}
            </Button>
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
};
