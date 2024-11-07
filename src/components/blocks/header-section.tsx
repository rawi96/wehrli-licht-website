import { HeaderSectionBlockFragment } from '@/graphql/generated';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: HeaderSectionBlockFragment;
};

export const HeaderSection: FC<Props> = ({ block: { title, description, links, facts, backgroundImage } }) => {
  return (
    <BlockWrapper className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <DatoSRCImage
        data={backgroundImage.responsiveImage}
        imgClassName="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center blur-sm brightness-50"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">{title}</h1>
          <p className="mt-8 text-lg font-medium text-white sm:text-xl/8">{description}</p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            {links.map((link) => (
              <a key={link.text} href={link.url} className="flex items-center hover:text-gray-300">
                {link.text}
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
