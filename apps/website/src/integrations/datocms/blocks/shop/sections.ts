import { ShopPageQuery } from '@/graphql/generated';

export type ShopPageSection = NonNullable<NonNullable<ShopPageQuery['shopPage']>['sections']>[number];

export type ShopCardsSection = Extract<ShopPageSection, { __typename: 'CardsBlockRecord' }>;

export const shopSectionHeadingId = (prefix: string, blockId: string): string => `${prefix}-${blockId}-heading`;

/** The tiles of the shop start page (shipping, pickup, payment, …); they double as FAQ structured data. */
export const findShopCardsSection = (sections: ShopPageSection[]): ShopCardsSection | undefined =>
  sections.find((section): section is ShopCardsSection => section.__typename === 'CardsBlockRecord');
