import { LinkBlockFragment } from '@/graphql/generated';
import { getShopLinkHref } from '@/utils/shop-link';
import { Button } from '@wehrli/design-system';
import { ComponentProps, FC } from 'react';

type Props = {
  link: LinkBlockFragment;
  variant: ComponentProps<typeof Button>['variant'];
  fullWidth?: boolean;
};

export const ShopCmsButton: FC<Props> = ({ link, variant, fullWidth }) => (
  <Button variant={variant} href={getShopLinkHref(link)} showArrow={false} fullWidth={fullWidth} newTab={link.newTab}>
    {link.label}
  </Button>
);
