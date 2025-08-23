import { spawnSync } from 'child_process'

export default (): [() => string, (input: string) => string] => {
  const getClipboard = () => {
    switch (process.platform) {
      case 'darwin':
        return spawnSync('pbpaste', [], { encoding: 'utf8' }).stdout
    }

    return ''
  }

  const setClipboard = (input: any) => {
    if (typeof input !== 'string') input = input.toString()

    switch (process.platform) {
      case 'darwin':
        spawnSync('pbcopy', [], { input })
        break
      default:
        input = ''
    }

    return input
  }

  return [getClipboard, setClipboard]
}
