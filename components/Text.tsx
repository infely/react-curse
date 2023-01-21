import React, { type PropsWithChildren } from 'react'
import { Modifier } from '../screen'

export interface TextProps extends Modifier {
  readonly absolute?: boolean
  readonly x?: number | string
  readonly y?: number | string
  readonly width?: number | string
  readonly height?: number | string
  readonly block?: boolean
}

export default ({ children, ...props }: PropsWithChildren<TextProps>) => {
  // @ts-ignore
  return <text {...props}>{children}</text>
}
