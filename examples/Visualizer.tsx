import React, { useMemo } from 'react'
import ReactCurse, { Bar, Text, Trail, useAnimation, useSize } from '..'

const App = () => {
  const { height, width } = useSize()

  const { ms, interpolate } = useAnimation(2000)

  const lines = useMemo(() => {
    return [...Array(Math.floor(width / 2))].map(_ => ({
      h: Math.floor(Math.random() * height),
      t: Math.floor(Math.random() * 250) + 250,
      c: 255 - Math.floor(Math.random() * 16)
    }))
  }, [])

  return (
    <>
      {lines.map(({ h, t, c }, key) => {
        h = ms < 1000 ? interpolate(0, h, 0, t, ms % t) : interpolate(h, 0, 1000, 2000)
        return (
          <Text y={0} x={key * 2} key={key}>
            <Bar type="vertical" y={height - h} height={h} color={c} />
          </Text>
        )
      })}
    </>
  )
}

const Line = ({ h, c }) => {
  const { height } = useSize()
  const { interpolate } = useAnimation(500)

  h = interpolate(h, 0)

  return <Bar type="vertical" y={height - h} height={h} color={c} />
}

const App2 = () => {
  const { height, width } = useSize()

  const lines = useMemo(() => {
    return [...Array(Math.floor(width / 2))].map(_ => ({
      h: Math.floor(Math.random() * height),
      c: 255 - Math.floor(Math.random() * 16)
    }))
  }, [])

  return (
    <Trail delay={1000 / width}>
      {lines.map((props, key) => (
        <Text y={0} x={key * 2} key={key}>
          <Line {...props} />
        </Text>
      ))}
    </Trail>
  )
}

ReactCurse.render(<App2 />)
