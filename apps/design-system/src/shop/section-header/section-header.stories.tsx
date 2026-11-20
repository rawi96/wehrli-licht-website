import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShopSectionHeader } from './section-header';

const meta: Meta<typeof ShopSectionHeader> = {
  title: 'Shop/SectionHeader',
  component: ShopSectionHeader,
  args: {
    headingId: 'section-heading',
    title: 'Unsere Kategorien',
    description: <p className="text-gray-600">Von der Pendelleuchte bis zur Tischleuchte.</p>,
    action: { href: '#', label: 'Alle Leuchten' },
  },
};

export default meta;
type Story = StoryObj<typeof ShopSectionHeader>;

export const Default: Story = {};

export const WithoutAction: Story = { args: { action: null } };

export const Inverted: Story = {
  args: { inverted: true, description: <p>Ausgewählte Leuchten aus unserem Sortiment.</p> },
  decorators: [
    (Story) => (
      <div className="bg-wehrli p-6">
        <Story />
      </div>
    ),
  ],
};
