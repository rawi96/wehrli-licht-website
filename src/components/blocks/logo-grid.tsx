import { LogoGridBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: LogoGridBlockFragment;
};

export const LogoGridBlock: FC<Props> = ({ block: { logos, disableMarginBottom, disableMarginTop } }) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <div className="grid grid-cols-3 gap-8 rounded p-10 sm:gap-12 md:grid-cols-4 md:gap-16 xl:grid-cols-6">
      {logos?.map((logo) => (
        // there is no advantage in using next/image here, because the logos are SVGs
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={logo.id}
          src={logo.url}
          width={logo.width ?? undefined}
          height={logo.height ?? undefined}
          alt={logo.alt ?? 'Partner Logo'}
          loading="lazy"
          className="w-full"
        />
      ))}
    </div>
  </BlockWrapper>
);
