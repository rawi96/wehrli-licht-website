import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

const arbitrary = (utilities) => `^(?:\\S*:)?!?-?(?:${utilities})-\\[`;

/**
 * Tailwind lint rules shared by the design system and the website (`@wehrli/design-system/eslint`).
 * The theme is strict (see src/fundamentals/tokens.css): a class without a token generates no CSS, so it fails lint.
 * Arbitrary values are fine for layout (grid templates, calc, aspect ratios), never for brand values.
 */
export const tailwindConfig = (entryPoint) => ({
  plugins: { 'better-tailwindcss': betterTailwindcss },
  settings: { 'better-tailwindcss': { entryPoint } },
  rules: {
    'better-tailwindcss/no-unknown-classes': [
      'error',
      // field-focus-plain: opts an input out of the global focus ring (styles.css).
      { ignore: ['^group/', '^peer/', '^field-focus-plain$'] },
    ],
    'better-tailwindcss/no-conflicting-classes': 'error',
    'better-tailwindcss/no-duplicate-classes': 'error',
    'better-tailwindcss/no-deprecated-classes': 'error',
    'better-tailwindcss/no-restricted-classes': [
      'error',
      {
        restrict: [
          {
            // A raw color anywhere in an arbitrary value, also inside gradients; var(--color-*) is fine.
            pattern:
              arbitrary('bg|text|border|fill|stroke|outline|ring|decoration|from|via|to|accent|caret|shadow') +
              '[^\\]]*(?:#[0-9a-fA-F]{3}|rgba?\\(|hsla?\\(|oklch\\(|oklab\\()',
            message: 'Use a color token from tokens.css (or var(--color-…)) instead of a raw color.',
          },
          {
            pattern: arbitrary('text') + '[\\d.]',
            message: 'Use a font size token (text-xxxs … text-xxl) instead of an arbitrary size.',
          },
          {
            pattern: arbitrary('font|leading|tracking'),
            message: 'Use a font weight, line height or letter spacing token instead of an arbitrary value.',
          },
          {
            pattern: arbitrary('shadow|drop-shadow'),
            message: 'Use a shadow token (shadow-sm, shadow-md, shadow-lg) instead of an arbitrary shadow.',
          },
          {
            pattern: arbitrary('rounded(?:-[trblse]{1,2})?'),
            message: 'Use a radius token (rounded-sm, rounded-lg, rounded-full).',
          },
        ],
      },
    ],
  },
});
