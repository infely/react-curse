/* @vhs 80x3
Hide
Type@0 npm_start
Enter
Sleep 40ms

Show
Sleep 1.5s */

import React from 'react'
import ReactCurse, { Spinner, useInput } from '..'

const App = () => {
  useInput()

  return (
    <>
      <Spinner block />
      <Spinner color="BrightGreen">-\|/</Spinner>
    </>
  )
}

ReactCurse.render(<App />)
