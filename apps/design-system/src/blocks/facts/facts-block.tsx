import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';
import { BlockIntro } from '../block-intro';

export type FactItem = {
  id: string;
  /** The figure, e.g. «1948» or «21». */
  value: string;
  /** What it means, e.g. «Grundformen». */
  label: string;
  text?: string | null;
};

type Props = BlockMargins & {
  title?: string | null;
  intro?: string | null;
  items: FactItem[];
  anchorId?: string | null;
};

/** A few figures, big on the brand colour: the company at a glance. */
export const FactsBlock: FC<Props> = ({ title, intro, items, anchorId, marginTop, marginBottom }) => (
  <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
    <div className="bg-wehrli rounded-md p-8 text-white md:p-12 lg:p-16">
      <BlockIntro title={title} intro={intro} inverted />
      <dl
        className={cn(
          'grid grid-cols-2 gap-x-6 gap-y-10',
          items.length >= 4 ? 'lg:grid-cols-4' : items.length === 3 ? 'md:grid-cols-3' : undefined,
        )}
      >
        {items.map((item) => (
          <div key={item.id} className="flex flex-col border-l-2 border-white/30 pl-4 md:pl-6">
            <dt className="order-2 text-sm font-bold">{item.label}</dt>
            <dd className="md:text-xxl order-1 mb-1 text-xl leading-none font-bold tabular-nums md:leading-none">
              {item.value}
            </dd>
            {item.text ? <dd className="order-3 mt-1 text-xs text-white/75">{item.text}</dd> : null}
          </div>
        ))}
      </dl>
    </div>
  </Section>
);
