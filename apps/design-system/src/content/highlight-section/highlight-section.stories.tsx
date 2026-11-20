import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HighlightSection } from './highlight-section';

const meta: Meta<typeof HighlightSection> = {
  title: 'Content/HighlightSection',
  component: HighlightSection,
  args: {
    id: 'beispiel',
    title: 'Ausgewählte Projekte',
    subline: 'Licht für Wohnungen, Büros und Läden: ein Einblick in unsere Arbeit.',
    cta: { label: 'Alle Projekte', href: '#' },
    children: <div className="bg-white-100 rounded-lg p-8 text-sm">Inhalt (Karten)</div>,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-width band of the highlight teaser blocks: it breaks out of the content column to 100vw and centers its content in the page width.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-11/12 max-w-7xl overflow-x-clip">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HighlightSection>;

export const Default: Story = {};

export const Bordered: Story = { args: { bordered: true } };
