import 'server-only';
import { ShopProductsForCheckoutDocument } from '@/graphql/generated';
import type { Catalog } from '@/ports/catalog';
import { queryDatoCMS } from './client';

export const datocmsCatalog: Catalog = {
  getCheckoutProducts: async (ids) => {
    const { allShopProducts } = await queryDatoCMS({ document: ShopProductsForCheckoutDocument, variables: { ids } });

    return allShopProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price ?? null,
      deliveryTime: product.deliveryTime ?? null,
      shippingCost: product.shippingCost ?? null,
      imageUrl: product.images[0]?.url ?? null,
      variants: product.variants.map((variant) => ({
        price: variant.price ?? null,
        selections: variant.selections.map(({ option, value }) => ({ option, value })),
      })),
    }));
  },
};
