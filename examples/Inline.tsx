import ReactCurse, { Text } from '..'
import React from 'react'

const App = () => {
  return (
    <>
      <Text block>Line 1</Text>
      <Text block></Text>
      <Text block>Line 3 33</Text>
      <Text block></Text>
      <Text block></Text>
      <Text block></Text>
      <Text block></Text>
      <Text>Line 4</Text>
    </>
  )
}

ReactCurse.inline(<App />)
