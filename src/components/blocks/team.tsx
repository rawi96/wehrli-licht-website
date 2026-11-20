import { TeamBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';
import { Grid } from '../grid';

type Props = {
  block: TeamBlockFragment;
  /** Block is near the top of the page: load the first portrait eagerly (LCP). */
  aboveFold?: boolean;
};

/** Grid: 1 column, 2 from md, 3 from lg (inside the max-w-7xl content). */
const PORTRAIT_SIZES = '(min-width: 1400px) 400px, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw';

export const TeamBlock: FC<Props> = ({ block: { employees, disableMarginBottom, disableMarginTop }, aboveFold = false }) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <Grid cols={3}>
      {employees.map(({ firstname, lastname, bio, image, function: emplFunction }, index) => (
        <div className={classNames('bg-white-100 flex flex-col overflow-hidden rounded')} key={firstname + lastname}>
          <div className="w-full">
            {image?.responsiveImage && (
              <DatoSRCImage
                data={{ ...image.responsiveImage }}
                sizes={PORTRAIT_SIZES}
                priority={aboveFold && index === 0}
                imgStyle={{ width: '100%', maxWidth: '100%' }}
              />
            )}
          </div>
          <div className="flex flex-1 flex-col p-8 text-sm font-normal lg:text-sm">
            <p className="mb-6">{emplFunction}</p>
            {/* h2: the team block usually follows the page h1 directly (no skipped heading level). */}
            <h2 className="lg:text-l text-wehrli mb-4 text-base font-bold break-words md:text-lg">
              {firstname} {lastname}
            </h2>
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
