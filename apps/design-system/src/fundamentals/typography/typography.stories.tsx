import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TokenTable } from '../token-table';

// Class names are written out, so Tailwind finds them.
const SIZES = [
  { token: 'xxl', className: 'text-xxl', usage: 'Hero title' },
  { token: 'xl', className: 'text-xl', usage: 'Page and section title' },
  { token: 'lg', className: 'text-lg', usage: 'Card and sub title' },
  { token: 'base', className: 'text-base', usage: 'Lead text' },
  { token: 'sm', className: 'text-sm', usage: 'Body copy' },
  { token: 'xs', className: 'text-xs', usage: 'Meta text, captions' },
  { token: 'xxs', className: 'text-xxs', usage: 'Legal notes, badges' },
];

const meta: Meta = {
  title: 'Fundamentals/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Jost in regular (`font-normal`, 400) and bold (`font-bold`, 600). Each size sets its line height. The names are shifted against Tailwind’s defaults: `text-sm` is the 16px body copy, `text-base` 20px lead text.',
      },
    },
  },
};

export default meta;

export const FontSizes: StoryObj = {
  render: () => (
    <TokenTable
      variablePrefix="--text-"
      rows={SIZES.map(({ token, className, usage }) => ({
        token,
        className,
        preview: <span className={className}>{usage}</span>,
      }))}
    />
  ),
};

export const Weights: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2 text-base">
      <span className="font-normal">font-normal (400): Licht für Wohnen und Arbeiten</span>
      <span className="font-bold">font-bold (600): Licht für Wohnen und Arbeiten</span>
    </div>
  ),
};

export const LineHeightsAndTracking: StoryObj = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-6 text-sm">
      {['leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed'].map((leading) => (
        <div key={leading}>
          <code className="text-xs text-gray-600">{leading}</code>
          <p className={leading}>
            Good lighting makes a room. It shapes how we see colors, materials and the people we share the space with.
          </p>
        </div>
      ))}
      {['tracking-tight', 'tracking-wide', 'tracking-widest'].map((tracking) => (
        <div key={tracking}>
          <code className="text-xs text-gray-600">{tracking}</code>
          <p className={tracking}>
            <span className="text-xs font-bold uppercase">Eyebrow label</span>
          </p>
        </div>
      ))}
    </div>
  ),
};
