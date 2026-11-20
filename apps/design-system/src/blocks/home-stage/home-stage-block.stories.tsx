import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../blocks.mocks';
import { HomeStageBlock } from './home-stage-block';

const slides = MOCK_IMAGES.slice(0, 3).map((image, index) => ({ id: String(index), src: image.src }));

const meta: Meta<typeof HomeStageBlock> = {
  title: 'Blocks/HomeStage',
  component: HomeStageBlock,
  args: {
    title: 'Licht, das Räume verändert',
    intro: 'Lichtplanung, Leuchten und Montage aus einer Hand.',
    ctas: [
      { label: 'Beratung anfragen', href: '#' },
      { label: 'Projekte ansehen', href: '#' },
    ],
    slides,
    header: <div className="h-20 px-6 py-6 text-sm text-white">Header</div>,
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof HomeStageBlock>;

export const Slideshow: Story = {};

export const SingleImage: Story = { args: { slides: slides.slice(0, 1) } };

export const WithoutImage: Story = { args: { slides: [] } };

export const OneCta: Story = { args: { ctas: [{ label: 'Beratung anfragen', href: '#' }], intro: undefined } };

export const LongTitle: Story = {
  args: { title: 'Gutes Licht für Wohnungen, Büros, Läden und alles dazwischen', slides: slides.slice(0, 1) },
};
