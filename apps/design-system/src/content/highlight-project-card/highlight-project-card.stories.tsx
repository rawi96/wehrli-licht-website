import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_LANDSCAPE } from '../../docs/placeholders';
import { HighlightProjectCard } from './highlight-project-card';

const meta: Meta<typeof HighlightProjectCard> = {
  title: 'Content/HighlightProjectCard',
  component: HighlightProjectCard,
  args: {
    variant: 'featured',
    offer: 'Lichtplanung',
    title: 'Ein Büro mit ruhigem Licht',
    company: 'Muster AG',
    description: 'Blendfreie Arbeitsplätze und warmes Licht in der Lounge.',
    href: '#',
    image: PLACEHOLDER_LANDSCAPE,
  },
};

export default meta;
type Story = StoryObj<typeof HighlightProjectCard>;

export const Featured: Story = {};

export const Compact: Story = {
  args: { variant: 'compact' },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const WithoutImage: Story = { args: { image: undefined, company: undefined } };
