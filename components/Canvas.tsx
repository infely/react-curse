import { Color } from '../screen'
import chunk from '../utils/chunk'
import Text from './Text'
import React, { useEffect, useMemo, useRef } from 'react'

class CanvasClass {
  // prettier-ignore
  MODES = {
    '1x1': { map: [[0x1]], table: [0x20, 0x88] },
    '1x2': { map: [[0x1], [0x2]], table: [0x20, 0x80, 0x84, 0x88] },
    '2x2': { map: [[0x1, 0x4], [0x2, 0x8]], table: [0x20, 0x98, 0x96, 0x8c, 0x9d, 0x80, 0x9e, 0x9b, 0x97, 0x9a, 0x84, 0x99, 0x90, 0x9c, 0x9f, 0x88] },
    '2x4': { map: [[0x1, 0x8], [0x2, 0x10], [0x4, 0x20], [0x40, 0x80]] }
  }

  mode: { w: number; h: number }
  multicolor: boolean
  w: number
  h: number
  buffer: Buffer
  colors: Color[]

  constructor(width: number, height: number, mode = { w: 1, h: 2 }) {
    this.mode = mode
    this.multicolor = mode.w === 1 && mode.h === 2
    this.w = Math.ceil(width / this.mode.w) * this.mode.w
    this.h = Math.ceil(height / this.mode.h) * this.mode.h

    const size = ((this.w / this.mode.w) * this.h) / this.mode.h
    this.buffer = Buffer.alloc(size)
    this.colors = [...Array(size * (this.multicolor ? 2 : 1))]
  }
  clear() {
    this.buffer.fill(0)
    this.colors.fill(0)
  }
  set(x: number, y: number, color: Color) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return
    const index = (this.w / this.mode.w) * Math.floor(y / this.mode.h) + Math.floor(x / this.mode.w)
    this.buffer[index] |= this.MODES[`${this.mode.w}x${this.mode.h}`].map[y % this.mode.h][x % this.mode.w]

    if (color) this.colors[this.multicolor ? this.w * y + x : index] = color
  }
  line(x0: number, y0: number, x1: number, y1: number, color: Color) {
    const dx = x1 - x0
    const dy = y1 - y0
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)
    let eps = 0
    const sx = dx > 0 ? 1 : -1
    const sy = dy > 0 ? 1 : -1
    if (adx > ady) {
      for (let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
        this.set(x, y, color)
        eps += ady
        if (eps << 1 >= adx) {
          y += sy
          eps -= adx
        }
      }
    } else {
      for (let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
        this.set(x, y, color)
        eps += adx
        if (eps << 1 >= ady) {
          x += sx
          eps -= ady
        }
      }
    }
  }
  render() {
    return [...this.buffer].map((i, index) => {
      const table = this.MODES[`${this.mode.w}x${this.mode.h}`].table
      let res = String.fromCharCode(table ? (i && 0x2500) + table[i] : 0x2800 + i)

      let colors: Color[] = []
      if (res !== ' ') {
        if (this.multicolor) {
          const y = Math.floor(index / this.w) * this.mode.h
          const x = (index % this.w) * this.mode.w
          const color1 = this.colors[this.w * y + x]
          const color2 = this.colors[this.w * (y + 1) + x]
          if (res === '\u2588' && color1 !== color2) {
            res = '\u2580'
            colors = [color1, color2]
          } else {
            colors = [color1 || color2]
          }
        } else {
          colors = [this.colors[index]]
        }
      }

      return [res, colors]
    })
  }
}

interface Point {
  x: number
  y: number
  color?: Color
}

export const Point = (_props: Point) => <></>

interface Line {
  x: number
  y: number
  dx: number
  dy: number
  color?: Color
}

export const Line = (_props: Line) => <></>

interface CanvasProps {
  mode?: { w: number; h: number }
  width: number
  height: number
  children: any[]
}

export default function Canvas({ mode = { w: 1, h: 2 }, width, height, children, ...props }: CanvasProps) {
  const canvas = useRef(new CanvasClass(width, height, mode))

  useEffect(() => {
    canvas.current = new CanvasClass(width, height, mode)
  }, [width, height, mode])

  const text = useMemo(() => {
    canvas.current.clear()

    React.Children.forEach(children, i => {
      if (i.type === Point) {
        const { x, y, color } = i.props
        canvas.current.set(x, y, color)
      } else if (i.type === Line) {
        const { x, y, dx, dy, color } = i.props
        canvas.current.line(x, y, dx, dy, color)
      }
    })

    return canvas.current.render()
  }, [children])

  return (
    <Text {...props}>
      {chunk(text, canvas.current.w / canvas.current.mode.w).map((line, y) => (
        <Text key={y} x={0} y={y}>
          {line.map(
            ([char, [color, background]], x: number) =>
              char !== ' ' && (
                <Text
                  key={x}
                  x={x}
                  y={0}
                  color={color ? color : undefined}
                  background={background ? background : undefined}
                >
                  {char}
                </Text>
              )
          )}
        </Text>
      ))}
    </Text>
  )
}
