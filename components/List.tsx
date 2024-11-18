import useInput from '../hooks/useInput'
import useSize from '../hooks/useSize'
import { Color } from '../screen'
import Scrollbar from './Scrollbar'
import Text from './Text'
import React, { useEffect, useMemo, useState } from 'react'

export const getYO = (offset: number, limit: number, y: number) => {
  if (offset <= y - limit) return y - limit + 1
  if (offset > y) return y
  return offset
}

export const inputHandler =
  (
    vi: boolean,
    pos: ListPos,
    setPos: (_: any) => void,
    height: number,
    dataLength: number,
    onChange: (_: any) => void
  ) =>
  (input: string) => {
    let y: undefined | number
    let yo: undefined | number
    if (((vi && input === 'k') || input === '\x1b\x5b\x41') /* up */ && pos.y > 0) y = pos.y - 1
    if (((vi && input === 'j') || input === '\x1b\x5b\x42') /* down */ && pos.y < dataLength - 1) y = pos.y + 1
    if (((vi && input === '\x02') /* C-b */ || input === '\x1b\x5b\x35\x7e') /* pageup */ && pos.y > 0)
      y = Math.max(0, pos.y - height)
    if (((vi && input === '\x06') /* C-f */ || input === '\x1b\x5b\x36\x7e') /* pagedown */ && pos.y < dataLength - 1)
      y = Math.min(dataLength - 1, pos.y + height)
    if (vi && input === '\x15' /* C-u */ && pos.y > 0) y = Math.max(0, pos.y - Math.floor(height / 2))
    if (vi && input === '\x04' /* C-d */ && pos.y < dataLength - 1)
      y = Math.min(dataLength - 1, pos.y + Math.floor(height / 2))
    if (((vi && input === 'g') || input === '\x1b\x5b\x31\x7e') /* home */ && pos.y > 0) y = 0
    if (((vi && input === 'G') || input === '\x1b\x5b\x34\x7e') /* end */ && pos.y < dataLength - 1) y = dataLength - 1
    if (y !== undefined) yo = getYO(pos.yo, height, y)

    if (vi && input === 'H') y = pos.yo
    if (vi && input === 'M') y = pos.yo + Math.floor(height / 2)
    if (vi && input === 'L') y = pos.yo + height - 1

    if (y !== undefined) {
      let newPos = { ...pos, y }
      if (yo !== undefined) newPos = { ...newPos, yo }
      setPos(newPos)
      onChange(newPos)
    }
  }

export interface ListPos {
  y: number
  x: number
  yo: number
  xo: number
  x1: number
  x2: number
  xm?: number
}

export interface ListBase {
  focus?: boolean
  initialPos?: ListPos
  height?: number
  width?: number
  renderItem?: (_: any) => React.ReactNode
  scrollbar?: boolean
  scrollbarBackground?: Color
  scrollbarColor?: Color
  vi?: boolean
  pass?: any
  onChange?: (pos: ListPos) => void
  onSubmit?: (pos: ListPos) => void
}

interface ListProps extends ListBase {
  data?: any[]
}

export default function List({
  focus = true,
  initialPos = { y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 },
  data = [''],
  renderItem = (_: any) => <Text></Text>,
  height: _height = undefined,
  width: _width = undefined,
  scrollbar = undefined,
  scrollbarBackground = undefined,
  scrollbarColor = undefined,
  vi = true,
  pass = undefined,
  onChange = (_: ListPos) => {},
  onSubmit = (_: ListPos) => {}
}: ListProps) {
  const size = _height === undefined || _width === undefined ? useSize() : undefined
  const height = _height ?? size!.height
  const width = _width ?? size!.width

  const [pos, setPos] = useState<ListPos>({ ...{ y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 }, ...initialPos })

  const isScrollbarRequired = useMemo(() => {
    return scrollbar === undefined ? data.length > height : scrollbar
  }, [scrollbar, data.length, height])

  useEffect(() => {
    let newPos: undefined | ListPos
    let { y } = initialPos
    if (y > 0 && y >= data.length) {
      y = data.length - 1
      onChange({ ...pos, y })
    }
    if (y !== pos.y) {
      y = Math.max(0, y)
      newPos = { ...(newPos || pos), y, yo: getYO(pos.yo, height - 1, y) }
    }
    if (newPos) {
      setPos(newPos)
      onChange(newPos)
    }
  }, [initialPos.y])

  useEffect(() => {
    if (pos.y > 0 && pos.y > data.length - 1) {
      const y = Math.max(0, data.length - 1)
      const newPos = { ...pos, y, yo: getYO(pos.yo, data.length, y) }
      setPos(newPos)
      onChange(newPos)
    }
  }, [data])

  useInput(
    (input: string) => {
      if (!focus) return

      inputHandler(vi, pos, setPos, height, data.length, onChange)(input)

      if (input === '\x0d' /* cr */) onSubmit(pos)
    },
    [focus, vi, pos, setPos, height, data, onChange, onSubmit]
  )

  return (
    <Text width={width} height={height}>
      {data
        .filter((_: any, index: number) => index >= pos.yo && index < height + pos.yo)
        .map((row: any, index: number) => (
          <Text key={index} height={1} block>
            {renderItem({
              focus,
              item: row,
              selected: index + pos.yo === pos.y,
              pass
            })}
          </Text>
        ))}
      {isScrollbarRequired && (
        <Text y={0} x="100%-1">
          <Scrollbar
            offset={pos.yo}
            limit={height}
            length={data.length}
            background={scrollbarBackground}
            color={scrollbarColor}
          />
        </Text>
      )}
    </Text>
  )
}
