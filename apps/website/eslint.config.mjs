import { config as smartiveConfig } from '@smartive/eslint-config';
import { tailwindConfig } from '@wehrli/design-system/eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs', 'graphql/generated.ts'],
  },
  ...smartiveConfig('nextjs'),
  // calendly-inline-widget: marker class of the Calendly embed script.
  tailwindConfig('src/styles/globals.css', { ignore: ['^calendly-inline-widget$'] }),
  {
    rules: {
      '@smartive-eslint/forbid-component-props': 'off',
    },
  },
];
