import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_LANDSCAPE } from '../../docs/placeholders';
import { inContainer } from '../block-decorator';
import { TeaserGridBlock } from './teaser-grid-block';

const teasers = ['Wohnen', 'Arbeiten', 'Gastronomie', 'Aussenräume'].map((title, index) => ({
  id: String(index),
  title,
  eyebrow: 'Projekte',
  description: 'Wie gutes Licht einen Raum verändert.',
  href: '#',
  linkLabel: 'Anschauen',
  image: PLACEHOLDER_LANDSCAPE,
}));

const meta: Meta<typeof TeaserGridBlock> = {
  title: 'Blocks/TeaserGrid',
  component: TeaserGridBlock,
  args: { teasers: teasers.slice(0, 3) },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof TeaserGridBlock>;

export const ThreeTeasers: Story = {};

export const TwoTeasers: Story = { args: { teasers: teasers.slice(0, 2) } };

export const OneTeaser: Story = { args: { teasers: teasers.slice(0, 1) } };

export const ManyTeasers: Story = { args: { teasers } };
