import { StructuredTextRenderer } from '@/integrations/datocms/blocks/structured-text';
import { ShopServiceSectionFragment } from '@/graphql/generated';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { toLink } from '@/integrations/datocms/links';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import { ShopServiceSection } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: ShopServiceSectionFragment;
};

export const ShopServiceSectionBlock: FC<Props> = ({ block }) => {
  const intro = toStructuredTextValue(block.intro);

  return (
    <ShopServiceSection
      headingId={shopSectionHeadingId('shop-service', block.id)}
      title={block.title}
      intro={intro && <StructuredTextRenderer data={intro} />}
      actionLink={toLink(block.offersLink)}
      items={block.items.map((item) => ({
        id: item.id,
        icon: item.icon,
        title: item.title,
        description: item.description,
        link: item.link ? toLink(item.link) : null,
      }))}
    />
  );
};
