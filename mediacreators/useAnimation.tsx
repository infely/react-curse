/* @vhs 80x3
Hide
Type@0 npm_start
Enter
Sleep 40ms

Show
Sleep 2s */

import React from 'react'
import ReactCurse, { Text, useAnimation, useInput } from '..'

const App = () => {
  useInput()

  const { ms, interpolate, interpolateColor } = useAnimation(1000, 4)
  const rounded = Math.floor(ms / 250) * 250
  const color = interpolateColor('#000', '#0f8', 0, 1000, rounded)
  return (
    <>
      <Text block>ms: {Math.floor(ms / 250) * 250}</Text>
      <Text block>interpolate: {Math.round(interpolate(0, 80, 0, 1000, rounded))}</Text>
      <Text>
        interpolateColor: <Text color={color}>{color}</Text>
      </Text>
    </>
  )
}

ReactCurse.render(<App />)
