import { config as smartiveConfig } from '@smartive/eslint-config';
import { tailwindConfig } from '@wehrli/design-system/eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs', 'graphql/generated.ts'],
  },
  ...smartiveConfig('nextjs'),
  tailwindConfig('src/styles/globals.css'),
  {
    rules: {
      '@smartive-eslint/forbid-component-props': 'off',
    },
  },
];
