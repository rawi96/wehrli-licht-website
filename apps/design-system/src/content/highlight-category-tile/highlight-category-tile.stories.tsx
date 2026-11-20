import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_PORTRAIT } from '../../docs/placeholders';
import { HighlightCategoryTile } from './highlight-category-tile';

const meta: Meta<typeof HighlightCategoryTile> = {
  title: 'Content/HighlightCategoryTile',
  component: HighlightCategoryTile,
  args: { name: 'Pendelleuchten', href: '#', image: PLACEHOLDER_PORTRAIT, size: 'small' },
  decorators: [
    (Story) => (
      <div className="bg-wehrli w-72 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HighlightCategoryTile>;

export const Small: Story = {};

export const Large: Story = {
  args: { size: 'large' },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export const WithoutImage: Story = { args: { image: undefined } };
