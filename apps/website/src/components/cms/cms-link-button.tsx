import { Button } from '@/components/button';
import { LinkBlockFragment } from '@/graphql/generated';
import { getCmsLinkHref } from '@/utils/cms-link';
import { FC } from 'react';

type Props = {
  link: LinkBlockFragment;
  type: 'primary' | 'secondary';
  fullWidth?: boolean;
  white?: boolean;
  showArrow?: boolean;
};

export const CmsLinkButton: FC<Props> = ({ link, type, fullWidth, white, showArrow = false }) => (
  <Button
    text={link.label}
    type={type}
    href={getCmsLinkHref(link)}
    showArrow={showArrow}
    fullWidth={fullWidth}
    white={white}
    newTab={link.newTab}
  />
);
