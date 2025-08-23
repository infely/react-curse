import ReactCurse, { Text, useInput } from '..'
import Frame from '../components/Frame'
import React, { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  useInput(
    input => {
      if (input === 'q') ReactCurse.exit()

      if (input === 'k') setCounter(counter + 1)
      if (input === 'j') setCounter(counter - 1)
    },
    [counter]
  )

  return (
    <>
      <Frame type="rounded" block>
        <Text italic>Counter:</Text>{' '}
        <Text color="red" underline>
          {counter}
        </Text>
      </Frame>
      <Text dim>j,k - change counter, q - quit</Text>
    </>
  )
}

ReactCurse.render(<App />)
