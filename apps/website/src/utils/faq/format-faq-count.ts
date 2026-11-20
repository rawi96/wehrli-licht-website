export const formatFaqCount = (count: number): string => (count === 1 ? '1 Frage' : `${count} Fragen`);

export const formatFaqSearchStatus = (resultCount: number, totalCount: number, hasQuery: boolean): string => {
  if (hasQuery) {
    const label = resultCount === 1 ? 'Frage' : 'Fragen';

    return `${resultCount} von ${totalCount} ${label} gefunden`;
  }

  const scope = totalCount === 1 ? '1 Thema' : 'allen Themen';

  return `${formatFaqCount(totalCount)} in ${scope}`;
};
