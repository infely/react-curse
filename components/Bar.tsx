import React from 'react'
import Text, { type TextProps } from './Text'

const getSize = (offset: number, size: number) => {
  offset = Math.round(offset * 8)
  size = Math.round(size * 8)
  if (offset < 0) {
    size += offset
    offset = 0
  }
  size = Math.max(0, size)

  return [offset, size]
}

const getSections = (offset: number, size: number) => [
  size >= 8 || ((offset + size) % 8 === 0 && size > 0 && size < 8),
  size >= 8,
  (size >= 8 || (offset % 8 === 0 && size < 8)) && (offset + size) % 8 !== 0
]

const Vertical = (y: number, height: number, props: object) => {
  const [offset, size] = getSize(y, height)
  const sections = getSections(offset, size)

  const char = (value: number) => {
    if (value > 7) return String.fromCharCode(0x2588)
    return String.fromCharCode(0x2588 - Math.min(8, value))
  }

  return (
    <Text {...props} y={Math.floor(offset / 8)}>
      {sections[0] && <Text block>{char(offset % 8)}</Text>}
      {sections[1] &&
        [...Array(Math.floor(((offset % 8) + size) / 8) - 1)].map((_, key) => (
          <Text key={key} block>
            {char(8)}
          </Text>
        ))}
      {sections[2] && <Text inverse>{char((offset + size) % 8)}</Text>}
    </Text>
  )
}

const Horizontal = (x: number, width: number, props: object) => {
  const [offset, size] = getSize(x, width)
  const sections = getSections(offset, size)

  const char = (value: number) => {
    if (value <= 0) return ' '
    return String.fromCharCode(0x2590 - Math.min(8, value))
  }

  return (
    <Text {...props} x={Math.floor(offset / 8)}>
      {sections[0] && <Text inverse>{char(offset % 8)}</Text>}
      {sections[1] && <Text>{char(8).repeat(Math.floor(((offset % 8) + size) / 8) - 1)}</Text>}
      {sections[2] && <Text>{char((offset + size) % 8)}</Text>}
    </Text>
  )
}

interface Bar extends TextProps {
  type: 'vertical' | 'horizontal'
  y?: number
  x?: number
  height?: number
  width?: number
}

export default ({ type = 'vertical', y, x, height, width, ...props }: Bar): JSX.Element | null => {
  if (type === 'vertical') return Vertical(y || 0, height || 0, { x, width, ...props })
  if (type === 'horizontal') return Horizontal(x || 0, width || 0, { y, height, ...props })

  return null
}
