/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    transitionDuration: {
      DEFAULT: '250ms',
      slow: '450ms',
    },
    fontFamily: {
      inter: ['var(--inter-font)', 'sans-serif'],
      anton: ['var(--anton-font)', 'sans-serif'],
    },
    fontSize: {
      xxs: ['12px', '16px'],
      xs: ['14px', '20px'],
      sm: ['16px', '24px'],
      base: ['18px', '25px'],
      md: ['20px', '30px'],
      lg: ['22px', '30px'],
      xl: ['24px', '36px'],
      '2xl': ['32px', '48px'],
      '3xl': ['40px', '1.2em'],
      '4xl': ['48px', '57px'],
      '5xl': ['64px', '76px'],
    },
    dropShadow: {
      heading: '1px 1px 2px rgba(0,0,0,.25)',
    },
    extend: {
      colors: {
        dark: '#1F212E',
        signal: '#FFF200',
      },
      spacing: {
        wide: '1600px',
        content: '1408px',
      },
      animation: {
        helmet: 'helmetBounce 8s infinite ease-in-out',
        helmetShadow: 'shadowBounce 8s infinite ease-in-out',
      },
      keyframes: {
        helmetBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shadowBounce: {
          '0%, 100%': { width: '60%' },
          '50%': { width: '90%' },
        },
      },
    },
  },
  plugins: [],
};
