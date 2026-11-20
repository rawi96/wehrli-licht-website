import { ImageBlockFragment, LinkRecord } from '@/graphql/generated';
import { LinkableRecords, PageRecord, generatePathForRecord } from '@/utils/pathnames';
import {
  StructuredText as StructuredTextType,
  isBlockquote,
  isHeading,
  isLink,
  isList,
  isListItem,
  isParagraph,
  isThematicBreak,
} from 'datocms-structured-text-utils';
import { FC, Fragment } from 'react';
import { StructuredText, renderMarkRule, renderNodeRule } from 'react-datocms';
import { ImageBlock } from './blocks/image';
import {
  Blockquote,
  CtaLink,
  Emphasis,
  Heading,
  InlineCode,
  ListItem,
  OrderedList,
  Paragraph,
  RichText,
  RichTextEmbed,
  Strong,
  TextLink,
  ThematicBreak,
  UnorderedList,
} from '@wehrli/design-system';

type Props = {
  data: StructuredTextType | null | undefined;
};

// Maps DatoCMS structured text onto the design system's rich text components (Storybook: Typography/RichText).
export const StructuredTextRenderer: FC<Props> = ({ data }) => (
  <RichText>
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
          return (
            <Heading level={node.level.toString() as '1' | '2' | '3'} key={key}>
              {children}
            </Heading>
          );
        }),
        renderNodeRule(isLink, ({ node, children, key }) => {
          const target = node.meta?.find((metaItem) => metaItem.id === 'target')?.value;
          const rel = node.meta?.find((metaItem) => metaItem.id === 'rel')?.value;

          return (
            <TextLink key={key} href={node.url} newTab={target === '_blank'} rel={rel}>
              {children}
            </TextLink>
          );
        }),
        renderNodeRule(isParagraph, ({ children, key, ancestors }) => {
          if (ancestors[0].type === 'listItem' || ancestors[0].type === 'list') {
            // we want to get rid of paragraphs inside list items
            return <Fragment key={key}>{children}</Fragment>;
          }

          return <Paragraph key={key}>{children}</Paragraph>;
        }),
        renderNodeRule(isBlockquote, ({ key, children, node }) => (
          <Blockquote key={key} attribution={node.attribution}>
            {children}
          </Blockquote>
        )),
        renderNodeRule(isThematicBreak, ({ key }) => <ThematicBreak key={key} />),
      ]}
      customMarkRules={[
        renderMarkRule('emphasis', ({ children, key }) => <Emphasis key={key}>{children}</Emphasis>),
        renderMarkRule('code', ({ children, key }) => <InlineCode key={key}>{children}</InlineCode>),
        renderMarkRule('strong', ({ children, key }) => <Strong key={key}>{children}</Strong>),
      ]}
      renderBlock={({ record }) => {
        let internalLink = '#';
        if (record._modelApiKey === 'link') {
          const linkRecord = record as LinkRecord;
          if (!linkRecord.isExternalUrl && linkRecord.link?.slug) {
            internalLink = generatePathForRecord({
              slug: linkRecord.link?.slug,
              type: linkRecord.link.__typename,
              parent: linkRecord.link.__typename === 'PageRecord' ? linkRecord.link.parent : undefined,
            });
          }
        }

        switch (record._modelApiKey) {
          case 'image':
            return (
              <RichTextEmbed>
                <ImageBlock key={record.id} block={record as ImageBlockFragment} />
              </RichTextEmbed>
            );
          case 'link':
            return (
              <CtaLink
                key={record.id}
                href={
                  record.isExternalUrl
                    ? typeof record.externalUrl === 'string' && record.externalUrl
                      ? record.externalUrl
                      : '#'
                    : internalLink
                }
                newTab={!!record.newTab}
              >
                {record.label as string}
              </CtaLink>
            );
          default:
            return null;
        }
      }}
      renderLinkToRecord={({ record, children, transformedMeta }) => (
        <TextLink
          key={record.id}
          href={
            generatePathForRecord({
              slug: record.slug as string,
              type: record.__typename as LinkableRecords,
              parent: record.parent as PageRecord,
            }) ?? '#'
          }
          newTab={transformedMeta?.target === '_blank'}
          rel={typeof transformedMeta?.rel === 'string' ? transformedMeta.rel : undefined}
          title={typeof transformedMeta?.title === 'string' ? transformedMeta.title : undefined}
        >
          {children}
        </TextLink>
      )}
    />
  </RichText>
);
