import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from '../container/container';
import { Section } from './section';

const Box = ({ label }: { label: string }) => <div className="bg-wehrli-50 rounded-sm p-6 text-sm text-white">{label}</div>;

const meta: Meta<typeof Section> = {
  title: 'Layout/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A page is a `Container` with `Section`s, one per CMS block. Each section has 96px margin above and below; editors can turn them off per block.',
      },
    },
  },
  render: (args) => (
    <Container>
      <Section {...args}>
        <Box label="Section" />
      </Section>
      <Section>
        <Box label="Next section" />
      </Section>
    </Container>
  ),
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {};

export const WithoutMargins: Story = { args: { marginTop: false, marginBottom: false } };
