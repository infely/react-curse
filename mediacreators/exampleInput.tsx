/* @vhs 80x3x10
Hide
Type@0 npm_start
Enter
Sleep 250ms

Show
Sleep 250ms
Type@250ms kkjkkkjjjj
Sleep 250ms */

import React, { useState } from 'react'
import ReactCurse, { Text, useInput } from '..'

const App = () => {
  const [counter, setCounter] = useState(0)

  useInput(
    input => {
      if (input === 'k') setCounter(counter + 1)
      if (input === 'j') setCounter(counter - 1)
      if (input === 'q') ReactCurse.exit()
    },
    [counter]
  )

  return (
    <Text>
      counter: <Text bold>{counter.toString()}</Text>
    </Text>
  )
}

ReactCurse.render(<App />)
