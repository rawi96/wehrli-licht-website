import { TeamBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';
import { Grid } from '../grid';
import { Heading3 } from '../nodes';

type Props = {
  block: TeamBlockFragment;
};

export const TeamBlock: FC<Props> = ({ block: { employees, disableMarginBottom, disableMarginTop } }) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <Grid cols={3}>
      {employees.map(({ firstname, lastname, bio, image, function: emplFunction }) => (
        <div className={classNames('flex flex-col overflow-hidden rounded bg-white-100')} key={firstname + lastname}>
          <div className="w-full">
            {image?.responsiveImage && (
              <DatoSRCImage data={{ ...image.responsiveImage }} imgStyle={{ width: '100%', maxWidth: '100%' }} />
            )}
          </div>
          <div className="flex flex-1 flex-col p-8 font-sans text-xxs font-normal lg:text-sm">
            <p className="md:mb-2 lg:mb-6">{emplFunction}</p>
            <Heading3>
              {firstname} {lastname}
            </Heading3>
            <p>{bio}</p>
            <div className="mt-6 flex flex-1 flex-row flex-wrap content-end gap-x-4 gap-y-2">
              {/* {links.map(({ label, url }) => (
                <EmployeeContactLink key={url} href={url}>
                  {label}
                </EmployeeContactLink>
              ))} */}
            </div>
          </div>
        </div>
      ))}
    </Grid>
  </BlockWrapper>
);
