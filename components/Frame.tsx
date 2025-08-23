import useChildrenSize from '../hooks/useChildrenSize'
import Text, { TextProps } from './Text'

const FRAMES = {
  single: '┌─┐│└┘',
  double: '╔═╗║╚╝',
  rounded: '╭─╮│╰╯'
} as const

export interface FrameProps extends TextProps {
  type?: 'single' | 'double' | 'rounded'
  height?: number
  width?: number
  children: React.ReactNode
}

export default function Frame({ type = 'single', height: _height, width: _width, children, ...props }: FrameProps) {
  const frames = FRAMES[type]

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
