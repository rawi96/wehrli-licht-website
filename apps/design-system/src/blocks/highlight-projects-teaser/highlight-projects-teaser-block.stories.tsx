import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../blocks.mocks';
import { inContainerFullWidth } from '../block-decorator';
import { HighlightProjectsTeaserBlock } from './highlight-projects-teaser-block';

const projects = MOCK_IMAGES.slice(0, 4).map((image, index) => ({
  id: String(index),
  offer: 'Lichtplanung',
  title: ['Ein Büro mit ruhigem Licht', 'Wohnen am See', 'Ein Laden im Altbau', 'Licht für die Praxis'][index],
  company: 'Muster AG',
  description: 'Blendfreie Arbeitsplätze und warmes Licht in der Lounge.',
  href: '#',
  image,
}));

const meta: Meta<typeof HighlightProjectsTeaserBlock> = {
  title: 'Blocks/HighlightProjectsTeaser',
  component: HighlightProjectsTeaserBlock,
  args: {
    id: 'projekte',
    title: 'Ausgewählte Projekte',
    subline: 'Licht für Wohnungen, Büros und Läden: ein Einblick in unsere Arbeit.',
    cta: { label: 'Alle Projekte', href: '#' },
    projects,
  },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainerFullWidth],
};

export default meta;
type Story = StoryObj<typeof HighlightProjectsTeaserBlock>;

export const Default: Story = {};

export const OneProject: Story = { args: { projects: projects.slice(0, 1) } };

export const TwoProjects: Story = { args: { projects: projects.slice(0, 2) } };

export const WithoutImages: Story = { args: { projects: projects.map((project) => ({ ...project, image: undefined })) } };
