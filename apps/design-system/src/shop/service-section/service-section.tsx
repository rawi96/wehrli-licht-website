import { BuildingStorefrontIcon, CreditCardIcon, EyeIcon, SparklesIcon, TruckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ComponentType, FC, ReactNode, SVGProps } from 'react';
import { ShopSectionHeader } from '../section-header/section-header';
import { ShopLink } from '../text-link/text-link';

const SERVICE_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  shipping: TruckIcon,
  pickup: BuildingStorefrontIcon,
  payment: CreditCardIcon,
  viewing: EyeIcon,
  showroom: SparklesIcon,
};

export type ShopServiceItem = {
  id: string;
  /** Icon key from the CMS: `shipping`, `pickup`, `payment`, `viewing` or `showroom`; unknown keys show the truck. */
  icon: string;
  title: string;
  description?: string | null;
  link?: ShopLink | null;
};

type Props = {
  headingId: string;
  title: string;
  /** Rich text below the title. */
  intro?: ReactNode;
  actionLink?: ShopLink | null;
  items: ShopServiceItem[];
};

const ServiceCard: FC<{ item: ShopServiceItem }> = ({ item }) => {
  const Icon = SERVICE_ICONS[item.icon] ?? TruckIcon;

  return (
    <article className="bg-white-200 flex h-full flex-col rounded-lg p-6 shadow-sm ring-1 ring-gray-200">
      <div className="bg-wehrli/10 text-wehrli flex size-11 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-wehrli mt-5 text-base font-bold">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-600">{item.description}</p>
      {item.link && (
        <Link
          href={item.link.href}
          className="text-wehrli mt-4 inline-flex min-h-11 items-center text-sm font-bold hover:underline"
          target={item.link.newTab ? '_blank' : undefined}
          rel={item.link.newTab ? 'noopener noreferrer' : undefined}
        >
          {item.link.label}
          <span aria-hidden="true"> →</span>
        </Link>
      )}
    </article>
  );
};

/** Storefront section with service cards (shipping, pickup, payment, ...): 1 column, 2 from sm, 3 from lg. */
export const ShopServiceSection: FC<Props> = ({ headingId, title, intro, actionLink, items }) => (
  <section aria-labelledby={headingId} className="border-t border-gray-200 bg-white py-10 sm:py-12 md:py-20">
    <div className="mx-auto w-11/12 max-w-7xl">
      <ShopSectionHeader
        headingId={headingId}
        title={title}
        description={intro ? <div className="text-sm leading-relaxed text-gray-600 md:text-base">{intro}</div> : null}
        action={actionLink}
      />

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <ServiceCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
