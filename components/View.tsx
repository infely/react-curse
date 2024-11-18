import useChildrenSize from '../hooks/useChildrenSize'
import useInput from '../hooks/useInput'
import useSize from '../hooks/useSize'
import Scrollbar from './Scrollbar'
import Text, { type TextProps } from './Text'
import React, { useState } from 'react'

interface ViewProps extends TextProps {
  focus?: boolean
  height?: number
  scrollbar?: boolean
  vi?: boolean
  children: any
}

export default function View({
  focus = true,
  height: _height,
  scrollbar = undefined,
  vi = true,
  children,
  ...props
}: ViewProps) {
  const height = _height ?? useSize().height
  const [yo, setYo] = useState(0)
  const { height: length } = useChildrenSize(children)

  useInput(
    (input: string) => {
      if (!focus) return

      if (((vi && input === 'k') || input === '\x1b\x5b\x41') /* up */ && yo > 0) setYo(yo - 1)
      if (((vi && input === 'j') || input === '\x1b\x5b\x42') /* down */ && yo < length - height) setYo(yo + 1)
      if (((vi && input === '\x02') /* C-b */ || input === '\x1b\x5b\x35\x7e') /* pageup */ && yo > 0)
        setYo(Math.max(0, yo - height))
      if (((vi && input === '\x06') /* C-f */ || input === '\x1b\x5b\x36\x7e') /* pagedown */ && yo < length - height)
        setYo(Math.min(length - height, yo + height))
      if (vi && input === '\x15' /* C-u */ && yo > 0) setYo(Math.max(0, yo - Math.floor(height / 2)))
      if (vi && input === '\x04' /* C-d */ && yo < length - height)
        setYo(Math.min(length - height, yo + Math.floor(height / 2)))
      if (((vi && input === 'g') || input === '\x1b\x5b\x31\x7e') /* home */ && yo > 0) setYo(0)
      if (((vi && input === 'G') || input === '\x1b\x5b\x34\x7e') /* end */ && yo < length - height)
        setYo(length - height)
    },
    [focus, yo, length, height]
  )

  const isScrollbarRequired = scrollbar === undefined ? length > height : scrollbar

  return (
    <Text height={height} {...props}>
      <Text y={-yo}>{children}</Text>
      {isScrollbarRequired && (
        <Text y={0} x="100%-1">
          <Scrollbar offset={yo} limit={height} length={length} />
        </Text>
      )}
    </Text>
  )
}
