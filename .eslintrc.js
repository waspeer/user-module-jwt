module.exports = {
  extends: ['./node_modules/poetic/config/eslint/eslint-config.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true } }],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-empty-function': 'off',
    'no-useless-constructor': 'off',
    'no-shadow': 'off',
    'react/static-property-placement': 'off',
  },
};
