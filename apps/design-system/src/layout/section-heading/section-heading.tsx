import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { FC } from 'react';
import { Heading } from '../../typography/heading/heading';

type Props = {
  title: string;
  /** Link at the right with an arrow before it, e.g. «Alle Projekte ansehen» or «Zurück zu Leistungen». */
  link?: { label: string; href: string } | null;
  /** The link leads back up (arrow before the label, pointing left); otherwise on to more (arrow after, right). */
  back?: boolean;
};

/** H2 of a section of cards with a link to more at the right (below the title on phones). */
export const SectionHeading: FC<Props> = ({ title, link, back = false }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
    <div className="[&>h2]:mb-0">
      <Heading level="2">{title}</Heading>
    </div>
    {link && (
      <NextLink
        href={link.href}
        className="group text-wehrli hover:text-wehrli-dark inline-flex shrink-0 items-center gap-2 text-sm font-bold no-underline"
      >
        {back && <ArrowLeftIcon aria-hidden className="h-4 w-4" />}
        {link.label}
        {!back && (
          <ArrowRightIcon
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        )}
      </NextLink>
    )}
  </div>
);
