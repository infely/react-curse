import useAnimation from '../hooks/useAnimation'
import Text, { TextProps } from './Text'

export interface SpinnerProps extends TextProps {
  children?: string
}

export default function Spinner({ children, ...props }: SpinnerProps) {
  const frames = children ? children.split('') : ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const { ms, interpolate } = useAnimation(Infinity)
  const frame = Math.floor(interpolate(0, frames.length, 0, 500, ms % 500))
  const color = 255 - Math.abs(Math.floor(interpolate(-16, 16, 0, 1500, ms % 1500)))

  return (
    <Text color={color} {...props}>
      {frames[frame]}
    </Text>
  )
}
