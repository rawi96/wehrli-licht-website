import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../blocks.mocks';
import { inContainerFullWidth } from '../block-decorator';
import { HighlightShopTeaserBlock } from './highlight-shop-teaser-block';

const featuredCategories = ['Pendelleuchten', 'Stehleuchten', 'Wandleuchten'].map((name, index) => ({
  id: name,
  name,
  href: '#',
  image: MOCK_IMAGES[index],
}));

const moreCategories = ['Deckenleuchten', 'Tischleuchten', 'Aussenleuchten', 'Leuchtmittel', 'Zubehör'].map((name) => ({
  id: name,
  name,
  href: '#',
}));

const meta: Meta<typeof HighlightShopTeaserBlock> = {
  title: 'Blocks/HighlightShopTeaser',
  component: HighlightShopTeaserBlock,
  args: {
    id: 'shop',
    eyebrow: 'Shop',
    title: 'Leuchten für jeden Raum',
    subline: 'Ausgewählte Leuchten, persönlich beraten und schnell geliefert.',
    primaryCta: { label: 'Zum Shop', href: '#' },
    secondaryCta: { label: 'Alle Kategorien', href: '#' },
    featuredCategories,
    moreCategories,
  },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainerFullWidth],
};

export default meta;
type Story = StoryObj<typeof HighlightShopTeaserBlock>;

export const Default: Story = {};

export const OneCategory: Story = { args: { featuredCategories: featuredCategories.slice(0, 1), moreCategories: [] } };

export const WithoutFeaturedCategories: Story = { args: { featuredCategories: [] } };

export const CategoryWithoutImage: Story = {
  args: { featuredCategories: featuredCategories.map((category) => ({ ...category, image: undefined })) },
};
