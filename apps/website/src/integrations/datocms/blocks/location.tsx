import { CmsHtml } from '@/components/cms-html';
import { LocationBlockFragment } from '@/graphql/generated';
import type { SiteNotice } from '@/domain/content/site-layout';
import { LocationBlock as LocationBlockView } from '@wehrli/design-system';
import { FC } from 'react';
import { getSiteLayout } from '../site-layout';

type Props = {
  block: LocationBlockFragment;
};

const toNotice = (notice: SiteNotice | null) =>
  notice && { title: notice.title, text: <CmsHtml html={notice.html} as="div" /> };

/** Address and opening hours from «Kopf- & Fusszeile», so they are maintained in one place. */
export const LocationBlock: FC<Props> = async ({ block }) => {
  const { contact, openingHours, holidayNotice } = await getSiteLayout();

  return (
    <LocationBlockView
      title={block.locationTitle?.trim() ? block.locationTitle.trim() : 'Öffnungszeiten & Anfahrt'}
      anchorId={block.anchorId?.trim() ? block.anchorId.trim() : null}
      companyName={contact.companyName}
      street={contact.street}
      zip={contact.zip}
      place={contact.place}
      phone={contact.phone}
      email={contact.email}
      mapsHref={contact.mapsHref}
      openingHours={toNotice(openingHours)}
      holiday={toNotice(holidayNotice)}
      mapSrc={block.mapUrl?.trim() ? block.mapUrl.trim() : null}
    />
  );
};
