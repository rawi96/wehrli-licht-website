import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MOCK_PRODUCTS } from '../shop.mocks';
import { SortMenu } from '../sort-menu/sort-menu';
import { ProductCatalog } from './product-catalog';

const meta: Meta = {
  title: 'Shop/ProductCatalog',
  component: ProductCatalog,
  parameters: {
    docs: {
      description: {
        component: 'Controlled: the caller filters and sorts the products and passes the result.',
      },
    },
  },
};

export default meta;

const Example = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const products = MOCK_PRODUCTS.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <ProductCatalog
      heading={`${MOCK_PRODUCTS.length} Leuchten im Shop`}
      headingId="catalog-heading"
      products={products}
      query={query}
      onQueryChange={setQuery}
      sort={
        <SortMenu
          options={[
            { value: 'featured', label: 'Empfohlen' },
            { value: 'name-asc', label: 'Name A–Z' },
          ]}
          value={sort}
          onChange={setSort}
        />
      }
      resultMessage={`${products.length} von ${MOCK_PRODUCTS.length} Produkten`}
    />
  );
};

export const Default: StoryObj = { render: () => <Example /> };

export const NoResults: StoryObj = {
  render: () => (
    <ProductCatalog
      heading="Leuchten im Shop"
      headingId="catalog-empty-heading"
      products={[]}
      query="Kronleuchter"
      onQueryChange={() => undefined}
      resultMessage="0 von 4 Produkten"
    />
  ),
};
