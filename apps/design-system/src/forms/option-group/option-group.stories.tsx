import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OptionGroup } from './option-group';

const meta: Meta<typeof OptionGroup> = {
  title: 'Forms/OptionGroup',
  component: OptionGroup,
  args: { title: 'Material', children: <p className="text-sm">Steuerelemente</p> },
};

export default meta;
type Story = StoryObj<typeof OptionGroup>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'Natürlich und leicht strukturiert.' } };

export const Fits: Story = { args: { hint: 'Die Proportionen passen gut.', hintTone: 'ok' } };

export const Tip: Story = { args: { hint: 'Tipp: Etwas breiter wirkt ruhiger.', hintTone: 'tip' } };
