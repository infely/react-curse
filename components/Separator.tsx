import React from 'react'
import Text, { type TextProps } from './Text'

interface Separator extends TextProps {
  type?: 'vertical' | 'horizontal'
  width?: number
  height?: number
}

export default ({ type = 'vertical', width, height, ...props }: Separator) => {
  if (type === 'vertical' && (height as number) < 1) return null
  if (type === 'horizontal' && (width as number) < 1) return null

  return (
    <Text height={type === 'horizontal' ? 1 : undefined} width={type === 'vertical' ? 1 : undefined} {...props}>
      {type === 'vertical' &&
        [...Array(height)].map((_, key) => (
          <Text key={key} block>
            │
          </Text>
        ))}
      {type === 'horizontal' && '─'.repeat(width as number)}
    </Text>
  )
}
