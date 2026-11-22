import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const SHADOWS = [
  { className: 'shadow-sm', usage: 'Cards, inputs' },
  { className: 'shadow-md', usage: 'Cards on hover' },
  { className: 'shadow-lg', usage: 'Flyouts, dialogs, sticky bars' },
];

const meta: Meta = {
  title: 'Fundamentals/Shadows',
};

export default meta;

export const Shadows: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-3">
      {SHADOWS.map(({ className, usage }) => (
        <div key={className} className={`${className} flex h-28 flex-col justify-end rounded-md bg-white p-4 text-xs`}>
          <code className="font-bold">{className}</code>
          <span className="text-gray-600">{usage}</span>
        </div>
      ))}
    </div>
  ),
};
