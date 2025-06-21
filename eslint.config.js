import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default [
  ...compat.config({
    extends: ['next/core-web-vitals'],
    rules: {
      'no-unused-vars': 'warn',
      '@next/next/no-img-element': 'off',
    },
  }),
]
