import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FC } from 'react';
import { cssVar } from '../token-table';

// Mirrors src/fundamentals/tokens.css. Swatches read the CSS variables, so values never drift from the tokens.
const GROUPS: Record<string, { tokens: string[]; usage: string }> = {
  Brand: {
    tokens: [
      'wehrli',
      'wehrli-50',
      'wehrli-100',
      'wehrli-200',
      'wehrli-300',
      'wehrli-400',
      'wehrli-500',
      'wehrli-600',
      'wehrli-700',
    ],
    usage: '`wehrli` (= 500) for links, buttons and the header. Lighter steps for hover, darker for overlays on photos.',
  },
  Surfaces: {
    tokens: ['white-200', 'white', 'white-100', 'white-300', 'black'],
    usage: '`white-200` is the page background, `white` raised surfaces such as cards and dialogs, `black` the text color.',
  },
  Neutral: {
    tokens: [
      'gray-50',
      'gray-100',
      'gray-200',
      'gray-300',
      'gray-400',
      'gray-500',
      'gray-600',
      'gray-700',
      'gray-800',
      'gray-900',
    ],
    usage: 'Secondary text (`gray-600`), borders and dividers (`gray-200`).',
  },
  Status: {
    tokens: ['success', 'warning', 'error', 'error-50', 'error-700'],
    usage: 'Form validation, alerts and order states.',
  },
};

const Swatches: FC = () => (
  <div className="flex flex-col gap-10">
    {Object.entries(GROUPS).map(([group, { tokens, usage }]) => (
      <section key={group} className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">{group}</h2>
        <p className="text-xs text-gray-600">{usage}</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {tokens.map((token) => (
            <div className="flex flex-col gap-2" key={token}>
              <div
                className="h-20 w-full rounded-sm border border-gray-200"
                style={{ background: `var(--color-${token})` }}
              />
              <span className="text-xs font-bold">{token}</span>
              <code className="text-xxs text-gray-600">{cssVar(`--color-${token}`)}</code>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);

const meta: Meta = {
  title: 'Fundamentals/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'All colors of the design. Use them as Tailwind classes (`bg-wehrli`, `text-gray-600`, `border-gray-200`) with an optional opacity (`bg-white/10`). Tailwind’s default palette is turned off.',
      },
    },
  },
};

export default meta;

export const Palette: StoryObj = { render: () => <Swatches /> };
