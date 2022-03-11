module.exports = {
  root: true,
  extends: [
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react-hooks/recommended',
  ],
  env: {
    'react-native/react-native': true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-native', 'prettier', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-native/no-unused-styles': 2,
        semi: ['error', 'never'],
        'comma-dangle': [
          'error',
          {
            arrays: 'always-multiline',
            exports: 'always-multiline',
            functions: 'never',
            imports: 'always-multiline',
            objects: 'always-multiline',
          },
        ],
        "prettier/prettier": 2,
      },
    },
  ],
};
