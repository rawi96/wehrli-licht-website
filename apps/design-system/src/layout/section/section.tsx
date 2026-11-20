import { FC, PropsWithChildren } from 'react';
import { cn } from '../../fundamentals/cn';

type Props = PropsWithChildren<{
  /** Anchor for in-page links (`#id`). */
  id?: string | null;
  /** Space above, 96px. Editors can turn it off per block. */
  marginTop?: boolean;
  /** Space below, 96px. Editors can turn it off per block. */
  marginBottom?: boolean;
  /** The first text block of a page is set larger, as lead text. */
  lead?: boolean;
  /** Keeps the section clear of the sticky header when jumped to with an anchor. */
  scrollMargin?: boolean;
}>;

/** One block of a content page. Blocks stack inside the Container; their margins make the vertical rhythm. */
export const Section: FC<Props> = ({ children, id, marginTop = true, marginBottom = true, lead, scrollMargin }) => (
  <section
    id={id ?? undefined}
    className={cn(
      scrollMargin && 'scroll-mt-28',
      lead && 'first-of-type:text-base lg:first-of-type:text-lg',
      marginTop && 'mt-24',
      marginBottom && 'mb-24',
    )}
  >
    {children}
  </section>
);
