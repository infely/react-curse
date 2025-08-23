import { Modifier } from '../screen'

export interface TextProps extends Modifier {
  readonly absolute?: boolean
  readonly x?: number | string
  readonly y?: number | string
  readonly width?: number | string
  readonly height?: number | string
  readonly block?: boolean
  readonly children?: React.ReactNode
}

export default function Text({ children, ...props }: TextProps) {
  // @ts-ignore
  return <text {...props}>{children}</text>
}
