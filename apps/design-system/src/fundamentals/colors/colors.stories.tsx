import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FC } from 'react';
import { cssVar } from '../token-table';

// Mirrors src/fundamentals/tokens.css. Swatches read the CSS variables, so values never drift from the tokens.
const GROUPS: Record<string, { tokens: string[]; usage: string }> = {
  Brand: {
    tokens: ['wehrli', 'wehrli-dark', 'wehrli-100', 'wehrli-50'],
    usage:
      '`wehrli` is the primary color: buttons, links, headings, the header. `wehrli-dark` for hover of primary buttons and dark overlays, `wehrli-100` for selected states, `wehrli-50` for tinted surfaces and hover of list items.',
  },
  Neutral: {
    tokens: ['black', 'white', 'gray-50', 'gray-100', 'gray-200', 'gray-400', 'gray-600'],
    usage:
      '`black` text, `white` cards, panels and inputs, `gray-50` the page background, `gray-100` subtle fills, `gray-200` borders and dividers, `gray-400` input borders and icons, `gray-600` secondary text.',
  },
  Status: {
    tokens: ['success', 'error', 'error-50', 'error-700'],
    usage: 'Form validation, alerts and order states. No other accent colors.',
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
                className="h-20 w-full rounded-md border border-gray-200"
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
