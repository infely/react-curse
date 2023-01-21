/* @vhs 80x3
Hide
Type@0 npm_start
Enter
Sleep 40ms

Show
Sleep 2s */

import React from 'react'
import ReactCurse, { Bar, Text, useAnimation, useInput } from '..'

const App = () => {
  useInput()
  const { interpolate } = useAnimation(2000)

  return (
    <>
      <Text y={0} x={0}>
        {'<Bar>'}  <Bar type="horizontal" x={interpolate(7, 14)} width={interpolate(1, 16)} />
      </Text>
      <Text y={2} x={0}>
        {'<Text>'} <Text inverse x={Math.round(interpolate(7, 14))} width={Math.round(interpolate(1, 16))}>{' '.repeat(22)}</Text>
      </Text>
    </>
  )
}

ReactCurse.render(<App />)
