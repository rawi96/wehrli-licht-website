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

export const SmallTestimonial: FC<Props> = ({ image, quote, authorName, authorDesc, companyName, companyUrl }) => (
  <div className="grid grid-rows-[1fr,auto] items-center rounded bg-wehrli p-6 text-white lg:p-10">
    <p className="text-center text-sm font-bold md:text-base lg:text-lg">
      <span>&laquo;</span>
      {quote}
      <span>&raquo;</span>
    </p>
    <div className="mt-8 flex w-full items-center gap-4">
      {image && <DatoSRCImage data={image} pictureClassName="size-16 md:size-20 shrink-0" imgClassName="rounded-full" />}
      {authorName && (
        <span className="text-sm lg:text-sm">
          <strong>{authorName}</strong>
          {authorDesc && (
            <>
              <br />
              <span>{authorDesc}</span>
            </>
          )}
          {companyName && companyUrl && (
            <>
              <br />
              <a href={companyUrl} className="underline" target="_blank" rel="noopener noreferrer">
                {companyName}
              </a>
            </>
          )}
        </span>
      )}
    </div>
  </div>
);
