import React from 'react'
import Text from './Text'
import useAnimation from '../hooks/useAnimation'

export default () => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

  const { ms, interpolate } = useAnimation(Infinity)
  const frame = Math.floor(interpolate(0, frames.length, 0, 500, ms % 500))
  const color = 255 - Math.abs(Math.floor(interpolate(-16, 16, 0, 1500, ms % 1500)))

  return <Text color={color}>{frames[frame]}</Text>
}

