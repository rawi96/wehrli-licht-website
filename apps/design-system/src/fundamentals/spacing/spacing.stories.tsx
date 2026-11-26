import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const STEPS = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32];

const meta: Meta = {
  title: 'Fundamentals/Spacing',
  parameters: {
    docs: {
      description: {
        component:
          'Spacing and sizes use Tailwind’s 4px scale (`--spacing: 0.25rem`): `p-4` is 16px, `gap-8` 32px, `h-120` 480px. The page content is at most `max-w-7xl` (1280px) wide and 11/12 of the viewport on small screens (see Layout/Container).',
      },
    },
  },
};

export default meta;

export const Scale: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2">
      {STEPS.map((step) => (
        <div key={step} className="flex items-center gap-4 text-xs">
          <code className="w-16">{step}</code>
          <span className="w-16 text-gray-600">{step * 4}px</span>
          <div className="bg-wehrli h-4 rounded-md" style={{ width: `calc(var(--spacing) * ${step})` }} />
        </div>
      ))}
    </div>
  ),
};

const WIDTHS = [
  { className: 'max-w-sm', value: '24rem' },
  { className: 'max-w-md', value: '28rem' },
  { className: 'max-w-lg', value: '32rem' },
  { className: 'max-w-xl', value: '36rem' },
  { className: 'max-w-2xl', value: '42rem' },
  { className: 'max-w-3xl', value: '48rem' },
  { className: 'max-w-6xl', value: '72rem' },
  { className: 'max-w-7xl', value: '80rem' },
  { className: 'max-w-prose', value: '65ch' },
];

export const ContentWidths: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2">
      {WIDTHS.map(({ className, value }) => (
        <div key={className} className="text-xs">
          <code>{className}</code> <span className="text-gray-600">{value}</span>
          <div className="bg-wehrli-50 h-3 rounded-md" style={{ maxWidth: value }} />
        </div>
      ))}
    </div>
  ),
};
