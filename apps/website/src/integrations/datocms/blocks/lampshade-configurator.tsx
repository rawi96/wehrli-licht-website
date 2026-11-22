import { LampshadeConfigurator } from '@/components/lampshade-configurator/configurator';
import { LampshadeConfiguratorBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { getSiteLayout } from '../site-layout';

type Props = {
  block: LampshadeConfiguratorBlockFragment;
};

/** The 3D lampshade configurator; inquiries go to the contact form of the contact page. */
export const LampshadeConfiguratorBlock: FC<Props> = async ({ block }) => {
  const { contactPath } = await getSiteLayout();

  return (
    <section id={block.anchorId?.trim() ? block.anchorId.trim() : undefined} className="scroll-mt-24">
      <LampshadeConfigurator contactPath={contactPath} />
    </section>
  );
};
