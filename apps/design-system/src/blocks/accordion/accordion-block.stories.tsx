import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { AccordionBlock } from './accordion-block';

const meta: Meta<typeof AccordionBlock> = {
  title: 'Blocks/Accordion',
  component: AccordionBlock,
  decorators: [inContainer],
  args: {
    title: 'Gut zu wissen',
    intro: 'Tippen Sie auf ein Thema, um es zu öffnen.',
    openFirst: true,
    items: ['Erstes Thema', 'Zweites Thema', 'Drittes Thema'].map((title, index) => ({
      id: String(index),
      title,
      content: <p>Ein Absatz mit den Einzelheiten zu diesem Thema.</p>,
    })),
  },
};

export default meta;
type Story = StoryObj<typeof AccordionBlock>;

export const Default: Story = {};

export const AllClosed: Story = { args: { openFirst: false, title: null, intro: null } };
