import { revalidatePath } from 'next/cache';

type DatoEntity = {
  type?: string;
  attributes?: Record<string, unknown>;
};

export type DatoWebhookPayload = {
  event_type?: string;
  entity_slug?: string;
  item_type?: string;
  entity_type?: string;
  entity?: DatoEntity;
  previous_entity?: DatoEntity;
  related_entities?: DatoEntity[];
};

const getSlugFromEntity = (entity?: DatoEntity): string | null => {
  const slug = entity?.attributes?.slug;

  return typeof slug === 'string' && slug.length > 0 ? slug : null;
};

const getModelApiKey = (payload: DatoWebhookPayload): string | null => {
  if (payload.item_type) {
    return payload.item_type;
  }

  const itemType = payload.related_entities?.find((entity) => entity.type === 'item_type');
  const apiKey = itemType?.attributes?.api_key;

  return typeof apiKey === 'string' ? apiKey : null;
};

const revalidateShopIndexAndFeeds = (paths: string[]): void => {
  const sharedPaths = ['/shop', '/sitemap.xml', '/robots.txt', '/feed/google-shopping.xml'] as const;

  for (const path of sharedPaths) {
    revalidatePath(path);
    paths.push(path);
  }
};

const revalidatePage = (slug: string, paths: string[]): void => {
  if (slug === 'home') {
    revalidatePath('/');
    paths.push('/');

    return;
  }

  const path = `/${slug}`;
  revalidatePath(path);
  paths.push(path);
};

const revalidateProductSlug = (slug: string, paths: string[]): void => {
  const path = `/shop/produkte/${slug}`;
  revalidatePath(path);
  paths.push(path);
  revalidateShopIndexAndFeeds(paths);
};

const revalidateCategorySlug = (slug: string, paths: string[]): void => {
  const path = `/shop/kategorien/${slug}`;
  revalidatePath(path);
  paths.push(path);
  revalidateShopIndexAndFeeds(paths);
};

export const revalidateFromDatoWebhook = (payload: DatoWebhookPayload): string[] => {
  const model = getModelApiKey(payload);
  const paths: string[] = [];

  if (!model) {
    return paths;
  }

  const slug = payload.entity_slug ?? getSlugFromEntity(payload.entity);
  const previousSlug = getSlugFromEntity(payload.previous_entity);

  switch (model) {
    case 'page': {
      if (slug) {
        revalidatePage(slug, paths);
      }

      if (previousSlug && previousSlug !== slug) {
        revalidatePage(previousSlug, paths);
      }

      break;
    }
    case 'shop_product': {
      if (slug) {
        revalidateProductSlug(slug, paths);
      }

      if (previousSlug && previousSlug !== slug) {
        revalidateProductSlug(previousSlug, paths);
      }

      break;
    }
    case 'shop_category': {
      if (slug) {
        revalidateCategorySlug(slug, paths);
      }

      if (previousSlug && previousSlug !== slug) {
        revalidateCategorySlug(previousSlug, paths);
      }

      break;
    }
    default:
      break;
  }

  return [...new Set(paths)];
};
