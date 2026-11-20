import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Kontakt aufnehmen', href: '#' },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };

export const Secondary: Story = { args: { variant: 'secondary', children: 'Mehr erfahren' } };

export const OnDark: Story = {
  render: () => (
    <div className="bg-wehrli flex flex-wrap gap-4 p-6">
      <Button variant="primary-white" href="#">
        Primary white
      </Button>
      <Button variant="secondary-white" href="#">
        Secondary white
      </Button>
    </div>
  ),
};

export const Loading: Story = { args: { variant: 'primary', href: undefined, loading: true, children: 'Wird gesendet' } };

export const Disabled: Story = { args: { variant: 'primary', href: undefined, disabled: true } };

export const FullWidth: Story = { args: { variant: 'primary', fullWidth: true } };
