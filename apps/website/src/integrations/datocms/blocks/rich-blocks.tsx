import {
  AccordionBlockFragment,
  CardsBlockFragment,
  ConfiguratorTeaserBlockFragment,
  CtaBlockFragment,
  FactsBlockFragment,
  PartnersBlockFragment,
  StepsBlockFragment,
} from '@/graphql/generated';
import {
  AccordionBlock as AccordionBlockView,
  CardsBlock as CardsBlockView,
  ConfiguratorTeaser,
  CtaBlock as CtaBlockView,
  FactsBlock as FactsBlockView,
  isCardIconName,
  PartnersBlock as PartnersBlockView,
  StepsBlock as StepsBlockView,
} from '@wehrli/design-system';
import { FC } from 'react';
import { toImage } from '../image';
import { toLink } from '../links';
import { StructuredTextRenderer } from './structured-text';

/** Empty CMS fields mean «leave out». */
const optional = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? '';

  return trimmed.length > 0 ? trimmed : null;
};

const margins = (block: { disableMarginTop: boolean; disableMarginBottom: boolean; anchorId: string | null }) => ({
  marginTop: !block.disableMarginTop,
  marginBottom: !block.disableMarginBottom,
  anchorId: optional(block.anchorId),
});

export const CardsBlock: FC<{ block: CardsBlockFragment }> = ({ block }) => (
  <CardsBlockView
    {...margins(block)}
    title={optional(block.cardsTitle)}
    intro={optional(block.cardsIntro)}
    items={block.items.map((item) => ({
      id: item.id,
      icon: isCardIconName(item.icon) ? item.icon : null,
      title: item.title,
      text: optional(item.text),
      link: item.link ? toLink(item.link) : null,
    }))}
  />
);

export const FactsBlock: FC<{ block: FactsBlockFragment }> = ({ block }) => (
  <FactsBlockView
    {...margins(block)}
    title={optional(block.factsTitle)}
    intro={optional(block.factsIntro)}
    items={block.items.map((item) => ({ id: item.id, value: item.value, label: item.label, text: optional(item.text) }))}
  />
);

export const StepsBlock: FC<{ block: StepsBlockFragment }> = ({ block }) => (
  <StepsBlockView
    {...margins(block)}
    title={optional(block.stepsTitle)}
    intro={optional(block.stepsIntro)}
    items={block.items.map((item) => ({
      id: item.id,
      marker: optional(item.marker),
      title: item.title,
      text: optional(item.text),
    }))}
    link={block.link ? toLink(block.link) : null}
  />
);

export const AccordionBlock: FC<{ block: AccordionBlockFragment }> = ({ block }) => (
  <AccordionBlockView
    {...margins(block)}
    title={optional(block.accordionTitle)}
    intro={optional(block.accordionIntro)}
    openFirst={block.openFirst}
    items={block.items.map((item) => ({
      id: item.id,
      title: item.title,
      content: <StructuredTextRenderer data={item.content} />,
    }))}
  />
);

export const CtaBlock: FC<{ block: CtaBlockFragment }> = ({ block }) =>
  block.primary ? (
    <CtaBlockView
      {...margins(block)}
      title={block.ctaTitle}
      text={optional(block.ctaText)}
      primary={toLink(block.primary)}
      secondary={block.secondary ? toLink(block.secondary) : null}
    />
  ) : null;

export const PartnersBlock: FC<{ block: PartnersBlockFragment }> = ({ block }) => (
  <PartnersBlockView
    {...margins(block)}
    title={optional(block.partnersTitle)}
    intro={optional(block.partnersIntro)}
    partners={block.partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      logo: { src: partner.logo.url, width: partner.logo.width, height: partner.logo.height },
      place: optional(partner.place),
      description: optional(partner.description),
      website: optional(partner.website),
    }))}
  />
);

/** The invitation to the configurator as a link to its page: nothing of the 3D view loads here. */
export const ConfiguratorTeaserBlock: FC<{ block: ConfiguratorTeaserBlockFragment }> = ({ block }) =>
  block.teaserLink ? (
    <ConfiguratorTeaser
      eyebrow={optional(block.teaserEyebrow) ?? undefined}
      title={block.teaserTitle}
      text={optional(block.teaserText) ?? undefined}
      features={(block.points ?? '')
        .split('\n')
        .map((point) => point.trim())
        .filter(Boolean)}
      action={{ label: block.teaserLink.label, href: toLink(block.teaserLink).href }}
      note={optional(block.note) ?? undefined}
      image={toImage(block.teaserImage) ?? null}
    />
  ) : null;
