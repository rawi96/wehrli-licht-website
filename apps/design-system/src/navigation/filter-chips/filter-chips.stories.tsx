import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FilterChips } from './filter-chips';

const options = [
  { id: 'zuhause', label: 'Zuhause', href: '#zuhause', count: 3 },
  { id: 'gastronomie', label: 'Gastronomie', href: '#gastronomie', count: 2 },
  { id: 'buero', label: 'Büro', href: '#buero', count: 1 },
];

const meta: Meta<typeof FilterChips> = {
  title: 'Navigation/FilterChips',
  component: FilterChips,
  args: { options, all: { label: 'Alle', href: '#' }, label: 'Projekte nach Bereich' },
};

export default meta;
type Story = StoryObj<typeof FilterChips>;

export const All: Story = { args: { value: null } };
export const Active: Story = { args: { value: 'gastronomie' } };
