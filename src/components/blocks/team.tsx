import { TeamBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { SRCImage as DatoSRCImage } from 'react-datocms';

type Props = {
  block: TeamBlockFragment;
};

export const TeamBlock: FC<Props> = ({ block: { employees } }) => (
  <BlockWrapper className="first-of-type:text-base lg:first-of-type:text-lg">
    <ul
      role="list"
      className="mx-auto my-20 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-8 xl:max-w-none"
    >
      {employees.map((employee) => (
        <li key={employee.firstname} className="flex flex-col gap-6 xl:flex-row">
          <DatoSRCImage
            data={employee.image.responsiveImage}
            imgStyle={{
              width: '13rem',
              aspectRatio: '4 / 5',
              borderRadius: '0.5rem',
              objectFit: 'cover',
            }}
          />
          <div className="flex-auto">
            <h3 className="text-lg font-semibold leading-8 tracking-tight">
              {employee.firstname} {employee.lastname}
            </h3>
            <p className="text-base leading-7">{employee.function}</p>
            <p className="mt-6 text-base leading-7">{employee.bio}</p>
          </div>
        </li>
      ))}
    </ul>
  </BlockWrapper>
);
