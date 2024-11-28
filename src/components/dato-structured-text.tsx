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
import NextLink from 'next/link';
import { FC, Fragment } from 'react';
import { StructuredText, renderMarkRule, renderNodeRule } from 'react-datocms';
import { ImageBlock } from './blocks/image';
import {
  Blockquote,
  Code,
  Copy,
  Decoration,
  Heading,
  Link,
  ListItem,
  OrderedList,
  TextLink,
  ThematicBreak,
  UnorderedList,
} from './nodes';

type Props = {
  data: StructuredTextType | null | undefined;
};

export const StructuredTextRenderer: FC<Props> = ({ data }) => (
  <div className="font-sans text-sm lg:text-base">
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
            <NextLink key={key} href={node.url} passHref legacyBehavior>
              <TextLink newTab={target === '_blank'} rel={rel}>
                {children}
              </TextLink>
            </NextLink>
          );
        }),
        renderNodeRule(isParagraph, ({ children, key, ancestors }) => {
          if (ancestors[0].type === 'listItem' || ancestors[0].type === 'list') {
            // we want to get rid of paragraphs inside list items
            return <Fragment key={key}>{children}</Fragment>;
          }

          return <Copy key={key}>{children}</Copy>;
        }),
        renderNodeRule(isBlockquote, ({ key, children, node }) => (
          <Blockquote key={key} attribution={node.attribution}>
            {children}
          </Blockquote>
        )),
        renderNodeRule(isThematicBreak, ({ key }) => <ThematicBreak key={key} />),
      ]}
      customMarkRules={[
        renderMarkRule('emphasis', ({ children, key }) => <Decoration key={key}>{children}</Decoration>),
        renderMarkRule('code', ({ children, key }) => <Code key={key}>{children}</Code>),
        renderMarkRule('strong', ({ children, key }) => (
          <strong key={key} className="font-bold">
            {children}
          </strong>
        )),
      ]}
      renderBlock={({ record }) => {
        let internalLink = '#';
        if (record._modelApiKey === 'link') {
          const linkRecord = record as LinkRecord;
          if (!linkRecord.isExternalUrl && linkRecord.link?.slug) {
            internalLink = generatePathForRecord({
              slug: linkRecord.link?.slug,
              type: linkRecord.link.__typename as LinkableRecords,
              parent: linkRecord.link.__typename === 'PageRecord' ? linkRecord.link.parent : undefined,
            });
          }
        }

        switch (record._modelApiKey) {
          case 'image':
            return (
              <div className="my-4 lg:my-8">
                <ImageBlock key={record.id} block={record as ImageBlockFragment} />
              </div>
            );
          case 'link':
            return (
              <Link
                key={record.id}
                href={record.isExternalUrl ? (record.url as string) : internalLink}
                target={record.newTab ? '_blank' : '_self'}
                rel={record.newTab ? 'noopener noreferrer' : undefined}
              >
                {record.label as string}
              </Link>
            );
          default:
            return null;
        }
      }}
      renderLinkToRecord={({ record, children, transformedMeta }) => (
        <NextLink
          key={record.id}
          legacyBehavior
          passHref
          href={
            generatePathForRecord({
              slug: record.slug as string,
              type: record.__typename as LinkableRecords,
              parent: record.parent as PageRecord,
            }) ?? '#'
          }
        >
          <TextLink {...transformedMeta}>{children}</TextLink>
        </NextLink>
      )}
    />
  </div>
);
