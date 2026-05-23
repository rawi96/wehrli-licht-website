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
