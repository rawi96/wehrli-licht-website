import { FC, ReactNode } from 'react';
import { Heading } from '../../typography/heading/heading';

type Props = {
  title: string;
  /** Text below the title, rendered by the website (plain text or HTML from the CMS). */
  description?: ReactNode;
};

/** Title and intro of a product list page (all products, a category). */
export const CatalogHeader: FC<Props> = ({ title, description }) => (
  <header className="mb-8 max-w-3xl">
    <Heading level="1">{title}</Heading>
    {description ? <div className="mt-4 text-sm lg:text-base">{description}</div> : null}
  </header>
);
