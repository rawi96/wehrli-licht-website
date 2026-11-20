import { config as smartiveConfig } from '@smartive/eslint-config';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs', 'graphql/generated.ts'],
  },
  ...smartiveConfig('nextjs'),
  {
    rules: {
      '@smartive-eslint/forbid-component-props': 'off',
    },
  },
];
