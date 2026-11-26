import { LogoGridBlockFragment } from '@/graphql/generated';
import { LogoGridBlock as LogoGridBlockView } from '@wehrli/design-system';
import { FC } from 'react';
import { toLink } from '../links';

type Props = {
  block: LogoGridBlockFragment;
};

export const LogoGridBlock: FC<Props> = ({ block: { logos, limit, link, disableMarginBottom, disableMarginTop } }) => (
  <LogoGridBlockView
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    link={link ? toLink(link) : null}
    // The partner's website is kept in the logo's title.
    logos={(logos ?? []).slice(0, limit ?? undefined).map(({ id, url, width, height, alt, title }) => ({
      id,
      src: url,
      width,
      height,
      alt: alt ?? 'Partner Logo',
      href: title ?? '#',
    }))}
  />
);
