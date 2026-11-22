'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { cn } from '../../fundamentals/cn';

export type TabItem = { id: string; label: string; content: ReactNode };

type Props = {
  items: TabItem[];
  /** Accessible name of the tab list. */
  label: string;
};

/**
 * Tabs with keyboard support (arrow keys, Home/End) from Headless UI. The panel scrolls when the tabs sit in a box of
 * limited height.
 */
export const Tabs: FC<Props> = ({ items, label }) => (
  <TabGroup className="flex min-h-0 flex-1 flex-col">
    <TabList aria-label={label} className="flex overflow-x-auto border-b border-gray-200 px-2.5">
      {items.map((item) => (
        <Tab
          key={item.id}
          className={cn(
            '-mb-px shrink-0 border-b-2 px-2 py-3 text-sm font-bold transition-colors focus-visible:-outline-offset-4',
            'data-selected:border-wehrli data-selected:text-wehrli border-transparent text-gray-600 hover:text-black',
          )}
        >
          {item.label}
        </Tab>
      ))}
    </TabList>
    <TabPanels className="min-h-0 flex-1 overflow-y-auto">
      {items.map((item) => (
        <TabPanel key={item.id} className="p-5 focus-visible:-outline-offset-4">
          {item.content}
        </TabPanel>
      ))}
    </TabPanels>
  </TabGroup>
);
