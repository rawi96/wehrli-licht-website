import { Section, Grid, CONTENT_IMAGE_SIZES, Heading } from '@wehrli/design-system';
import { TeamBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { FC } from 'react';
import { ImageComponent } from '../image';

type Props = {
  block: TeamBlockFragment;
  /** Block is near the top of the page: load the first portrait eagerly (LCP). */
  aboveFold?: boolean;
};

export const TeamBlock: FC<Props> = ({
  block: { teamTitle, employees, disableMarginBottom, disableMarginTop },
  aboveFold = false,
}) => {
  // With a block title the names are its sub headings, otherwise they are the section headings.
  const NameHeading = teamTitle ? 'h3' : 'h2';

  return (
    <Section marginBottom={!disableMarginBottom} marginTop={!disableMarginTop}>
      {teamTitle && <Heading level="2">{teamTitle}</Heading>}
      <Grid cols={3}>
        {employees.map(({ firstname, lastname, bio, image, function: emplFunction }, index) => (
          <div className={classNames('bg-white-100 flex flex-col overflow-hidden rounded-lg')} key={firstname + lastname}>
            <div className="w-full">
              {image?.responsiveImage && (
                <ImageComponent
                  image={{ responsiveImage: image.responsiveImage, title: `${firstname} ${lastname}` }}
                  sizes={CONTENT_IMAGE_SIZES.thirds}
                  priority={aboveFold && index === 0}
                />
              )}
            </div>
            <div className="flex flex-1 flex-col p-8 text-sm font-normal lg:text-sm">
              <p className="mb-6">{emplFunction}</p>
              <NameHeading className="text-wehrli mb-4 text-base font-bold break-words md:text-lg">
                {firstname} {lastname}
              </NameHeading>
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
    </Section>
  );
};
