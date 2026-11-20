import { FC } from 'react';

type Props = {
  /** Trusted HTML from a DatoCMS text field (e.g. a category description or the opening hours). */
  html: string;
  /** `div` for text with paragraphs or lists, `span` for inline text. */
  as?: 'div' | 'span';
};

/** Renders HTML from a DatoCMS text field. The one place where the website injects CMS HTML. */
export const CmsHtml: FC<Props> = ({ html, as: Tag = 'span' }) => (
  // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- HTML text fields maintained in DatoCMS
  <Tag dangerouslySetInnerHTML={{ __html: html }} />
);
