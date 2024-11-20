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
      xxs: ['0.875rem', { lineHeight: '150%' }],
      xs: ['1rem', { lineHeight: '150%' }],
      sm: ['1.125rem', { lineHeight: '150%' }],
      base: ['1.5rem', { lineHeight: '150%' }],
      lg: ['2rem', { lineHeight: '125%' }],
      xl: ['3rem', { lineHeight: '125%' }],
      xxl: ['5rem', { lineHeight: '6rem' }],
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
