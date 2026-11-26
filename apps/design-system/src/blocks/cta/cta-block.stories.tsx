import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { CtaBlock } from './cta-block';

const meta: Meta<typeof CtaBlock> = {
  title: 'Blocks/Cta',
  component: CtaBlock,
  decorators: [inContainer],
  args: {
    title: 'Bereit für den nächsten Schritt?',
    text: 'Ein kurzer Satz, der zum Handeln einlädt.',
    primary: { label: 'Termin vereinbaren', href: '#' },
    secondary: { label: 'Mehr erfahren', href: '#' },
  },
};

export default meta;
type Story = StoryObj<typeof CtaBlock>;

export const TwoButtons: Story = {};

export const OneButton: Story = { args: { secondary: null } };
