import { ShapeCatalogBlockFragment } from '@/graphql/generated';
import { ShapeCatalogBlock as ShapeCatalogBlockView } from '@wehrli/design-system';
import { FC } from 'react';
import { toImage } from '../image';
import { getPublicPagePath } from '../paths';

type Props = {
  block: ShapeCatalogBlockFragment;
};

/** Anchor from a group title, e.g. «Runde Formen» → `runde-formen`. */
const toAnchor = (title: string) =>
  title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

type Entry = ShapeCatalogBlockFragment['groups'][number]['shapes'][number];

/** The configurator's hash for an entry: a material (with its colour) or a form; none if the configurator knows neither. */
const configuratorHash = (entry: Entry) => {
  if (entry.configuratorMaterial) {
    const color = entry.configuratorColor ? `&farbe=${entry.configuratorColor.toLowerCase()}` : '';

    return `#material=${entry.configuratorMaterial}${color}`;
  }

  return entry.configuratorShape ? `#form=${entry.configuratorShape}` : null;
};

/**
 * The catalog of lampshade shapes or materials; entries the 3D configurator knows open it with that shape
 * (`#form=…`) or material (`#material=…`).
 */
/** Anchors per group, unique even when two groups share a title (`stoffe`, `stoffe-2`). */
const uniqueAnchors = (titles: string[]): string[] => {
  const seen = new Map<string, number>();

  return titles.map((title) => {
    const anchor = toAnchor(title);
    const count = (seen.get(anchor) ?? 0) + 1;
    seen.set(anchor, count);

    return count === 1 ? anchor : `${anchor}-${count}`;
  });
};

export const ShapeCatalogBlock: FC<Props> = ({ block }) => {
  const configuratorPath = block.configuratorPage ? getPublicPagePath(block.configuratorPage) : null;
  const materials = block.kind === 'materialien';
  const anchors = uniqueAnchors(block.groups.map((group) => group.title));

  return (
    <ShapeCatalogBlockView
      navLabel={materials ? 'Materialien nach Gruppe' : 'Formen nach Gruppe'}
      imageFit={materials ? 'cover' : 'contain'}
      configuratorLabel="In 3D ansehen"
      groups={block.groups.map((group, index) => ({
        id: group.id,
        anchor: anchors[index],
        title: group.title,
        intro: group.intro,
        shapes: group.shapes.map((shape) => ({
          id: shape.id,
          name: shape.name,
          description: shape.description,
          image: toImage(shape.image, {
            fallbackAlt: materials ? `Lampenschirm aus ${shape.name}` : `Lampenschirmform ${shape.name}`,
            altFromTitle: false,
          }),
          configuratorHref:
            configuratorPath && configuratorHash(shape) ? `${configuratorPath}${configuratorHash(shape)}` : null,
        })),
      }))}
    />
  );
};
