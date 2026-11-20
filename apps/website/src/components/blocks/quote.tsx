import { QuoteBlockFragment } from '@/graphql/generated';
import { toImage } from '@/utils/image';
import { QuoteBlock as QuoteBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: QuoteBlockFragment;
};

export const QuoteBlock: FC<Props> = ({ block: { testimonials, disableMarginBottom, disableMarginTop } }) => (
  <QuoteBlockView
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    testimonials={testimonials.map(({ text, authorImage, authorName, authorFunction, companyName, companyUrl }) => ({
      quote: text,
      image: toImage({ responsiveImage: authorImage?.responsiveImage }),
      authorName,
      authorDescription: authorFunction,
      companyName,
      companyUrl,
    }))}
  />
);
