import { ResponsiveImageFragmentFragment } from '@/graphql/generated';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';

type Props = {
  quote: string;
  image?: ResponsiveImageFragmentFragment;
  authorName?: string;
  authorDesc?: string;
  companyName?: string;
  companyUrl?: string;
};

export const Testimonial: FC<Props> = ({ image, quote, authorName, authorDesc, companyName, companyUrl }) => (
  <div className="relative grid w-full grid-flow-row place-items-center overflow-hidden rounded bg-wehrli p-8 text-center font-sans text-sm font-normal text-white lg:p-32 lg:text-sm">
    {image && (
      <div className="z-10 h-24 w-24 lg:h-32 lg:w-32">
        <DatoSRCImage data={image} imgClassName="rounded-full" />
      </div>
    )}
    <p className="z-10 mb-4 mt-4 overflow-hidden whitespace-pre-line font-sans text-base font-bold sm:overflow-visible lg:mb-8 lg:text-xl">
      &laquo;
      {quote}
      &raquo;
    </p>
    {authorName && (
      <p className="z-10">
        {authorName}
        {authorDesc && `, ${authorDesc}`}
        {companyName && companyUrl && (
          <>
            <br />
            <a href={companyUrl} className="underline" target="_blank" rel="noopener noreferrer">
              {companyName}
            </a>
          </>
        )}
      </p>
    )}
  </div>
);
