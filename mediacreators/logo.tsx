/* @vhs 48x7
Set Theme { "green": "#98971a", "background": "#ffffff", "foreground": "#ecdbb2" }

Hide
Type@0 npm_start
Enter
Sleep 40ms

Show
Sleep 10s */

import React from 'react'
import ReactCurse, { Bar, Text, useAnimation, useInput } from '..'

const splitLine = (line: string) => {
  const chunks = {}
  let chunksAt = 0
  line.split('').forEach((value, x: number) => {
    if (value !== ' ') return (chunksAt = x + 1)
    if (chunks[chunksAt] === undefined) chunks[chunksAt] = ['']
    chunks[chunksAt] += value
  })
  return Object.entries(chunks)
}

const mask = `
### ### ### ### ###     ### # # ### ### ###
# # #   # # #    #      #   # # # # #   #
##  ##  ### #    #  ### #   # # ##  ### ##
# # #   # # #    #      #   # # # #   # #
# # ### # # ###  #      ### ### # # ### ###
`.trim()

const w = Math.max(...mask.split('\n').map(i => i.length))

// prettier-ignore
const lines = [
  [[w + 32, w], [w * 3 + 32, w * 2]],
  [[w + 8, w],  [w * 3 + 8, w * 2]],
  [[w + 16, w], [w * 3 + 16, w * 2]],
  [[w, w],      [w * 3, w * 2]],
  [[w + 24, w], [w * 3 + 24, w * 2]],
]

const App = () => {
  useInput(input => input === '\x10\x0d' && ReactCurse.exit())

  const l = 10000
  const { ms, interpolate } = useAnimation(l)

  return (
    <Text y={1} x={2}>
      <Text y={0} x={0}>
        <Text color="Green">{mask}</Text>
      </Text>

      {[
        [0, l - 1250],
        [l - 1200, l - 600],
        [l - 550, l - 500]
      ].find(([from, to]) => ms >= from && ms < to) && (
        <Text y={0} x={0} width={w}>
          {lines.map((line, key) => (
            <Text key={key} block>
              {line.map(([x, width], key) => (
                <Bar key={key} type="horizontal" x={interpolate(x, x - w * 4, 0, 2000)} width={width} />
              ))}
            </Text>
          ))}
        </Text>
      )}

      <Text y={0} x={0} width={w}>
        {mask.split('\n').map((line, key) => {
          return (
            <Text key={key} block>
              {splitLine(line).map(([x, str], key) => (
                <Text key={key} x={parseInt(x)}>
                  {str as string}
                </Text>
              ))}
              <Text x={line.length}>{' '.repeat(w - line.length)}</Text>
            </Text>
          )
        })}
      </Text>
    </Text>
  )
}

ReactCurse.render(<App />)
