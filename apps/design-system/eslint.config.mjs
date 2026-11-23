import { config } from '@smartive/eslint-config';
import storybook from 'eslint-plugin-storybook';
import { tailwindConfig } from './eslint-shared.mjs';

const eslintConfig = [
  ...config('react'),
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      // Components take intent props (variant, size, ...), not classes or styles. Library parts that only take classes
      // are allowed: links, Heroicons, Headless UI parts and next/image (imported as NextImage).
      '@smartive-eslint/forbid-component-props': [
        'error',
        {
          forbid: [
            'style',
            {
              propName: 'className',
              allowedFor: ['NextImage'],
              allowedForPatterns: ['*Link', '*Icon', 'Dialog*', 'Disclosure*', 'Menu*', 'Popover*', 'Radio*', 'Transition*', 'Tab*'],
            },
          ],
        },
      ],
    },
  },
  tailwindConfig('src/styles.css'),
  {
    ignores: ['storybook-static/**', 'eslint.config.mjs', 'eslint-shared.mjs', 'postcss.config.js'],
  },
];

export default eslintConfig;
