/* @vhs 80x3@1 */
import ReactCurse, { Canvas, Point, Line, useInput } from '..'
import React from 'react'

const App = () => {
  useInput()

  return (
    <Canvas width={80} height={6}>
      <Point x={1} y={1} color="BrightGreen" />
      <Line x={0} y={5} dx={79} dy={0} />
    </Canvas>
  )
}

ReactCurse.render(<App />)
