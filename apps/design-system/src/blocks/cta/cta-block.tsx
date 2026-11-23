import { FC } from 'react';
import { LinkButton } from '../../actions/button/button';
import { Section } from '../../layout/section/section';
import type { LinkData } from '../../typography/text-link/text-link';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  title: string;
  text?: string | null;
  primary: LinkData;
  secondary?: LinkData | null;
  anchorId?: string | null;
};

/** A call to action on the brand colour: a short title, a sentence and one or two buttons. */
export const CtaBlock: FC<Props> = ({ title, text, primary, secondary, anchorId, marginTop, marginBottom }) => (
  <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
    <div className="bg-wehrli relative overflow-hidden rounded-md px-8 py-10 text-white md:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-16 lg:py-14">
      <span
        aria-hidden="true"
        className="bg-wehrli-dark pointer-events-none absolute -top-24 -right-24 size-72 rounded-full opacity-60"
      />
      <div className="relative max-w-2xl">
        <h2 className="mb-3 text-lg font-bold md:text-xl">{title}</h2>
        {text ? <p className="text-sm text-white/85">{text}</p> : null}
      </div>
      <div className="relative mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-0 lg:shrink-0">
        <LinkButton link={primary} variant="primary-white" />
        {secondary ? <LinkButton link={secondary} variant="secondary-white" showArrow /> : null}
      </div>
    </div>
  </Section>
);
