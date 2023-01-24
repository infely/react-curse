import React, { useState } from 'react'
import Text, { type TextProps } from './Text'
import Scrollbar from './Scrollbar'
import useChildrenSize from '../hooks/useChildrenSize'
import useInput from '../hooks/useInput'
import useSize from '../hooks/useSize'

interface View extends TextProps {
  focus?: boolean
  height?: number
  scrollbar?: boolean
  children: any
}

export default ({ focus = true, height: _height, scrollbar = undefined, children, ...props }: View) => {
  const height = _height ?? useSize().height
  const [yo, setYo] = useState(0)
  const { height: length } = useChildrenSize(children)

  useInput(
    (input: string) => {
      if (!focus) return

      if (['k', '\x1b\x5b\x41' /* up */].includes(input) && yo > 0) setYo(yo - 1)
      if (['j', '\x1b\x5b\x42' /* down */].includes(input) && yo < length - height) setYo(yo + 1)
      if (['g', '\x1b\x5b\x31\x7e' /* home */].includes(input) && yo > 0) setYo(0)
      if (['G', '\x1b\x5b\x34\x7e' /* end */].includes(input) && yo < length - height) setYo(length - height)
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
