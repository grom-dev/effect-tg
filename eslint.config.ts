import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  markdown: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: false,
    overrides: {
      'style/operator-linebreak': ['error', 'before', {
        overrides: {
          '=': 'after',
          '&&': 'after',
          '||': 'after',
        },
      }],
    },
  },
}, {
  rules: {
    'curly': ['error', 'all'],
    'antfu/top-level-function': 'off',
    'yoda': 'off',
    'ts/no-namespace': 'off',
    'ts/no-redeclare': 'off',
    'test/prefer-lowercase-title': ['error', {
      ignore: ['describe'],
    }],
  },
})
