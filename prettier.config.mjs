import sortImports from '@trivago/prettier-plugin-sort-imports'

export default {
  arrowParens: 'avoid',
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  plugins: [sortImports]
}
