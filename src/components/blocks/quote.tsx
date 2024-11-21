import { QuoteBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { Testimonial } from '../testimonial';

type Props = {
  block: QuoteBlockFragment;
};

export const QuoteBlock: FC<Props> = ({ block: { testimonials, disableMarginBottom, disableMarginTop } }) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <div className="grid gap-4 lg:grid-cols-2 lg:gap-8 xl:gap-16">
      {testimonials.map(({ text, authorImage, authorName, authorFunction, companyName, companyUrl }, index) => (
        <Testimonial
          key={index}
          quote={text}
          image={authorImage?.responsiveImage}
          authorName={authorName}
          authorDesc={authorFunction}
          companyName={companyName}
          companyUrl={companyUrl}
        />
      ))}
    </div>
  </BlockWrapper>
);
