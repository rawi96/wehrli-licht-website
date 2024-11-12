/* eslint-disable */

// @ts-expect-error: 'swell-js' has no default export, but it works at runtime.
import swell, { Category, Product } from 'swell-js';

export const getAllCategories = async (): Promise<Category[]> => {
  initSwell();

  const response = await swell.categories.list();
  return response?.results || [];
};

export const getAllProducts = async (): Promise<Product[]> => {
  initSwell();

  const response = await swell.products.list({ limit: 100 });
  return response?.results || [];
};

export const getBestsellers = async (): Promise<Product[] | null> => {
  initSwell();

  const response = await swell.products.list({ limit: 100 });
  const products = response?.results || [];
  return products.filter((product) => product.tags?.includes('bestseller')) || null;
};

export const getProductsByCategory = async (slug: string): Promise<Product[] | null> => {
  initSwell();

  const response = await swell.products.list({
    category: slug,
    limit: 100,
    expand: ['variants'],
  });
  return response?.results || null;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  initSwell();

  const response = await swell.categories.get(slug);
  return response || null;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  initSwell();

  const response = await swell.products.get(slug);
  return response || null;
};

export const initSwell = () => {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID;
  const apiKey = process.env.NEXT_PUBLIC_SWELL_API_KEY;

  if (!storeId || !apiKey) {
    console.error('Error: SWELL store ID and API key are required to initialize.');
    return;
  }

  swell.init(storeId, apiKey);
};
