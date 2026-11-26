import 'server-only';
import type { ContentRevalidation } from '@/ports/content-source';
import { revalidatePath } from 'next/cache';

type DatoEntity = {
  type?: string;
  attributes?: Record<string, unknown>;
};

/** Payload of a DatoCMS webhook (record created, updated, published, …). */
type DatoWebhookPayload = {
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
  const sharedPaths = ['/shop', '/shop/alle-leuchten', '/sitemap.xml', '/robots.txt', '/feed/google-shopping.xml'] as const;

  for (const path of sharedPaths) {
    revalidatePath(path);
    paths.push(path);
  }
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

const revalidateSite = (paths: string[]): void => {
  revalidatePath('/', 'layout');
  revalidatePath('/llms.txt');
  paths.push('/ (layout)', '/llms.txt');
};

const revalidateFromDatoWebhook = (payload: DatoWebhookPayload): string[] => {
  const model = getModelApiKey(payload);
  const paths: string[] = [];

  if (!model) {
    return paths;
  }

  const slug = payload.entity_slug ?? getSlugFromEntity(payload.entity);
  const previousSlug = getSlugFromEntity(payload.previous_entity);

  switch (model) {
    case 'page': {
      // A page appears beyond its own path: in the mega menu (title, teaser, slug), breadcrumbs and teasers of other
      // pages, project areas and llms.txt. Its path also depends on its parents, so everything is refreshed.
      revalidateSite(paths);
      break;
    }
    case 'header_footer':
    case 'company_profile':
    case 'site_text': {
      // Contact data, menus, texts and business facts are used site-wide (layout, JSON-LD) and in llms.txt.
      revalidateSite(paths);
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

      // Categories are linked in the menu of every page and listed in llms.txt.
      revalidateSite(paths);

      break;
    }
    case 'shop_page': {
      revalidateShopIndexAndFeeds(paths);
      break;
    }
    default:
      // Projects, FAQs, team members, testimonials, redirects…: shown on many pages, so all pages are refreshed.
      revalidateSite(paths);
      break;
  }

  return [...new Set(paths)];
};

export const revalidateChangedContent = (notification: unknown): ContentRevalidation => {
  const payload = notification as DatoWebhookPayload;

  return {
    paths: revalidateFromDatoWebhook(payload),
    model: payload.item_type ?? null,
    eventType: payload.event_type ?? null,
  };
};
