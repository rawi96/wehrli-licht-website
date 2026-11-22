import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const ANIMATIONS = [
  { className: 'animate-hero-reveal', usage: 'Hero text fades in from below' },
  { className: 'animate-scroll-hint', usage: 'Bouncing “scroll down” hint' },
  { className: 'animate-light-beam', usage: 'Pulsing light cone' },
  { className: 'animate-ken-burns', usage: 'Slow zoom of the home stage image' },
];

const meta: Meta = {
  title: 'Fundamentals/Motion',
  parameters: {
    docs: {
      description: {
        component:
          'Animations and easings (`ease-in`, `ease-out`, `ease-in-out`, `ease-reveal`). With “reduce motion” turned on in the OS, decorative animations stop and reveals show their end state.',
      },
    },
  },
};

export default meta;

export const Animations: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {ANIMATIONS.map(({ className, usage }) => (
        <div key={className} className="flex flex-col gap-2 text-xs">
          <div className="bg-wehrli-50 flex h-24 items-center justify-center overflow-hidden rounded-md">
            <div className={`${className} bg-wehrli size-10 rounded-full`} />
          </div>
          <code className="font-bold">{className}</code>
          <span className="text-gray-600">{usage}</span>
        </div>
      ))}
    </div>
  ),
};
