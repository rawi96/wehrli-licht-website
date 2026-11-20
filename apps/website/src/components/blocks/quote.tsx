import { Section } from '@wehrli/design-system';
import { QuoteBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { SmallTestimonial } from '../small-testimonial';
import { Testimonial } from '../testimonial';

type Props = {
  block: QuoteBlockFragment;
};

export const QuoteBlock: FC<Props> = ({ block: { testimonials, disableMarginBottom, disableMarginTop } }) => {
  if (testimonials.length === 1) {
    const { text, authorImage, authorName, authorFunction, companyName, companyUrl } = testimonials[0];

    return (
      <Section marginBottom={!disableMarginBottom} marginTop={!disableMarginTop}>
        <Testimonial
          quote={text}
          image={authorImage?.responsiveImage}
          authorName={authorName}
          authorDesc={authorFunction}
          companyName={companyName}
          companyUrl={companyUrl}
        />
      </Section>
    );
  }

  return (
    <Section marginBottom={!disableMarginBottom} marginTop={!disableMarginTop}>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8 xl:gap-16">
        {testimonials.map(({ text, authorImage, authorName, authorFunction, companyName, companyUrl }, index) => (
          <SmallTestimonial
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
    </Section>
  );
};
