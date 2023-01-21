import React, { useState } from 'react'
import ReactCurse, { Text, useInput, useExit } from 'react-curse'

const App = () => {
  const [counter, setCounter] = useState(0)

  useInput(
    input => {
      if (input === 'q') useExit()
      else setCounter(counter + 1)
    },
    [counter]
  )

  return (
    <Text>
      <Text block>
        Counter: <Text color="Green">{counter.toString()}</Text>
      </Text>
      <Text dim block>
        Press q to exit or any key to increment the counter
      </Text>
      <Text>
        Edit <Text inverse>App.tsx</Text>
      </Text>
    </Text>
  )
}

ReactCurse.render(<App />)
