module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'prettier',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console':
      process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger':
      process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['warn', 'single'],
    // 'jsx-quotes': ['warn', 'prefer-single'],
    'comma-dangle': ['warn', 'only-multiline'],
    'no-undef': 'warn',
    'no-restricted-syntax': 'warn',
    'operator-linebreak': ['warn', 'after'],
    'import/no-unresolved': 'off',
  },
};
