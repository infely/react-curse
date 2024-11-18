/* @vhs 80x3@1 */
import ReactCurse, { Separator, useInput } from '..'
import React from 'react'

const App = () => {
  useInput()

  return (
    <>
      <Separator type="vertical" height={3} />
      <Separator type="horizontal" y={1} x={1} width={79} />
    </>
  )
}

ReactCurse.render(<App />)
