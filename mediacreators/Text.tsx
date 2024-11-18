/* @vhs 80x3@1 */
import ReactCurse, { Text, useInput } from '..'
import React from 'react'

const App = () => {
  useInput()

  return (
    <>
      <Text color="Red" block>
        hello world
      </Text>
      <Text color="Green" bold block>
        hello world
      </Text>
      <Text color="BrightBlue" underline block>
        hello world
      </Text>
      <Text y={0} x="50%">
        <Text color={128} italic block>
          hello world
        </Text>
        <Text x="100%-11" color="#1ff" strikethrough block>
          hello world
        </Text>
        <Text x="50%-5" color="#e94691" inverse>
          hello world
        </Text>
      </Text>
    </>
  )
}

ReactCurse.render(<App />)
