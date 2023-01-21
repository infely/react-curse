import React, { useEffect, useMemo, useState } from 'react'
import ReactCurse, { Text, useExit, useInput, useSize } from '..'
import Canvas, { Line } from '../components/Canvas'

const CELL = 4
const COLORS = ['Red', 'Green', 'Blue']
const DATA = [...Array(COLORS.length)].map(() => {
  let prev = 0
  return [...Array(1024)].map(() => {
    prev += Math.round(Math.random() * 2 - 1)
    prev = Math.max(0, Math.min(4, prev))
    return prev
  })
})

const Graph = ({ mode, play }) => {
  const { width } = useSize()

  const h = useMemo(() => CELL * mode.h, [mode])
  const w = useMemo(() => CELL * mode.w, [mode])
  const c = useMemo(() => h * 4, [h])
  const [lines, setLines] = useState([])
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!play) return

      setOffset(offset + 1)
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [offset, play])

  useEffect(() => {
    setLines(DATA.map((line, colorIndex) => {
      return line.map((i, index) => {
        if (index - offset * mode.w / w > width * mode.w / w) return
        return {
          x: index * w - offset * mode.w,
          y: c - (line[index - 1] || 0) * h,
          dx: index * w + w - offset * mode.w,
          dy: c - i * h,
          color: COLORS[colorIndex]
        }
      }).filter(i => i)
    }).flat())
  }, [mode, offset])

  return (
    <Canvas width={width * mode.w} height={c + 1} mode={mode}>
      {lines.map((props, key) => <Line key={key} {...props} />)}
    </Canvas>
  )
}

const App = () => {
  const [mode, setMode] = useState({ w: 1, h: 2 })
  const [play, setPlay] = useState(true)

  useInput((input: string) => {
    if (input === '\x10\x0d') useExit()
    if (input === 'q') useExit()

    if (input === '1') setMode({ w: 1, h: 1 })
    if (input === '2') setMode({ w: 1, h: 2 })
    if (input === '3') setMode({ w: 2, h: 2 })
    if (input === '4') setMode({ w: 2, h: 4 })

    if (input === ' ') setPlay(play => !play)
  })

  return (
    <>
      <Text x={3} block>
        {COLORS.map((color, key) => <Text key={key} color={color}>Line {key + 1} </Text>)}
      </Text>
      <Text>
        <Text width={3} dim>
          {[...Array(5)].map((_, key) => <Text key={key} x={1} y={CELL * 4 - key * CELL}>{key.toString()}</Text>)}
        </Text>
        <Graph mode={mode} play={play} />
      </Text>
    </>
  )
}

ReactCurse.render(<App />)
