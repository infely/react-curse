import useSize from './useSize'

export default (text: string, _width: number | undefined = undefined) => {
  const width = _width ?? useSize().width

  return text
    .split('\n')
    .map((line: string) => {
      if (line.length <= width) return line

      return line
        .split(' ')
        .reduce(
          (acc, i) => {
            if (acc[acc.length - 1].length + i.length > width) acc.push('')
            acc[acc.length - 1] += `${i} `
            return acc
          },
          ['']
        )
        .map(i => i.trimEnd())
        .join('\n')
    })
    .join('\n')
}
