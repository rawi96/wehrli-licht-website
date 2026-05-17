export type GoogleShoppingFeedItem = {
  id: string;
  itemGroupId?: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  priceChf: number;
  shippingCostChf: number;
  productType?: string;
  mpn: string;
};
