const { $schema, ...config } = require('@smartive/prettier-config');

module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  ...config,
  rules: {
    'react/forbid-component-props': 'off',
  },
};
