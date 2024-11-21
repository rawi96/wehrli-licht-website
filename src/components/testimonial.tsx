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
  <div className="my-8 grid grid-rows-[1fr,auto] items-center rounded bg-white-100 p-6 lg:p-10">
    <p className="text-center text-sm font-bold md:text-base lg:text-lg">
      <span className="text-wehrli">&laquo;</span>
      {quote}
      <span className="text-wehrli">&raquo;</span>
    </p>
    <div className="mt-8 flex w-full items-center gap-4">
      {image && <DatoSRCImage data={image} pictureClassName="size-16 md:size-20 shrink-0" imgClassName="rounded-full" />}
      {authorName && (
        <span className="text-xxs lg:text-sm">
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
