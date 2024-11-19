import { QuoteBlockFragment } from '@/graphql/generated';
import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: QuoteBlockFragment;
};

export const QuoteBlock: FC<Props> = ({ block: { testimonials } }) => {
  return (
    <BlockWrapper>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8 xl:gap-16">
        {testimonials?.map((testimonial, index) => (
          <div key={index} className="grid grid-rows-[1fr,auto] items-center rounded bg-white p-6 lg:p-10">
            <p className="sr-only">5 von 5 Sterne</p>
            <div className="flex gap-x-1 text-wehrli">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} aria-hidden="true" className="h-5 w-5 flex-none" />
              ))}
            </div>
            <blockquote className="font-semibold text-gray-900 sm:text-2xl/9 mt-10 text-xl/8 tracking-tight">
              <span className="inline text-wehrli">&laquo;</span>
              {testimonial.text}
              <span className="inline text-wehrli">&raquo;</span>
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-x-6">
              {testimonial.authorImage?.responsiveImage && (
                <Image
                  src={testimonial.authorImage.responsiveImage.src}
                  alt="Author photo"
                  width={48}
                  height={48}
                  className="bg-gray-50 h-12 w-12 rounded-full"
                />
              )}
              <div className="text-sm/6">
                <div className="font-semibold text-gray-900">{testimonial.authorFunction}</div>
                <div className="text-gray-600 mt-0.5">{testimonial.authorName}</div>
                <div className="text-gray-600 hover:text-gray-900 mt-0.5 underline">
                  <a href={testimonial.companyUrl} target="_blank" rel="noopener noreferrer">
                    {testimonial.companyName}
                  </a>
                </div>
              </div>
            </figcaption>
          </div>
        ))}
      </div>
    </BlockWrapper>
  );
};
