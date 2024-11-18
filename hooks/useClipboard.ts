import { spawnSync } from 'node:child_process'
import { platform } from 'node:process'

export default (): [() => string, (input: string) => string] => {
  const getClipboard = () => {
    switch (platform) {
      case 'darwin':
        return spawnSync('pbpaste', [], { encoding: 'utf8' }).stdout
    }

    return ''
  }

  const setClipboard = (input: any) => {
    if (typeof input !== 'string') input = input.toString()

    switch (platform) {
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
