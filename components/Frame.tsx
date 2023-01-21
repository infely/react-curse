import React from 'react'
import Text, { TextProps } from './Text'
import useChildrenSize from '../hooks/useChildrenSize'

interface Frame extends TextProps {
  children: any
  type?: 'single' | 'double' | 'rounded'
  width?: number
  height?: number
}

export default ({ children, type = 'single', width, height, ...props }: Frame) => {
  const frames = {
    single: '┌─┐│└┘',
    double: '╔═╗║╚╝',
    rounded: '╭─╮│╰╯'
  }[type]

  if (width === undefined || height === undefined) {
    const childrenSize = useChildrenSize(children)
    if (width === undefined) width = childrenSize.width
    if (height === undefined) height = childrenSize.height
  }

  const { color } = props

  return (
    <Text {...props}>
      <Text color={color} block>
        {frames[0]}
        {frames[1].repeat(width as number)}
        {frames[2]}
      </Text>
      {[...Array(height)].map((_, key) => (
        <Text key={key} block>
          <Text color={color}>{frames[3]}</Text>
          {' '.repeat(width as number)}
          <Text color={color}>{frames[3]}</Text>
        </Text>
      ))}
      <Text y={1} x={1} block>
        {children}
      </Text>
      <Text y={(height as number) + 1} color={color}>
        {frames[4]}
        {frames[1].repeat(width as number)}
        {frames[5]}
      </Text>
    </Text>
  )
}
