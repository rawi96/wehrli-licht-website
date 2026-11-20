import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

const arbitrary = (utilities) => `^(?:\\S*:)?!?-?(?:${utilities})-\\[`;

/**
 * Tailwind lint rules shared by the design system and the website (`@wehrli/design-system/eslint`).
 * The theme is strict (see src/foundation/tokens.css): a class without a token generates no CSS, so it fails lint.
 * Arbitrary values are fine for layout (grid templates, calc, aspect ratios), never for brand values.
 */
export const tailwindConfig = (entryPoint) => ({
  plugins: { 'better-tailwindcss': betterTailwindcss },
  settings: { 'better-tailwindcss': { entryPoint } },
  rules: {
    'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^group/', '^peer/', '^field-focus-plain$'] }],
    'better-tailwindcss/no-conflicting-classes': 'error',
    'better-tailwindcss/no-duplicate-classes': 'error',
    'better-tailwindcss/no-deprecated-classes': 'error',
    'better-tailwindcss/no-restricted-classes': [
      'error',
      {
        restrict: [
          {
            pattern:
              arbitrary('bg|text|border|fill|stroke|outline|ring|decoration|from|via|to|accent|caret') +
              '(?:#|rgb|hsl|oklch|color)',
            message: 'Use a color token from tokens.css instead of an arbitrary color.',
          },
          {
            pattern: arbitrary('font|leading'),
            message: 'Use a font size or line height token instead of an arbitrary value.',
          },
          {
            pattern: arbitrary('shadow|drop-shadow'),
            message: 'Use a shadow token (shadow-sm, shadow-md, shadow-lg) instead of an arbitrary shadow.',
          },
          {
            pattern: arbitrary('rounded(?:-[trblse]{1,2})?'),
            message: 'Use a radius token (rounded-sm, rounded, rounded-full).',
          },
        ],
      },
    ],
  },
});
