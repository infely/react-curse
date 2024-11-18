/* @vhs 80x3@1 */
import ReactCurse, { Frame, useInput } from '..'
import React from 'react'

const App = () => {
  useInput()

  return (
    <>
      <Frame type="single" color="Red">
        single border type
      </Frame>
      <Frame type="double" color="Green" y={0}>
        double border type
      </Frame>
      <Frame type="rounded" color="Blue" y={0}>
        rounded border type
      </Frame>
    </>
  )
}

ReactCurse.render(<App />)
