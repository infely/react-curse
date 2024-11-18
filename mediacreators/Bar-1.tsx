/* @vhs 80x3@1 */
import ReactCurse, { Bar, useInput } from '..'
import React from 'react'

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
