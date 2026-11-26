import { ArrowRightIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { FC } from 'react';
import { Image, ImageData } from '../../content/image/image';
import { cn } from '../../fundamentals/cn';
import { CARD_COLUMNS, GRID_COLUMN_CLASSES, type GridColumns } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';

export type Shape = {
  id: string;
  name: string;
  description?: string | null;
  /** The sketch of the shape (square). */
  image?: ImageData | null;
  /** Opens the 3D configurator with this shape, if it knows it. */
  configuratorHref?: string | null;
};

export type ShapeGroup = {
  id: string;
  /** Anchor of the group, for the jump links (e.g. `runde-formen`). */
  anchor: string;
  title: string;
  intro?: string | null;
  shapes: Shape[];
};

type Props = {
  groups: ShapeGroup[];
  /** Label of the configurator link on a card, e.g. «In 3D ansehen». */
  configuratorLabel: string;
  /** Label of the jump links, for screen readers, e.g. «Formen nach Gruppe». */
  navLabel: string;
  /** `contain` for sketches on a grey ground (shown whole), `cover` for renderings or photos that fill the card. */
  imageFit?: 'contain' | 'cover';
};

/** Two columns already on phones (unlike the other card grids), 4 from lg. */
const CARD_IMAGE_SIZES: Record<GridColumns, string> = {
  3: '(min-width: 1400px) 410px, (min-width: 1024px) 30vw, 46vw',
  4: '(min-width: 1400px) 300px, (min-width: 1024px) 23vw, 46vw',
};

/** 3 columns for groups of 3 or 6 (no gap in the last row), else the usual 4. */
const columnsFor = (count: number): GridColumns => (count % 4 !== 0 && count % 3 === 0 ? 3 : CARD_COLUMNS);

/** One shape: its sketch, name and description, and the way into the 3D configurator where there is one. */
const ShapeCard: FC<{ shape: Shape; configuratorLabel: string; imageFit: 'contain' | 'cover'; columns: GridColumns }> = ({
  shape,
  configuratorLabel,
  imageFit,
  columns,
}) => (
  <article className="card-surface group flex h-full flex-col overflow-hidden">
    {/* Sketches are drawn on a light grey ground: shown whole, so the shape is never cut. Renderings fill the card. */}
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      <Image
        image={shape.image}
        sizes={CARD_IMAGE_SIZES[columns]}
        fit={imageFit}
        placeholder={imageFit === 'cover'}
        absolute
      />
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-wehrli text-base leading-snug font-bold text-balance break-words hyphens-auto">{shape.name}</h3>
      {shape.description && <p className="mt-2 text-sm text-black">{shape.description}</p>}
      {shape.configuratorHref && (
        <NextLink
          href={shape.configuratorHref}
          className="text-wehrli hover:text-wehrli-dark mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold whitespace-nowrap no-underline"
        >
          {configuratorLabel}
          {/* Every card has the same link text: the name makes each link unique for screen readers and search. */}
          <span className="sr-only">: {shape.name}</span>
          <ArrowRightIcon
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </NextLink>
      )}
    </div>
  </article>
);

/**
 * The catalog of lampshade shapes (or materials): jump links to the groups, then per group a heading, a short introduction and the
 * shapes as cards (sketch, name, description).
 */
export const ShapeCatalogBlock: FC<Props> = ({ groups, configuratorLabel, navLabel, imageFit = 'contain' }) => (
  <>
    <Section marginBottom={false}>
      <nav aria-label={navLabel}>
        <ul className="flex list-none flex-wrap gap-2 p-0">
          {groups.map((group) => (
            <li key={group.id}>
              <a
                href={`#${group.anchor}`}
                className="text-wehrli hover:bg-wehrli inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold no-underline shadow-sm ring-1 ring-black/5 transition-colors hover:text-white"
              >
                {group.title}
                <span className="ml-1.5 font-normal opacity-70">{group.shapes.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
    {groups.map((group) => (
      <Section key={group.id} id={group.anchor} scrollMargin>
        <Heading level="2">{group.title}</Heading>
        {group.intro && <p className="-mt-2 mb-8 max-w-2xl text-base text-black">{group.intro}</p>}
        <ul
          className={cn(
            'grid list-none grid-cols-2 gap-4 p-0 lg:gap-6',
            GRID_COLUMN_CLASSES[columnsFor(group.shapes.length)],
          )}
        >
          {group.shapes.map((shape) => (
            <li key={shape.id}>
              <ShapeCard
                shape={shape}
                configuratorLabel={configuratorLabel}
                imageFit={imageFit}
                columns={columnsFor(group.shapes.length)}
              />
            </li>
          ))}
        </ul>
      </Section>
    ))}
  </>
);
