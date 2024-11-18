/* @vhs 80x3@1
Set FontFamily "Apple Symbols"
Set FontSize 21

Hide
Type@0 npm_start
Enter
Sleep 250ms

Show
Sleep 250ms */
import ReactCurse, { Canvas, Point, Line, useInput } from '..'
import React from 'react'

const App = () => {
  useInput()

  return (
    <Canvas width={160} height={12} mode={{ h: 4, w: 2 }}>
      <Point x={1} y={1} color="BrightGreen" />
      <Line x={0} y={11} dx={159} dy={0} />
    </Canvas>
  )
}

ReactCurse.render(<App />)
