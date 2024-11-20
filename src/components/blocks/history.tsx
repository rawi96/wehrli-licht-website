import { HistoryBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: HistoryBlockFragment;
};

export const HistoryBlock: FC<Props> = ({ block: { historySections } }) => (
  <BlockWrapper className="first-of-type:text-base lg:first-of-type:text-lg">
    <div className="mx-auto my-20 grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
      {historySections.map((item) => (
        <div key={item.title}>
          <time dateTime={item.year} className="flex items-center font-bold leading-6 text-wehrli">
            <svg viewBox="0 0 4 4" className="mr-4 h-1 w-1 flex-none" aria-hidden="true">
              <circle cx={2} cy={2} r={2} fill="currentColor" />
            </svg>
            {item.year}
            <div
              className="bg-gray-900/10 absolute -ml-2 h-px w-screen -translate-x-full sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              aria-hidden="true"
            />
          </time>
          <DatoSRCImage
            data={item.image.responsiveImage}
            imgStyle={{
              width: '13rem',
              aspectRatio: '4 / 5',
              objectFit: 'cover',
              borderRadius: '0.5rem',
              marginTop: '1.25rem',
            }}
          />
          <h3 className="mt-6 text-lg font-bold leading-8 tracking-tight">{item.title}</h3>
          <p className="mt-1 text-base leading-7">{item.text}</p>
        </div>
      ))}
    </div>
  </BlockWrapper>
);
