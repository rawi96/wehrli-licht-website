import { LinkBlockFragment } from '@/graphql/generated';
import { getCmsLinkHref } from '@/utils/cms-link';
import { Button } from '@wehrli/design-system';
import { ComponentProps, FC } from 'react';

type Props = {
  link: LinkBlockFragment;
  variant: ComponentProps<typeof Button>['variant'];
  fullWidth?: boolean;
  showArrow?: boolean;
};

export const CmsLinkButton: FC<Props> = ({ link, variant, fullWidth, showArrow = false }) => (
  <Button variant={variant} href={getCmsLinkHref(link)} showArrow={showArrow} fullWidth={fullWidth} newTab={link.newTab}>
    {link.label}
  </Button>
);
