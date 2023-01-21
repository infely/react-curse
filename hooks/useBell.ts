import process from 'node:process'

export default () => {
  process.stdout.write('\x07')
}
