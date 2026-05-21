import { ShopPageQuery } from '@/graphql/generated';

export type ShopPageSection = NonNullable<NonNullable<ShopPageQuery['shopPage']>['sections']>[number];

export type ShopServiceSection = Extract<ShopPageSection, { __typename: 'ShopServiceSectionRecord' }>;

export const shopSectionHeadingId = (prefix: string, blockId: string): string => `${prefix}-${blockId}-heading`;

export const findShopServiceSection = (sections: ShopPageSection[]): ShopServiceSection | undefined =>
  sections.find((section): section is ShopServiceSection => section.__typename === 'ShopServiceSectionRecord');
