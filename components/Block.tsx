import React from 'react'
import Text, { type TextProps } from './Text'
import useSize from '../hooks/useSize'

interface Block extends TextProps {
  width?: number | undefined
  align?: 'left' | 'center' | 'right'
  children: any
}

export default ({ width = undefined, align = 'left', children, ...props }: Block) => {
  const handle = (line: any, key: any = undefined) => {
    if (typeof line === 'object') return line
    if (line === '\n') return

    let x: number | string = 0
    switch (align) {
      case 'center':
        width ??= useSize().width
        x = Math.round(width / 2 - line.length / 2)
        break
      case 'right':
        x = `100%-${line.length}`
        break
    }
    return (
      <Text key={key} x={x} {...props} block>
        {line}
      </Text>
    )
  }

  if (Array.isArray(children)) return children.map(handle)
  return handle(children)
}
