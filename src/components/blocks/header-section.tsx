import { HeaderSectionBlockFragment } from '@/graphql/generated';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: HeaderSectionBlockFragment;
};

export const HeaderSectionBlock: FC<Props> = ({ block: { title, description, links, facts, backgroundImage } }) => {
  return (
    <BlockWrapper className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <DatoSRCImage
        data={backgroundImage.responsiveImage}
        imgClassName="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center blur-sm brightness-50"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-5xl font-semibold sm:text-7xl tracking-tight text-white">{title}</h1>
          <p className="font-medium mt-8 text-lg text-white sm:text-xl/8">{description}</p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="font-semibold grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            {links.map((link) => (
              <a key={link.id} href={link.link?.slug ?? '#'} className="flex items-center hover:text-gray-300">
                {link.label}
                <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.title} className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 text-white">{fact.text}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">{fact.title}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </BlockWrapper>
  );
};
