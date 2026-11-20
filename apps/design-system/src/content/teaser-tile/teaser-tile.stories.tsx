import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_LANDSCAPE } from '../../docs/placeholders';
import { TeaserTile } from './teaser-tile';

const meta: Meta<typeof TeaserTile> = {
  title: 'Content/TeaserTile',
  component: TeaserTile,
  args: {
    title: 'Licht im Treppenhaus',
    eyebrow: 'Projekt',
    linkLabel: 'Anschauen',
    href: '#',
    image: PLACEHOLDER_LANDSCAPE,
  },
  decorators: [
    (Story) => (
      <div className="flex">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TeaserTile>;

export const Default: Story = {};

export const LongTitle: Story = { args: { title: 'Ein langer Titel, der über mehrere Zeilen umbricht' } };

export const WithoutImage: Story = { args: { image: undefined, eyebrow: undefined } };
