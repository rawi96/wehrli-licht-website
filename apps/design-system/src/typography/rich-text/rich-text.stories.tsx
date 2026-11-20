import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading } from '../heading/heading';
import { CtaLink, TextLink } from '../text-link/text-link';
import {
  Blockquote,
  Emphasis,
  InlineCode,
  ListItem,
  OrderedList,
  Paragraph,
  RichText,
  Strong,
  ThematicBreak,
  UnorderedList,
} from './rich-text';

const meta: Meta = {
  title: 'Typography/RichText',
  parameters: {
    docs: {
      description: {
        component:
          'The parts of a rich text field. The website renders DatoCMS structured text with them, one component per node type, so any content an editor writes is styled.',
      },
    },
  },
};

export default meta;

export const AllNodes: StoryObj = {
  render: () => (
    <RichText>
      <Heading level="2">Gutes Licht</Heading>
      <Paragraph>
        Licht prägt, wie wir <Strong>Räume</Strong> erleben. Mit der <Emphasis>richtigen Planung</Emphasis> wirken Farben und
        Materialien natürlich. Mehr dazu in der <TextLink href="#">Lichtberatung</TextLink>.
      </Paragraph>
      <Heading level="3">Darauf achten wir</Heading>
      <UnorderedList>
        <ListItem>Blendfreie Leuchten am Arbeitsplatz</ListItem>
        <ListItem>Warmes Licht im Wohnbereich</ListItem>
      </UnorderedList>
      <OrderedList>
        <ListItem>Beratung</ListItem>
        <ListItem>Planung</ListItem>
        <ListItem>Umsetzung</ListItem>
      </OrderedList>
      <Blockquote attribution="Eine Kundin">
        <Paragraph>Endlich fühlt sich unser Wohnzimmer am Abend gemütlich an.</Paragraph>
      </Blockquote>
      <Paragraph>
        Technische Angabe: <InlineCode>2700 K</InlineCode>
      </Paragraph>
      <ThematicBreak />
      <CtaLink href="#">Termin vereinbaren</CtaLink>
    </RichText>
  ),
};
