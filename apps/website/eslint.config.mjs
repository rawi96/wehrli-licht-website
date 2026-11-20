import { config as smartiveConfig } from '@smartive/eslint-config';
import { tailwindConfig } from '@wehrli/design-system/eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs', 'graphql/generated.ts'],
  },
  ...smartiveConfig('nextjs'),
  // calendly-inline-widget: marker class of the Calendly embed script.
  // highlight-*: from src/styles/highlight-teaser.css until the highlight blocks live in the design system.
  tailwindConfig('src/styles/globals.css', { ignore: ['^calendly-inline-widget$', '^highlight-'] }),
  {
    rules: {
      '@smartive-eslint/forbid-component-props': 'off',
    },
  },
];
