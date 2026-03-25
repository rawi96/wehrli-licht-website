import NextLink from 'next/link';
import { FC } from 'react';
import { ResponsiveImageType } from 'react-datocms';
import { ImageComponent } from './image';
import { classNames } from '@/utils/css';

type Props = {
  title: string;
  description?: string | null;
  eyebrow?: string | null;
  link?: string | null;
  linkLabel?: string | null;
  linkTitle?: string;
  image?: ResponsiveImageType;
};

export const Card: FC<Props> = ({ title, description, link, linkLabel, linkTitle, image, eyebrow }) => (
  <NextLink
    href={link ?? '#'}
    title={linkTitle ?? title}
    prefetch={link?.startsWith('/projekte/') ? false : undefined}
    className={classNames(
      'group bg-white-100 grid w-full grid-rows-[auto,1fr,auto] overflow-hidden rounded text-black transition-transform active:scale-[.99]',
    )}
    target={'_self'}
  >
    <div className="relative overflow-hidden">
      {image && (
        <ImageComponent
          image={{ responsiveImage: image }}
          imgClassName="transition-transform duration-300 group-hover:scale-110"
        />
      )}
    </div>
    <div className="grid grid-rows-[auto,1fr,auto] p-5 text-sm font-normal md:p-6 lg:p-8 lg:text-sm">
      {eyebrow && <p>{eyebrow}</p>}
      <div>
        <h2 className="text-wehrli my-4 text-lg font-bold peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
          {title}
        </h2>
        {description && <p className="mb-2 lg:mb-4">{description}</p>}
      </div>
      <div>
        <span className="border-b-2 border-black">{linkLabel ?? 'Anschauen'}</span>
      </div>
    </div>
  </NextLink>
);
