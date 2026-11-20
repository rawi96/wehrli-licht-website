import { ComponentProps, FC } from 'react';
import { Testimonial } from '../../content/testimonial/testimonial';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  testimonials: Omit<ComponentProps<typeof Testimonial>, 'size'>[];
};

/** One large quote, or several small ones in two columns from lg. */
export const QuoteBlock: FC<Props> = ({ testimonials, marginTop, marginBottom }) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    {testimonials.length === 1 ? (
      <Testimonial {...testimonials[0]} />
    ) : (
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8 xl:gap-16">
        {testimonials.map((testimonial, index) => (
          // Quotes have no id and are rendered on the server only, the index is a stable key.
          // eslint-disable-next-line @eslint-react/no-array-index-key
          <Testimonial key={index} {...testimonial} size="small" />
        ))}
      </div>
    )}
  </Section>
);
