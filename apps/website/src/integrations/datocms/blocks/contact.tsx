import { ContactBlockFragment } from '@/graphql/generated';
import { toImage } from '../image';
import { generatePathForRecord } from '../paths';
import { ContactBlock as ContactBlockView } from '@wehrli/design-system';
import { ComponentProps, FC } from 'react';

type Props = {
  block: ContactBlockFragment;
};

const toContact = ({ text, employee }: ContactBlockFragment): ComponentProps<typeof ContactBlockView> => {
  const { firstname, email, phone, image, appointmentLink, appointmentAnchorLink, appointmentText } = employee;
  const portrait = toImage({ responsiveImage: image?.responsiveImage });

  return {
    text,
    image: portrait && { ...portrait, alt: firstname },
    email,
    phone,
    appointment:
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
        : null,
  };
};

export const ContactBlock: FC<Props> = ({ block }) => {
  return <ContactBlockView {...toContact(block)} />;
};
