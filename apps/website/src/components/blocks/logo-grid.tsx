import { LogoGridBlockFragment } from '@/graphql/generated';
import { LogoGridBlock as LogoGridBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: LogoGridBlockFragment;
};

export const LogoGridBlock: FC<Props> = ({ block: { logos, disableMarginBottom, disableMarginTop } }) => (
  <LogoGridBlockView
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    // The partner's website is kept in the logo's title.
    logos={(logos ?? []).map(({ id, url, width, height, alt, title }) => ({
      id,
      src: url,
      width,
      height,
      alt: alt ?? 'Partner Logo',
      href: title ?? '#',
    }))}
  />
);
