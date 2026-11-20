import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TokenTable } from '../token-table';

const BREAKPOINTS = [
  { token: 'sm', usage: 'Large phones in landscape, two columns' },
  { token: 'md', usage: 'Tablets' },
  { token: 'lg', usage: 'Desktop: full navigation, multi-column blocks' },
  { token: 'xl', usage: 'Wide desktop' },
  { token: '2xl', usage: 'Very wide screens' },
];

const meta: Meta = {
  title: 'Fundamentals/Breakpoints',
  parameters: {
    docs: {
      description: {
        component: 'Mobile first: unprefixed classes apply to all widths, `sm:` to `2xl:` from the breakpoint up.',
      },
    },
  },
};

export default meta;

export const Breakpoints: StoryObj = {
  render: () => (
    <TokenTable
      variablePrefix="--breakpoint-"
      rows={BREAKPOINTS.map(({ token, usage }) => ({ token, className: `${token}:`, preview: <span>{usage}</span> }))}
    />
  ),
};
