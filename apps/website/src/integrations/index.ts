import 'server-only';
import type { Catalog } from '@/ports/catalog';
import type { ContentSource } from '@/ports/content-source';
import { datocmsCatalog } from './datocms/catalog';
import { datocmsContent } from './datocms/content';

// Composition root: which integration implements which port. To replace a system, implement the port in a new
// folder under src/integrations and change the line here; nothing else in the app imports an integration directly.

export const content: ContentSource = datocmsContent;

export const catalog: Catalog = datocmsCatalog;
