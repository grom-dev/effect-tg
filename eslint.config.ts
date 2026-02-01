import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
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
  markdown: false, // Disable linting of code blocks in Markdown.
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
