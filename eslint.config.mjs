import { config as smartiveConfig } from '@smartive/eslint-config';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'eslint.config.mjs', 'graphql/generated.ts'],
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  ...smartiveConfig('nextjs'),
  {
    rules: {
      'react/forbid-component-props': 'off',
    },
  },
];

