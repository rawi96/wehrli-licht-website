import { ContactBlockFragment } from '@/graphql/generated';
import { toImage } from '@/utils/image';
import { generatePathForRecord } from '@/utils/pathnames';
import { ContactBlock as ContactBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: ContactBlockFragment;
};

export const ContactBlock: FC<Props> = ({ block: { text, employee } }) => {
  const { firstname, email, phone, image, appointmentLink, appointmentAnchorLink, appointmentText } = employee;
  const portrait = toImage({ responsiveImage: image?.responsiveImage });

  return (
    <ContactBlockView
      text={text}
      image={portrait && { ...portrait, alt: firstname }}
      email={email}
      phone={phone}
      appointment={
        appointmentLink?.slug && appointmentText && appointmentAnchorLink
          ? {
              label: appointmentText,
              href:
                generatePathForRecord({
                  slug: appointmentLink.slug,
                  type: 'PageRecord',
                  parent: appointmentLink.parent,
                }) + appointmentAnchorLink,
            }
          : null
      }
    />
  );
};
