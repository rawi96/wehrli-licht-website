/** A topic of the FAQ page. */
export type FaqTopicRef = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
};

export type FaqEntry = {
  id: string;
  question: string;
  slug: string;
  answer: string;
  sortOrder: number;
  topic: FaqTopicRef;
};

export type FaqTopicGroup = {
  topic: FaqTopicRef;
  faqs: FaqEntry[];
};

export const groupFaqsByTopic = (faqs: FaqEntry[]): FaqTopicGroup[] => {
  const groups = new Map<string, FaqTopicGroup>();

  for (const faq of faqs) {
    const existing = groups.get(faq.topic.id);
    if (existing) {
      existing.faqs.push(faq);
    } else {
      groups.set(faq.topic.id, { topic: faq.topic, faqs: [faq] });
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      faqs: [...group.faqs].sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .sort((a, b) => a.topic.sortOrder - b.topic.sortOrder);
};

const normalize = (value: string): string => value.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

const matchesQuery = (text: string, query: string): boolean => normalize(text).includes(query);

/** Questions whose question, answer or topic contains the query (ignoring case and accents). */
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
