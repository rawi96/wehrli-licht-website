import { ShopTextLink } from '@/components/shop/shop-text-link';
import { LinkBlockFragment } from '@/graphql/generated';
import { getShopLinkHref } from '@/utils/shop-link';
import { FC } from 'react';

type Props = {
  link: LinkBlockFragment;
  className?: string;
  inverted?: boolean;
};

export const ShopCmsTextLink: FC<Props> = ({ link, className, inverted }) => (
  <ShopTextLink
    href={getShopLinkHref(link)}
    label={link.label}
    newTab={link.newTab}
    className={className}
    inverted={inverted}
  />
);
