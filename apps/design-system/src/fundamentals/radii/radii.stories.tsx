import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const RADII = [
  { className: 'rounded-md', value: '0.75rem', usage: 'Every box: cards, images, buttons, inputs, chips, panels' },
  { className: 'rounded-full', value: '9999px', usage: 'Only circles: avatars, icon dots, badges' },
];

const meta: Meta = {
  title: 'Fundamentals/Radii',
};

export default meta;

export const Radii: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
      {RADII.map(({ className, value, usage }) => (
        <div key={className} className="flex flex-col gap-2 text-xs">
          <div className={`${className} bg-wehrli h-24 w-full`} />
          <code className="font-bold">{className}</code>
          <span className="text-gray-600">
            {value}: {usage}
          </span>
        </div>
      ))}
    </div>
  ),
};
