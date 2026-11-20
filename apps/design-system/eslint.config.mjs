import { config } from '@smartive/eslint-config';
import storybook from 'eslint-plugin-storybook';
import { tailwindConfig } from './eslint-shared.mjs';

const eslintConfig = [
  ...config('react'),
  ...storybook.configs['flat/recommended'],
  tailwindConfig('src/styles.css'),
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['storybook-static/**', 'eslint.config.mjs', 'eslint-shared.mjs', 'postcss.config.js', '!.storybook'],
  },
];

export default eslintConfig;
