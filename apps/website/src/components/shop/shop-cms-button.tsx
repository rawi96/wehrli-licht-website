import { Button } from '@/components/button';
import { LinkBlockFragment } from '@/graphql/generated';
import { getShopLinkHref } from '@/utils/shop-link';
import { FC } from 'react';

type Props = {
  link: LinkBlockFragment;
  type: 'primary' | 'secondary';
  fullWidth?: boolean;
};

export const ShopCmsButton: FC<Props> = ({ link, type, fullWidth }) => (
  <Button
    text={link.label}
    type={type}
    href={getShopLinkHref(link)}
    showArrow={false}
    fullWidth={fullWidth}
    newTab={link.newTab}
  />
);
