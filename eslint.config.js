import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  markdown: false, // Disable linting of code blocks in Markdown.
}, {
  rules: {
    'antfu/top-level-function': 'off',
    'yoda': 'off',
    'ts/no-namespace': 'off',
  },
})
