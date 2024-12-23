import { ContactBlockFragment } from '@/graphql/generated';
import Link from 'next/link';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: ContactBlockFragment;
};

export const ContactBlock: FC<Props> = ({ block: { text, employee } }) => {
  const { firstname, email, phone, image, appointmentLink, appointmentAnchorLink, appointmentText } = employee;

  return (
    <BlockWrapper>
      <div className="grid grid-flow-row place-content-center items-center justify-items-center gap-6 px-4 text-center lg:grid-flow-col lg:gap-12 lg:px-14 lg:text-left">
        {image?.responsiveImage && (
          <div className="h-36 w-36 lg:h-52 lg:w-52">
            <DatoSRCImage data={{ ...image.responsiveImage, alt: firstname }} imgClassName="rounded-full" />
          </div>
        )}
        <div>
          <p className="mb-4 whitespace-pre-line text-base font-bold text-wehrli lg:mb-8 lg:text-xl">{text}</p>
          <div className="flex flex-col items-center gap-2 lg:flex-row lg:justify-start lg:gap-4">
            {appointmentLink?.slug && appointmentText && appointmentAnchorLink && (
              <Link
                className="mb-2 border-b-2 border-black text-center font-bold no-underline transition-colors duration-150 hover:border-wehrli hover:text-wehrli"
                href={'/' + appointmentLink.slug + appointmentAnchorLink}
              >
                {appointmentText}
              </Link>
            )}
            <a
              href={`mailto:${email}`}
              className="mb-2 border-b-2 border-black text-center font-bold no-underline transition-colors duration-150 hover:border-wehrli hover:text-wehrli"
            >
              {email}
            </a>
            <a
              href={`tel:${phone}`}
              className="mb-2 border-b-2 border-black text-center font-bold no-underline transition-colors duration-150 hover:border-wehrli hover:text-wehrli"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};
