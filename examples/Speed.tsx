import React, { useEffect, useState } from 'react'
import ReactCurse, { Text, useExit, useInput } from '..'

const TEXT = ''
const width = process.stdout.columns
const height = process.stdout.rows

const rand = () => {
  return [...Array(128)].map(_ => [ // 512
    width / 2,
    0,
    Math.floor(Math.random() * 256),
    Math.random() * 2 - 1, // 3 - 1.5
    Math.random() * 1      // 1.5
  ])
}

const App = () => {
  const [texts, setTexts] = useState(rand())

  useEffect(() => {
    const interval = setInterval(() => {
      setTexts(texts =>
        texts
          .map(([x, y, color, dx, dy]) => {
            x += dx
            y += dy
            if (x >= width - 1 - TEXT.length || x <= 0) dx = -dx
            if (y >= height - 1 || y <= 0) {
              dy = -dy
              if (dy < 0) dy *= 0.9
            }
            return [x, y, color, dx, dy]
          })
          .filter(i => Math.round(i[4] * 10))
      )
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [])

  useInput((input: string) => {
    if (input === 'q') useExit()
  })

  return (
    <>
      {texts.map(([x, y, color], key) => (
        <Text key={key} x={Math.round(x)} y={Math.round(y)} color={color}>
          {TEXT}
        </Text>
      ))}
    </>
  )
}

ReactCurse.render(<App />)
