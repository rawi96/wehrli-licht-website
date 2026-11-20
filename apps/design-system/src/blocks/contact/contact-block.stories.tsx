import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_AVATAR } from '../blocks.mocks';
import { inContainer } from '../block-decorator';
import { ContactBlock } from './contact-block';

const meta: Meta<typeof ContactBlock> = {
  title: 'Blocks/Contact',
  component: ContactBlock,
  args: {
    text: 'Haben Sie Fragen?\nIch berate Sie gerne.',
    image: { ...MOCK_AVATAR, alt: 'Alex' },
    email: 'hallo@example.com',
    phone: '+41 00 000 00 00',
    appointment: { label: 'Termin vereinbaren', href: '#' },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof ContactBlock>;

export const Default: Story = {};

export const WithoutAppointment: Story = { args: { appointment: undefined } };

export const WithoutImage: Story = { args: { image: undefined } };
