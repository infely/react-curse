import React, { useEffect, useState } from 'react'
import ReactCurse, { Banner, Canvas, Point, Line, useSize, useInput, useExit } from '..'

const Game = () => {
  const { width, height } = useSize()

  const [scores, setScores] = useState([0, 0])
  const [y, setY] = useState(height - 4)
  const [ball, setBall] = useState({ x: Math.floor(width / 2), y: height, dx: 1, dy: 1 })

  useEffect(() => {
    const interval = setInterval(() => {
      setBall(({ x, y, dx, dy }) => {
        x += dx
        y += dy
        if (x <= 1 || x >= width - 2) {
          dx = -dx
          scores[0]++
          setScores(scores)
        }
        if (y <= 0 || y >= height * 2 - 1) {
          dy = -dy
          scores[1]++
          setScores(scores)
        }
        return { x, y, dx, dy }
      })
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [scores])

  useInput((input: string) => {
    if (input === '\x10\x0d') useExit()
    if (input === 'q') useExit()

    if (input === 'k') setY(y => y - 1)
    if (input === 'j') setY(y => y + 1)
  })

  return (
    <>
      <Banner y={0} x="50%-8">
        {scores.join('   ')}
      </Banner>
      <Canvas y={0} x={0} width={width} height={height * 2}>
        <Line x={1} y={y} dx={1} dy={y + 4} />
        <Point x={ball.x} y={ball.y} />
        <Line x={width - 2} y={y} dx={width - 2} dy={y + 4} />
      </Canvas>
    </>
  )
}

ReactCurse.render(<Game />)
