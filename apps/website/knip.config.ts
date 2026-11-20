import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/**/*.{js,jsx,ts,tsx,mdx}', 'next.config.{js,mjs,cjs}', 'migrations/*.js'],
  // tailwindcss is loaded by @tailwindcss/postcss, not imported.
  ignoreDependencies: ['tailwindcss'],
};

export default config;
