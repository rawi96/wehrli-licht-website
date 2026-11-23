import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { mockLogo } from '../blocks.mocks';
import { PartnersBlock } from './partners-block';

const meta: Meta<typeof PartnersBlock> = {
  title: 'Blocks/Partners',
  component: PartnersBlock,
  decorators: [inContainer],
  args: {
    title: 'Unsere Partner',
    intro: 'Hersteller, mit denen wir zusammenarbeiten.',
    partners: ['Muster Licht', 'Beispiel Leuchten', 'Licht & Form', 'Demo Design'].map((name, index) => {
      const logo = mockLogo(name);

      return {
        id: String(index),
        name,
        logo: { src: logo.src, width: logo.width, height: logo.height },
        place: index % 2 ? 'Musterstadt, Schweiz' : 'Beispielort, Italien',
        description: 'Ein, zwei Sätze dazu, wofür die Marke steht.',
        website: 'https://example.com',
      };
    }),
  },
};

export default meta;
type Story = StoryObj<typeof PartnersBlock>;

export const Default: Story = {};
