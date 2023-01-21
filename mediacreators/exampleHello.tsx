/* @vhs 80x3@1 */

import React from 'react'
import ReactCurse, { Text, useInput } from '..'

const App = ({ text }) => {
  useInput()

  return <Text color="Red">{text}</Text>
}

ReactCurse.render(<App text="hello world" />)
