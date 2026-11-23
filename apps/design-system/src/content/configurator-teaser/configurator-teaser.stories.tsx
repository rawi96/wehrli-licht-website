import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ConfiguratorTeaser } from './configurator-teaser';

const meta: Meta<typeof ConfiguratorTeaser> = {
  title: 'Content/ConfiguratorTeaser',
  component: ConfiguratorTeaser,
  parameters: { layout: 'padded' },
  args: {
    eyebrow: 'Konfigurator',
    title: 'Gestalten Sie Ihr eigenes Produkt',
    text: 'Eine kurze Einladung, die erklärt, was man hier ausprobieren kann.',
    features: ['In wenigen einfachen Schritten', 'Sofort in 3D sehen', 'Unverbindlich anfragen'],
    action: { label: 'Jetzt starten', onClick: () => undefined },
    note: 'Dauert etwa 3 Minuten',
  },
};

export default meta;
type Story = StoryObj<typeof ConfiguratorTeaser>;

export const Default: Story = {};

export const AsLink: Story = { args: { action: { label: 'Zum Konfigurator', href: '#' } } };
