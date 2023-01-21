/* @vhs 80x3@1 */

import React from 'react'
import ReactCurse, { Separator, useInput } from '..'

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
