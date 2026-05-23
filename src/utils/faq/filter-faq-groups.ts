import type { FaqTopicGroup } from '@/utils/faq/group-by-topic';

const normalize = (value: string): string => value.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

const matchesQuery = (text: string, query: string): boolean => normalize(text).includes(query);

export const filterFaqGroups = (groups: FaqTopicGroup[], rawQuery: string): FaqTopicGroup[] => {
  const query = normalize(rawQuery);
  if (!query) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      faqs: group.faqs.filter(
        (faq) =>
          matchesQuery(faq.question, query) || matchesQuery(faq.answer, query) || matchesQuery(group.topic.title, query),
      ),
    }))
    .filter((group) => group.faqs.length > 0);
};

export const countFaqsInGroups = (groups: FaqTopicGroup[]): number =>
  groups.reduce((total, group) => total + group.faqs.length, 0);
