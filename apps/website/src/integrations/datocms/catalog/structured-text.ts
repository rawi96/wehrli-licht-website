import { isEmptyDocument, StructuredText as StructuredTextType } from 'datocms-structured-text-utils';

type StructuredTextField =
  | {
      value: unknown;
    }
  | null
  | undefined;

/** The document of a DatoCMS structured text field, null when it is empty. */
export const toStructuredTextValue = (field: StructuredTextField): StructuredTextType | null => {
  if (field?.value === undefined || field?.value === null) {
    return null;
  }

  const value = field.value as StructuredTextType;

  return isEmptyDocument(value) ? null : value;
};

/** The text of a structured text document: its spans joined with spaces, whitespace collapsed. */
export const structuredTextToPlainText = (value: unknown): string => {
  if (!value || typeof value !== 'object') {
    return '';
  }

  const doc = 'document' in value && (value as { document?: unknown }).document ? value.document : value;

  const parts: string[] = [];

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') {
      return;
    }

    const n = node as { type?: string; value?: string; children?: unknown[] };
    if (n.type === 'span' && n.value) {
      parts.push(n.value);
    }
    for (const child of n.children ?? []) {
      walk(child);
    }
  };

  walk(doc);

  return parts.join(' ').replace(/\s+/g, ' ').trim();
};
