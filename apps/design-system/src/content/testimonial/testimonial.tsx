import { FC } from 'react';
import { Image, ImageData } from '../image/image';

type Props = {
  quote: string;
  /** Portrait of the author, shown round. */
  image?: ImageData | null;
  authorName?: string | null;
  /** Role or function of the author, shown after the name. */
  authorDescription?: string | null;
  /** Company of the author, linked (new tab) when `companyUrl` is set too. */
  companyName?: string | null;
  companyUrl?: string | null;
  /** `large`: one quote over the whole content width. `small`: a quote card for a grid of several quotes. */
  size?: 'large' | 'small';
};

const CompanyLink: FC<{ name: string; url: string }> = ({ name, url }) => (
  <a href={url} className="underline" target="_blank" rel="noopener noreferrer">
    {name}
  </a>
);

/** A customer quote on the brand color, with the author's portrait, name, function and company. */
export const Testimonial: FC<Props> = ({
  quote,
  image,
  authorName,
  authorDescription,
  companyName,
  companyUrl,
  size = 'large',
}) =>
  size === 'small' ? (
    <div className="bg-wehrli grid grid-rows-[1fr,auto] items-center rounded-lg p-6 text-white lg:p-10">
      <p className="text-center text-sm font-bold md:text-base lg:text-lg">
        <span>&laquo;</span>
        {quote}
        <span>&raquo;</span>
      </p>
      <div className="mt-8 flex w-full items-center gap-4">
        {image && (
          <div className="size-16 shrink-0 md:size-20">
            <Image image={image} sizes={image.sizes ?? undefined} imgClassName="rounded-full" />
          </div>
        )}
        {authorName && (
          <span className="text-sm lg:text-sm">
            <strong>{authorName}</strong>
            {authorDescription && (
              <>
                <br />
                <span>{authorDescription}</span>
              </>
            )}
            {companyName && companyUrl && (
              <>
                <br />
                <CompanyLink name={companyName} url={companyUrl} />
              </>
            )}
          </span>
        )}
      </div>
    </div>
  ) : (
    <div className="bg-wehrli relative grid w-full grid-flow-row place-items-center overflow-hidden rounded-lg p-8 text-center text-sm font-normal text-white lg:p-20 lg:text-sm">
      {image && (
        <div className="z-10 h-24 w-24 lg:h-32 lg:w-32">
          <Image image={image} sizes={image.sizes ?? undefined} imgClassName="rounded-full" />
        </div>
      )}
      <p className="z-10 mt-4 mb-4 overflow-hidden text-base font-bold whitespace-pre-line sm:overflow-visible lg:mb-8 lg:text-xl">
        &laquo;
        {quote}
        &raquo;
      </p>
      {authorName && (
        <p className="z-10">
          {authorName}
          {authorDescription && `, ${authorDescription}`}
          {companyName && companyUrl && (
            <>
              <br />
              <CompanyLink name={companyName} url={companyUrl} />
            </>
          )}
        </p>
      )}
    </div>
  );
