import { config } from '@smartive/eslint-config';
import storybook from 'eslint-plugin-storybook';
import { tailwindConfig } from './eslint-shared.mjs';

const eslintConfig = [
  ...config('react'),
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      // Components take intent props (variant, size, ...), not classes. Library parts that only take classes are allowed.
      '@smartive-eslint/forbid-component-props': [
        'error',
        {
          forbid: [
            {
              propName: 'className',
              allowedForPatterns: [
                '*Link',
                '*Icon',
                'Dialog*',
                'Disclosure*',
                'Menu*',
                'Popover*',
                'Transition*',
                'Listbox*',
                'Radio*',
                'Tab*',
              ],
            },
          ],
        },
      ],
    },
  },
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
