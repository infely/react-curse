import process from 'node:process'

/**
 * @deprecated
 */
export default () => {
  process.stdout.write('\x07')
}
