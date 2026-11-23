import { LampshadeConfigurator } from '@/components/lampshade-configurator/configurator';
import { LampshadeConfiguratorBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { toImage } from '../image';
import { getSiteLayout } from '../site-layout';

type Props = {
  block: LampshadeConfiguratorBlockFragment;
};

/** The invitation to the 3D lampshade configurator (texts from the CMS); inquiries go to the contact form of the contact page. */
export const LampshadeConfiguratorBlock: FC<Props> = async ({ block }) => {
  const { contactPath } = await getSiteLayout();
  // Empty CMS fields mean «leave out».
  const optional = (value: string | null) => {
    const trimmed = value?.trim() ?? '';

    return trimmed.length > 0 ? trimmed : undefined;
  };

  return (
    <section id={optional(block.anchorId)} className="scroll-mt-24">
      <LampshadeConfigurator
        contactPath={contactPath}
        teaser={{
          eyebrow: optional(block.teaserEyebrow),
          title: block.teaserTitle,
          text: optional(block.teaserText),
          points: (block.teaserPoints ?? '')
            .split('\n')
            .map((point) => point.trim())
            .filter(Boolean),
          startLabel: block.startLabel,
          note: optional(block.teaserNote),
          image: toImage(block.teaserImage) ?? null,
        }}
      />
    </section>
  );
};
