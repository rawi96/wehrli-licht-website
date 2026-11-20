import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CATEGORIES } from '../shop.mocks';
import { StorefrontHero } from './storefront-hero';

const meta: Meta<typeof StorefrontHero> = {
  title: 'Shop/StorefrontHero',
  component: StorefrontHero,
  parameters: { layout: 'fullscreen' },
  args: {
    headingId: 'hero-heading',
    eyebrow: 'Online-Shop',
    title: 'Leuchten für jeden Raum',
    intro: <p>Ausgewählte Leuchten, persönlich beraten und schnell geliefert.</p>,
    primaryCta: { href: '#', label: 'Alle Leuchten' },
    secondaryCta: { href: '#', label: 'Beratung buchen' },
    categories: MOCK_CATEGORIES.slice(0, 3),
    allProductsLink: { href: '#', label: 'Alle Leuchten' },
  },
};

export default meta;
type Story = StoryObj<typeof StorefrontHero>;

export const Default: Story = {};

export const OneCategory: Story = { args: { categories: MOCK_CATEGORIES.slice(0, 1) } };

export const CategoryWithoutImage: Story = { args: { categories: MOCK_CATEGORIES.slice(2, 4) } };

export const WithoutCategories: Story = { args: { categories: [], secondaryCta: null } };
