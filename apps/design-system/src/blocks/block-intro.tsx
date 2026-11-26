import { FC } from 'react';
import { Heading } from '../typography/heading/heading';

type Props = {
  title?: string | null;
  intro?: string | null;
  /** On a dark background. */
  inverted?: boolean;
};

/** Optional title and short intro above a block's items. */
export const BlockIntro: FC<Props> = ({ title, intro, inverted = false }) =>
  title || intro ? (
    <div className="mb-8 max-w-3xl lg:mb-12">
      {title ? (
        <Heading level="2" color={inverted ? 'white' : 'wehrli'}>
          {title}
        </Heading>
      ) : null}
      {intro ? <p className={inverted ? 'text-sm text-white/80' : 'text-sm text-black'}>{intro}</p> : null}
    </div>
  ) : null;
