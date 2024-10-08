import {
  StructuredText as StructuredTextType,
  isHeading,
  isLink,
  isList,
  isListItem,
  isParagraph,
} from 'datocms-structured-text-utils';
import { FC, Fragment } from 'react';
import { StructuredText, renderMarkRule, renderNodeRule } from 'react-datocms';
import { Heading1, Heading2, Heading3, InlineLink, ListItem, OrderedList, Paragraph, Serif, UnorderedList } from './nodes';

type Props = {
  data: StructuredTextType;
};

export const StructuredTextRenderer: FC<Props> = ({ data }) => (
  <StructuredText
    data={data}
    customNodeRules={[
      renderNodeRule(isList, ({ node, children, key }) =>
        node.style === 'numbered' ? (
          <OrderedList key={key}>{children}</OrderedList>
        ) : (
          <UnorderedList key={key}>{children}</UnorderedList>
        ),
      ),
      renderNodeRule(isListItem, ({ children, key }) => <ListItem key={key}>{children}</ListItem>),
      renderNodeRule(isHeading, ({ node, children, key }) => {
        switch (node.level) {
          case 1:
            return <Heading1 key={key}>{children}</Heading1>;
          case 2:
            return <Heading2 key={key}>{children}</Heading2>;
          case 3:
            return <Heading3 key={key}>{children}</Heading3>;
          default:
            return null;
        }
      }),
      renderNodeRule(isLink, ({ node, children, key }) => {
        const target = node.meta?.find((metaItem) => metaItem.id === 'target')?.value;
        const rel = node.meta?.find((metaItem) => metaItem.id === 'rel')?.value;

        return (
          <InlineLink key={key} href={node.url} target={target} rel={rel}>
            {children}
          </InlineLink>
        );
      }),
      renderNodeRule(isParagraph, ({ children, key, ancestors }) => {
        if (ancestors[0].type === 'listItem' || ancestors[0].type === 'list') {
          // we want to get rid of paragraphs inside list items
          return <Fragment key={key}>{children}</Fragment>;
        }

        return <Paragraph key={key}>{children}</Paragraph>;
      }),
    ]}
    customMarkRules={[renderMarkRule('emphasis', ({ children, key }) => <Serif key={key}>{children}</Serif>)]}
  />
);
