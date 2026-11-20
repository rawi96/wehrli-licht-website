import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_LANDSCAPE } from '../../docs/placeholders';
import { Grid, gridImageSizes } from '../../layout/grid/grid';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'Content/Card',
  component: Card,
  args: {
    title: 'Neues Licht im Treppenhaus',
    eyebrow: 'Projekt',
    description: 'Wie eine Treppe mit indirektem Licht sicher und wohnlich wird.',
    href: '#',
    linkLabel: 'Anschauen',
    image: PLACEHOLDER_LANDSCAPE,
    imageSizes: gridImageSizes(3),
  },
  decorators: [
    (Story) => (
      <div className="bg-white-200 max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const WithoutImage: Story = { args: { image: undefined, eyebrow: undefined } };

export const InGrid: Story = {
  decorators: [(Story) => <Story />],
  render: (args) => (
    <Grid cols={3}>
      <Card {...args} />
      <Card {...args} title="Ein kurzer Titel" description={undefined} />
      <Card {...args} title="Ein sehr langer Titel, der über mehrere Zeilen umbricht und trotzdem gut aussieht" />
    </Grid>
  ),
};
