import React from 'react'
import Text, { type TextProps } from './Text'
import useChildrenSize from '../hooks/useChildrenSize'

interface Frame extends TextProps {
  children: any
  type?: 'single' | 'double' | 'rounded'
  height?: number
  width?: number
}

export default ({ children, type = 'single', height: _height, width: _width, ...props }: Frame) => {
  const frames = {
    single: '┌─┐│└┘',
    double: '╔═╗║╚╝',
    rounded: '╭─╮│╰╯'
  }[type]

  const size = _height === undefined || _width === undefined ? useChildrenSize(children) : undefined
  const height = _height ?? size!.height
  const width = _width ?? size!.width

  const { color } = props

  return (
    <Text {...props}>
      <Text color={color} block>
        {frames[0]}
        {frames[1].repeat(width)}
        {frames[2]}
      </Text>
      {[...Array(height)].map((_, key) => (
        <Text key={key} block>
          <Text color={color}>{frames[3]}</Text>
          {' '.repeat(width)}
          <Text color={color}>{frames[3]}</Text>
        </Text>
      ))}
      <Text y={1} x={1} block>
        {children}
      </Text>
      <Text y={height + 1} color={color}>
        {frames[4]}
        {frames[1].repeat(width)}
        {frames[5]}
      </Text>
    </Text>
  )
}
