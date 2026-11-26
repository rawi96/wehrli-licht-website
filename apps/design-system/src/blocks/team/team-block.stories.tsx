import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_AVATAR } from '../blocks.mocks';
import { inContainer } from '../block-decorator';
import { TeamBlock } from './team-block';

const members = ['Alex Muster', 'Kim Beispiel', 'Robin Test', 'Sascha Muster'].map((name, index) => ({
  id: `member-${index}`,
  name,
  role: ['Lichtplanerin', 'Elektriker', 'Beratung', 'Montage'][index],
  bio: 'Plant Licht für Wohnungen, Büros und Läden und begleitet Projekte bis zur Montage.',
  image: MOCK_AVATAR,
}));

const meta: Meta<typeof TeamBlock> = {
  title: 'Blocks/Team',
  component: TeamBlock,
  args: { title: 'Unser Team', members },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof TeamBlock>;

export const Default: Story = {};

export const WithoutTitle: Story = { args: { title: undefined } };

export const OneMember: Story = { args: { members: members.slice(0, 1) } };

export const WithoutImages: Story = { args: { members: members.map((member) => ({ ...member, image: undefined })) } };

export const ThreeMembers: Story = { args: { members: members.slice(0, 3) } };

export const SixMembers: Story = {
  args: {
    members: [...members, ...members.slice(0, 2)].map((member, index) => ({
      ...member,
      id: `member-${index}`,
      name: `${member.name} ${index + 1}`,
    })),
  },
};
