import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotFound } from './not-found';

const meta: Meta<typeof NotFound> = {
  title: 'Layout/NotFound',
  component: NotFound,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};

export const Product: Story = {
  args: { title: 'Produkt nicht gefunden', text: 'Dieses Produkt ist nicht mehr erhältlich.' },
};
