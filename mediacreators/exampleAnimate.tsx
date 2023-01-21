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
  const { interpolate, interpolateColor } = useAnimation(1000)

  return <Text width={interpolate(0, 80)} background={interpolateColor('#282828', '#d79921')} />
}

ReactCurse.render(<App />)
