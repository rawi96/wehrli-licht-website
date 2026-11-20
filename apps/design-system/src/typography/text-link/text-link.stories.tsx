import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Paragraph } from '../rich-text/rich-text';
import { CtaLink, TextLink } from './text-link';

const meta: Meta<typeof TextLink> = {
  title: 'Typography/TextLink',
  component: TextLink,
  parameters: {
    docs: {
      description: {
        component:
          '`TextLink` is a link inside running text (rich text links). `CtaLink` stands on its own, e.g. a link block in rich text. Both use next/link.',
      },
    },
  },
  args: { href: '#', children: 'Lichtberatung' },
};

export default meta;
type Story = StoryObj<typeof TextLink>;

export const InText: Story = {
  render: (args) => (
    <Paragraph>
      Wir begleiten Sie von der ersten Idee bis zur Montage. Mehr dazu in der <TextLink {...args} />.
    </Paragraph>
  ),
};

export const NewTab: Story = { args: { newTab: true, children: 'Externe Seite' } };

export const Cta: StoryObj<typeof CtaLink> = {
  render: () => (
    <>
      <CtaLink href="#">Termin vereinbaren</CtaLink>
      <CtaLink href="#">Alle Projekte</CtaLink>
    </>
  ),
};
