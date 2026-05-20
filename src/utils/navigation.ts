import { DirectoryRecord, HeaderFooterModelMenuField, NavigationItemRecord } from '@/graphql/generated';

const normalize = (value: string) => value.trim().toLowerCase();

export const isShopMenuItem = (item: HeaderFooterModelMenuField): boolean => {
  if ('navigationItems' in item) {
    return false;
  }

  const slug = item.link?.slug ?? '';

  return normalize(item.label) === 'shop' || slug === 'shop';
};

export const isContactMenuItem = (item: HeaderFooterModelMenuField): boolean => {
  if ('navigationItems' in item) {
    return false;
  }

  const slug = item.link?.slug ?? '';

  return normalize(item.label) === 'kontakt' || slug === 'kontakt';
};

export const splitHeaderMenu = (menu: HeaderFooterModelMenuField[]) => {
  const primary: (NavigationItemRecord | DirectoryRecord)[] = [];
  let contact: NavigationItemRecord | null = null;

  for (const item of menu) {
    if (isShopMenuItem(item)) {
      continue;
    }

    if (isContactMenuItem(item) && !('navigationItems' in item)) {
      contact = item;
      continue;
    }

    primary.push(item);
  }

  return { primary, contact };
};
