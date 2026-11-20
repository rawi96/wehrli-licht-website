/* eslint-disable @eslint-react/dom-no-dangerously-set-innerhtml -- descriptions are HTML from the CMS */
import { FC } from 'react';
import { Heading } from '../../typography/heading/heading';

type Props = {
  title: string;
  /** Plain text below the title. */
  description?: string | null;
  /** Description from the CMS as HTML (inline markup only, it is rendered inside a `<p>`); wins over `description`. */
  descriptionHtml?: string | null;
};

/** Title and intro of a product list page (all products, a category). */
export const CatalogHeader: FC<Props> = ({ title, description, descriptionHtml }) => (
  <header className="mb-8 max-w-3xl">
    <Heading level="1">{title}</Heading>
    {descriptionHtml ? (
      <p className="mt-4 text-sm lg:text-base" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
    ) : (
      description && <p className="mt-4 text-sm lg:text-base">{description}</p>
    )}
  </header>
);
