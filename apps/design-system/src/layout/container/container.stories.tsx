import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from './container';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The content column of every page: 11/12 of the viewport, at most 1280px (`max-w-7xl`), with 96px (144px from md) above and below. Sections stack inside it.',
      },
    },
  },
  args: {
    children: <div className="bg-wehrli-50 rounded-md p-6 text-sm text-white">Seiteninhalt</div>,
  },
};

export default meta;

export const Default: StoryObj<typeof Container> = {};
