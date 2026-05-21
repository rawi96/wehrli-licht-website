import { ShopCmsTextLink } from '@/components/shop/shop-cms-text-link';
import { ShopSectionHeader } from '@/components/shop/shop-section-header';
import { ShopStructuredText } from '@/components/shop/shop-structured-text';
import { ShopServiceSectionFragment } from '@/graphql/generated';
import { getShopLinkHref } from '@/utils/shop-link';
import { getShopServiceIcon } from '@/utils/shop-service-icons';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  block: ShopServiceSectionFragment;
};

export const ShopServiceSectionBlock: FC<Props> = ({ block }) => {
  const headingId = shopSectionHeadingId('shop-service', block.id);
  const intro = toStructuredTextValue(block.intro);

  return (
    <section aria-labelledby={headingId} className="border-t border-gray-200 bg-white py-10 sm:py-12 md:py-20">
      <div className="mx-auto w-11/12 max-w-7xl">
        <ShopSectionHeader
          headingId={headingId}
          title={block.title}
          description={<ShopStructuredText data={intro} className="text-sm leading-relaxed text-gray-600 md:text-base" />}
          action={<ShopCmsTextLink link={block.offersLink} className="mt-4 md:mt-0" />}
        />

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {block.items.map((item) => {
            const Icon = getShopServiceIcon(item.icon);

            return (
              <li key={item.id}>
                <article className="bg-white-200 flex h-full flex-col rounded p-6 shadow-sm ring-1 ring-gray-200">
                  <div className="bg-wehrli/10 text-wehrli flex size-11 shrink-0 items-center justify-center rounded">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-wehrli mt-5 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600">{item.description}</p>
                  {item.link && (
                    <Link
                      href={getShopLinkHref(item.link)}
                      className="text-wehrli mt-4 inline-flex min-h-11 items-center text-sm font-bold hover:underline"
                      target={item.link.newTab ? '_blank' : undefined}
                      rel={item.link.newTab ? 'noopener noreferrer' : undefined}
                    >
                      {item.link.label}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
