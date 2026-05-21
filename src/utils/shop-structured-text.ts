import { isEmptyDocument, StructuredText as StructuredTextType } from 'datocms-structured-text-utils';

type StructuredTextField =
  | {
      value: unknown;
    }
  | null
  | undefined;

export const toStructuredTextValue = (field: StructuredTextField): StructuredTextType | null => {
  if (field?.value === undefined || field?.value === null) {
    return null;
  }

  const value = field.value as StructuredTextType;

  return isEmptyDocument(value) ? null : value;
};
