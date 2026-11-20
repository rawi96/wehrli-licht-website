import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CatalogHeader } from './catalog-header';

const meta: Meta<typeof CatalogHeader> = {
  title: 'Shop/CatalogHeader',
  component: CatalogHeader,
  args: { title: 'Alle Leuchten', description: 'Unser ganzes Sortiment, von der Pendel- bis zur Tischleuchte.' },
};

export default meta;
type Story = StoryObj<typeof CatalogHeader>;

export const Default: Story = {};

export const WithHtmlDescription: Story = {
  args: { title: 'Pendelleuchten', description: 'Licht über dem Esstisch und in der Küche.' },
};

export const TitleOnly: Story = { args: { description: undefined } };
