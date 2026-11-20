import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_AVATAR } from '../../blocks/blocks.mocks';
import { TeamMemberCard } from './team-member-card';

const meta: Meta<typeof TeamMemberCard> = {
  title: 'Content/TeamMemberCard',
  component: TeamMemberCard,
  args: {
    name: 'Alex Muster',
    role: 'Lichtplanerin',
    bio: 'Plant Licht für Wohnungen, Büros und Läden und begleitet Projekte bis zur Montage.',
    image: MOCK_AVATAR,
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TeamMemberCard>;

export const Default: Story = {};

export const WithoutImage: Story = { args: { image: undefined } };

export const OnlyName: Story = { args: { image: undefined, role: undefined, bio: undefined } };
