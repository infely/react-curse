import React from 'react'
import Text, { type TextProps } from './Text'
import useAnimation from '../hooks/useAnimation'

interface Spinner extends TextProps {
  children?: any
}

export default ({ children, ...props }: Spinner) => {
  children ??= ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const { ms, interpolate } = useAnimation(Infinity)
  const frame = Math.floor(interpolate(0, children.length, 0, 500, ms % 500))
  const color = 255 - Math.abs(Math.floor(interpolate(-16, 16, 0, 1500, ms % 1500)))

  return (
    <Text color={color} {...props}>
      {children[frame]}
    </Text>
  )
}
