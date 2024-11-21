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
    className={classNames(
      'group grid w-full grid-rows-[auto,1fr,auto] overflow-hidden rounded bg-white-100 text-black transition-transform active:scale-[.99]',
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
    <div className="grid grid-rows-[auto,1fr,auto] p-5 font-sans text-xxs font-normal md:p-6 lg:p-8 lg:text-sm">
      {eyebrow && <p>{eyebrow}</p>}
      <div>
        <h3 className="my-4 font-sans text-sm font-bold text-wehrli peer-[p&]:mt-6 md:text-base lg:text-lg lg:peer-[p&]:mt-8">
          {title}
        </h3>
        {description && <p className="mb-2 lg:mb-4">{description}</p>}
      </div>
      <div>
        <span className="border-b-2 border-black">{linkLabel ? linkLabel : 'Anschauen'}</span>
      </div>
    </div>
  </NextLink>
);
