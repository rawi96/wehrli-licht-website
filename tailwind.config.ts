import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      sans: ['"Inter"', 'sans-serif'],
      serif: ['"IBM Plex Serif"', 'serif'],
    },
    fontWeight: {
      normal: '400',
      bold: '600',
    },
    fontSize: {
      xxs: ['0.75rem', { lineHeight: '150%' }],
      xs: ['0.875rem', { lineHeight: '150%' }],
      sm: ['1rem', { lineHeight: '150%' }],
      base: ['1.25rem', { lineHeight: '150%' }],
      lg: ['1.5rem', { lineHeight: '125%' }],
      xl: ['2rem', { lineHeight: '125%' }],
      xxl: ['4rem', { lineHeight: '5rem' }],
    },
    colors: {
      transparent: 'transparent',
      black: {
        DEFAULT: '#252525',
      },
      white: {
        DEFAULT: '#F9FAFB',
        300: '#f1f0ec',
        200: '#F8F7F5',
        100: '#ffffff',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      wehrli: {
        DEFAULT: '#214073',
        50: '#749AD7',
        100: '#658ED3',
        200: '#4577CA',
        300: '#3363B2',
        400: '#2A5293',
        500: '#214073',
        600: '#142847',
        700: '#080F1C',
        800: '#000000',
        900: '#000000',
      },
      success: '#16a34a',
      error: '#ef4444',
      warning: '#FFAB00',
    },
    borderRadius: {
      none: '0px',
      sm: '0.5rem',
      DEFAULT: '1rem',
      full: '9999px',
    },
    extend: {
      spacing: {
        120: '30rem',
      },
      minWidth: {
        '2/3': '66.666667%',
        '11/12': '91.666667%',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
export default config;
