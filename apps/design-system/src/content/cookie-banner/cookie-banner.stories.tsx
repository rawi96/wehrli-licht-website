import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CookieBanner } from './cookie-banner';

const meta: Meta<typeof CookieBanner> = {
  title: 'Content/CookieBanner',
  component: CookieBanner,
  parameters: { layout: 'fullscreen' },
  args: {
    labels: { text: 'Wir nutzen ein Statistik-Tool, um die Website zu verbessern, und mit Ihrer Zustimmung Werbe-Cookies.' },
    privacyHref: '#datenschutz',
    onAccept: () => undefined,
    onDecline: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="h-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CookieBanner>;

export const Default: Story = {};

export const WithoutPrivacyLink: Story = { args: { privacyHref: null } };
