import React from 'react'
import Text from './Text'
import Bar from './Bar'
import { Color } from '../screen'

interface Scrollbar {
  type?: 'vertical' | 'horizontal'
  offset: number
  limit: number
  length: number
  background?: Color
  color?: Color
}

export default ({ type = 'vertical', offset, limit, length, background = undefined, color = undefined }: Scrollbar) => {
  length ||= limit
  offset = (limit / length) * offset
  let size = limit / (length / limit)
  if (size < 1) {
    offset *= (length - limit / size) / (length - limit)
    size = 1
  }

  return (
    <Text background={background} height={type === 'vertical' ? limit : 1} width={type === 'horizontal' ? limit : 1}>
      <Bar
        type={type}
        y={type === 'vertical' ? offset : undefined}
        x={type === 'horizontal' ? offset : undefined}
        height={type === 'vertical' ? size : undefined}
        width={type === 'horizontal' ? size : undefined}
        color={color}
      />
    </Text>
  )
}
