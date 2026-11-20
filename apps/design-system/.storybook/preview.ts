import type { Preview } from '@storybook/nextjs-vite';
import './storybook.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      codePanel: true,
      source: { state: 'shown' },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Fundamentals',
          ['Colors', 'Typography', 'Spacing', 'Radii', 'Shadows', 'Breakpoints', 'Motion', 'Icons'],
          'Typography',
          'Actions',
          'Forms',
          'Navigation',
          'Content',
          'Layout',
          'Blocks',
          'Shop',
        ],
      },
    },
  },
};

export default preview;
