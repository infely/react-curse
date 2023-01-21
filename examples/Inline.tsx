import React from 'react'
import ReactCurse, { Bar, Text, useAnimation, useSize } from '..'

const App = () => {
  const { width } = useSize()
  const { interpolate } = useAnimation(1000)

  return (
    <>
      <Text>Animating...</Text>
      <Bar type="horizontal" x={width - 8} width={interpolate(0, 8)} />
    </>
  )
}

ReactCurse.inline(<App />)
