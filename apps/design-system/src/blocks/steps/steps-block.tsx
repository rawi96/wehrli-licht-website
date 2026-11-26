import { FC } from 'react';
import { LinkButton } from '../../actions/button/button';
import { Section } from '../../layout/section/section';
import type { LinkData } from '../../typography/text-link/text-link';
import type { BlockMargins } from '../block-margins';
import { BlockIntro } from '../block-intro';

export type StepItem = {
  id: string;
  /** Shown in the circle instead of the number, e.g. a year for a timeline. */
  marker?: string | null;
  title: string;
  text?: string | null;
};

type Props = BlockMargins & {
  title?: string | null;
  intro?: string | null;
  items: StepItem[];
  /** A button below the steps, e.g. «Jetzt anfragen». */
  link?: LinkData | null;
  anchorId?: string | null;
};

/**
 * Steps of a process (numbered) or a timeline (with years): a line with markers, title and text per step. Side by
 * side on wide screens for up to four steps, stacked otherwise.
 */
export const StepsBlock: FC<Props> = ({ title, intro, items, link, anchorId, marginTop, marginBottom }) => {
  const horizontal = items.length <= 4 && items.every((item) => !item.marker || item.marker.length <= 4);

  return (
    <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
      <BlockIntro title={title} intro={intro} />
      <ol className={horizontal ? 'grid gap-8 lg:grid-cols-4 lg:gap-6' : 'flex flex-col gap-8'}>
        {items.map((item, index) => (
          <li key={item.id} className={horizontal ? 'relative flex gap-5 lg:flex-col' : 'relative flex gap-5'}>
            {index < items.length - 1 ? (
              <span
                aria-hidden="true"
                className={
                  horizontal
                    ? 'bg-wehrli/20 absolute top-14 bottom-[-2rem] left-7 w-0.5 lg:top-7 lg:right-[-1.5rem] lg:bottom-auto lg:left-14 lg:h-0.5 lg:w-auto'
                    : 'bg-wehrli/20 absolute top-14 bottom-[-2rem] left-7 w-0.5'
                }
              />
            ) : null}
            <span className="bg-wehrli relative flex size-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md">
              {item.marker ?? index + 1}
            </span>
            <div className="min-w-0 pt-3 lg:pt-0">
              <h3 className="text-wehrli mb-2 text-base font-bold">{item.title}</h3>
              {item.text ? <p className="text-sm whitespace-pre-line text-black">{item.text}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      {link ? (
        <div className="mt-10">
          <LinkButton link={link} variant="primary" />
        </div>
      ) : null}
    </Section>
  );
};
