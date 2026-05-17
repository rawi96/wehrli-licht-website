export type VerifiedCheckoutQuote = {
  lines: {
    productId: string;
    name: string;
    quantity: number;
    unitPriceChf: number;
  }[];
  totals: {
    subTotalChf: number;
    shippingCostChf: number;
    grandTotalChf: number;
  };
  deliveryTimeSummary?: string;
};
