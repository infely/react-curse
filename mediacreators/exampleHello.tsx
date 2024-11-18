/* @vhs 80x3@1 */
import ReactCurse, { Text, useInput } from '..'
import React from 'react'

const App = ({ text }: { text: string }) => {
  useInput()

  return <Text color="Red">{text}</Text>
}

ReactCurse.render(<App text="hello world" />)
