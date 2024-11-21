/* eslint-disable */

// @ts-expect-error: 'swell-js' has no default export, but it works at runtime.
import swell, { Cart, Category, ErrorResponse, Product } from 'swell-js';

export const getAllCategories = async (): Promise<Category[]> => {
  initSwell();

  const response = await swell.categories.list({});
  return response?.results.sort((a, b) => a.name.localeCompare(b.name)) || [];
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

export const getCart = async (): Promise<Cart | null> => {
  initSwell();

  return await swell.cart.get();
};

export const addToCart = async (productId?: string, variantId?: string): Promise<Cart | ErrorResponse> => {
  initSwell();

  return await swell.cart.addItem({
    product_id: productId,
    variant_id: variantId,
    quantity: 1,
  });
};

export const updateCartItem = async (itemId: string, quantity: number): Promise<Cart | ErrorResponse> => {
  initSwell();

  return await swell.cart.updateItem(itemId, {
    quantity,
  });
};

export const removeCartItem = async (itemId: string): Promise<Cart | ErrorResponse> => {
  initSwell();

  return await swell.cart.removeItem(itemId);
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
