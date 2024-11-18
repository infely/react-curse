import useInput from '../hooks/useInput'
import useSize from '../hooks/useSize'
import { getYO, inputHandler, type ListBase, type ListPos } from './List'
import Scrollbar from './Scrollbar'
import Text from './Text'
import React, { useEffect, useMemo, useState } from 'react'

const getX = (index: number, widths: number[]) => {
  const [x1, x2] = widths.reduce((acc, i, k) => [acc[0] + (k < index ? i : 0), acc[1] + (k <= index ? i : 0)], [0, 0])
  return { x1, x2 }
}

const getXO = (offsetX: number, limit: number, x1: number, x2: number) => {
  if (x1 <= offsetX) return x1
  if (x2 >= offsetX + limit) return x2 - limit + 1
  return offsetX
}

interface ListTableProps extends ListBase {
  mode?: 'cell' | 'row'
  head?: any[]
  renderHead?: (_: any) => React.ReactNode
  data?: any[][]
}

export default function List({
  mode = 'cell',
  focus = true,
  initialPos = { y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 },
  height: _height = undefined,
  width: _width = undefined,
  head = [''],
  renderHead = (_: any) => <Text></Text>,
  data = [['']],
  renderItem = (_: any) => <Text></Text>,
  scrollbar = undefined,
  scrollbarBackground = undefined,
  scrollbarColor = undefined,
  vi = true,
  pass = undefined,
  onChange = (_pos: ListPos) => {},
  onSubmit = (_pos: ListPos) => {}
}: ListTableProps) {
  const size = _height === undefined || _width === undefined ? useSize() : undefined
  const height = _height ?? size!.height
  const width = _width ?? size!.width

  const [pos, setPos] = useState<ListPos>({ ...{ y: 0, x: 0, yo: 0, xo: 0, x1: 0, x2: 0 }, ...initialPos })

  const isScrollbarRequired = useMemo(() => {
    return scrollbar === undefined ? data.length > height - 1 : scrollbar
  }, [scrollbar, data.length, height])

  const widths = useMemo(() => {
    const widths = data
      .reduce(
        (acc: number[], row: string[]) => {
          row.forEach((i, k) => (acc[k] = Math.max(acc[k], (i?.toString() || 'null').length)))
          return acc
        },
        head.map((i: any) => i.toString().length)
      )
      .map((i, index) => i + (index <= head.length - 2 ? 2 : 0))

    const sum = widths.reduce((acc, i) => acc + i, 0)
    if (sum >= width - 1) return widths.map(i => Math.min(32, i))

    // const left = width - sum - 2
    // if (sum > 0) widths[widths.length - 1] += left

    return widths
  }, [data, head, width])

  const isCropped = useMemo(() => {
    const sum = widths.reduce((acc, i) => acc + i, 0)
    return sum - pos.xo >= width + (isScrollbarRequired ? -1 : 0)
  }, [widths, pos.xo, width, isScrollbarRequired])

  const dataFiltered = useMemo(() => {
    return data.filter((_: any, index: number) => index >= pos.yo && index < height + pos.yo)
  }, [data, pos.yo, height])

  useEffect(() => {
    let newPos: undefined | ListPos
    let { y, x } = initialPos
    if (y > 0 && y >= data.length) {
      y = data.length - 1
      onChange({ ...pos, y })
    }
    if (y !== pos.y) {
      y = Math.max(0, y)
      newPos = { ...(newPos || pos), y, yo: getYO(pos.yo, height - 1, y) }
    }
    if (initialPos.xm) {
      let acc = 0
      x = widths.map(i => (acc += i)).findIndex(i => i >= Math.min(acc, (initialPos.xm ?? 0) + pos.xo))
    }
    if (x > 0 && x >= head.length) {
      x = head.length - 1
      onChange({ ...pos, x })
    }
    if (x !== pos.x) {
      const { x1, x2 } = getX(x, widths)
      newPos = { ...(newPos || pos), x, xo: getXO(pos.xo, width + (isScrollbarRequired ? -1 : 0), x1, x2) }
    }
    if (newPos) {
      setPos(newPos)
      onChange(newPos)
    }
  }, [initialPos.y, initialPos.x, initialPos.xm])

  useEffect(() => {
    if (pos.y > 0 && head.length > 0 && pos.y > data.length - 1) {
      const y = Math.max(0, data.length - 1)
      const newPos = { ...pos, y, yo: getYO(pos.yo, data.length, y) }
      setPos(newPos)
      onChange(newPos)
    }
    if (pos.x > 0 && head.length > 0 && pos.x > head.length - 1) {
      const newPos = { ...pos, x: head.length - 1 }
      setPos(newPos)
      onChange(newPos)
    }
  }, [head, data])

  useInput(
    (input: string) => {
      if (!focus) return

      inputHandler(vi, pos, setPos, height - 1, data.length, onChange)(input)

      let x: undefined | number
      switch (mode) {
        case 'cell':
          if (((vi && input === 'h') || input === '\x1b\x5b\x44') /* left */ && pos.x > 0) x = pos.x - 1
          if (((vi && input === 'l') || input === '\x1b\x5b\x43') /* right */ && pos.x < head.length - 1) x = pos.x + 1
          if (vi && input === '^' && pos.x > 0) x = 0
          if (vi && input === '$' && pos.x < head.length - 1) x = head.length - 1
          if (x !== undefined) {
            const { x1, x2 } = getX(x, widths)
            const xo = getXO(pos.xo, width + (isScrollbarRequired ? -1 : 0), x1, x2)
            const newPos = { ...pos, x, xo, x1, x2 }
            setPos(newPos)
            onChange(newPos)
          }
          break
        case 'row':
          if (((vi && input === 'h') || input === '\x1b\x5b\x44') /* left */ && pos.x > 0) x = pos.x - 1
          if (((vi && input === 'l') || input === '\x1b\x5b\x43') /* right */ && pos.x < head.length - 1) x = pos.x + 1
          if (x !== undefined) {
            const { x1, x2 } = getX(x, widths)
            const newPos = { ...pos, x, xo: x1, x1, x2 }
            setPos(newPos)
            onChange(newPos)
          }
          break
      }

      if (input === '\x0d' /* cr */) onSubmit({ ...pos, ...getX(pos.x, widths) })
    },
    [focus, vi, pos, width, height, head, data, widths, isScrollbarRequired, setPos, onChange, onSubmit]
  )

  return (
    <Text width={width} height={height}>
      <Text x={-pos.xo} height={1}>
        {renderHead({
          focus,
          item: head,
          widths,
          pass
        })}
      </Text>
      <Text y={1} x={-pos.xo}>
        {dataFiltered.map((item: any, index: number) => (
          <Text key={index} height={1} block>
            {renderItem({
              mode,
              focus,
              item,
              y: pos.y,
              x: pos.x,
              widths,
              index: index + pos.yo,
              pass
            })}
          </Text>
        ))}
      </Text>
      {isCropped && (
        <Text y={0} x="100%-1" dim>
          ~
        </Text>
      )}
      {isScrollbarRequired && (
        <Text y={1} x="100%-1">
          <Scrollbar
            offset={pos.yo}
            limit={height - 1}
            length={data.length}
            background={scrollbarBackground}
            color={scrollbarColor}
          />
        </Text>
      )}
    </Text>
  )
}
