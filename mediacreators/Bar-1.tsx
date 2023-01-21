/* @vhs 80x3@1 */

import React from 'react'
import ReactCurse, { Bar, useInput } from '..'

const App = () => {
  useInput()

  return (
    <>
      {[...Array(24)].map((_, index) => (
        <Bar key={index} type="vertical" x={index * 2} height={(index + 1) / 8} />
      ))}
    </>
  )
}

ReactCurse.render(<App />)
