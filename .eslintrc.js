/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next', '@smartive/eslint-config/react'],
  rules: {
    'react/forbid-component-props': 'off',
  },
};
