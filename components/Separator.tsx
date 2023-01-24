import React from 'react'
import Text, { type TextProps } from './Text'
import useSize from '../hooks/useSize'

interface Separator extends TextProps {
  type?: 'vertical' | 'horizontal'
  height?: number
  width?: number
}

export default ({ type = 'vertical', height: _height, width: _width, ...props }: Separator) => {
  const size = _height === undefined || _width === undefined ? useSize() : undefined
  const height = _height ?? size!.height
  const width = _width ?? size!.width

  if (type === 'vertical' && height < 1) return null
  if (type === 'horizontal' && width < 1) return null

  return (
    <Text height={type === 'horizontal' ? 1 : undefined} width={type === 'vertical' ? 1 : undefined} {...props}>
      {type === 'vertical' &&
        [...Array(height)].map((_, key) => (
          <Text key={key} block>
            │
          </Text>
        ))}
      {type === 'horizontal' && '─'.repeat(width)}
    </Text>
  )
}
