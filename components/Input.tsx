import React, { useEffect, useMemo, useRef, useState } from 'react'
import Renderer from '../renderer'
import Text, { type TextProps } from './Text'
import useInput from '../hooks/useInput'
import { Color } from '../screen'

const mutate = (value: string, pos: number, str: string, multiline: boolean): [string, number, string | null] => {
  const edit = (value: string, pos: number, callback: (string: string) => string) => {
    const left = callback(value.substring(0, pos))
    const right = value.substring(pos)
    return [left, right].join('')
  }

  const arr = Renderer.input.parse(str) // str.split('')
  for (const input of arr) {
    switch (input) {
      case '\x01': // C-a
      case '\x1b\x5b\x31\x7e': // home
        if (pos > 0) pos = 0
        break
      case '\x05': // C-e
      case '\x1b\x5b\x34\x7e': // end
        if (pos < value.length) pos = value.length
        break
      case '\x02': // C-b
      case '\x1b\x5b\x44': // left
        if (pos > 0) pos -= 1
        break
      case '\x06': // C-f
      case '\x1b\x5b\x43': // right
        if (pos < value.length) pos += 1
        break
      case '\x1b': // esc
        return [value, pos, 'cancel']
      case '\x04': // C-d
      case '\x0d': // cr
        if (input === '\x0d' && multiline) {
          value = edit(value, pos, i => i + '\n')
          pos += 1
          break
        }
        return [value, pos, 'submit']
      case '\x08': // C-h
      case '\x7f': // backspace
        if (pos < 1) break
        value = edit(value, pos, i => i.substring(0, i.length - 1))
        pos -= 1
        break
      case '\x15': // C-u
        if (pos < 1) break
        value = edit(value, pos, () => '')
        pos = 0
        break
      case '\x0b': // C-k
        if (pos > value.length - 1) break
        value = value.substring(0, pos)
        break
      case '\x1b\x62': // M-b
      case '\x17': // C-w
        if (pos < 1) break
        const index = value.substring(0, pos).trimEnd().lastIndexOf(' ')
        if (input === '\x17') value = edit(value, pos, i => (index !== -1 ? i.substring(0, index + 1) : ''))
        pos = Math.max(0, index + 1)
        break
      case '\x1b\x66': // M-f
        if (pos > value.length - 1) break
        const nextWordIndex = value.substring(pos).match(/\s(\w)/)?.index ?? -1
        pos = nextWordIndex === -1 ? value.length : pos + nextWordIndex + 1
        break
      case '\x1b\x64': // M-d
        const nextEndIndex = value.substring(pos).match(/\w(\b)/)?.index ?? -1
        value = value.substring(0, pos) + (nextEndIndex !== -1 ? value.substring(pos + nextEndIndex + 1) : '')
        break
      case '\x1b\x5b\x41': // up
        if (!multiline) break

        const currentLine = value.substring(0, pos).lastIndexOf('\n')
        if (currentLine === -1) break

        let targetLine = value.substring(0, currentLine).lastIndexOf('\n')
        pos = targetLine + Math.min(pos - currentLine, currentLine - targetLine)
        break
      case '\x1b\x5b\x42': // down
        if (!multiline) break

        let targetLine_ = value.substring(pos).indexOf('\n')
        if (targetLine_ === -1) break

        targetLine_ += pos + 1
        let nextLine = value.substring(targetLine_).indexOf('\n')
        nextLine = (nextLine !== -1 ? targetLine_ + nextLine : value.length) + 1
        const currentLine_ = value.substring(0, pos).lastIndexOf('\n')
        pos = targetLine_ + Math.min(pos - currentLine_ - 1, nextLine - targetLine_ - 1)
        break
      default:
        if (input.charCodeAt(0) < 32) break
        value = edit(value, pos, i => i + input)
        pos += 1
    }
  }
  return [value, pos, null]
}

interface Input extends TextProps {
  focus?: boolean
  type?: 'text' | 'password' | 'hidden'
  initialValue?: string
  cursorBackground?: Color
  onCancel?: () => void
  onChange?: (_: any) => void
  onSubmit?: (_: any) => void
}

export default ({
  focus = true,
  type = 'text',
  initialValue = '',
  cursorBackground = undefined,
  onCancel = () => {},
  onChange = (_: string) => {},
  onSubmit = (_: string) => {},
  width = undefined,
  height = undefined,
  ...props
}: Input) => {
  const [value, setValue] = useState(initialValue)
  const [pos, setPos] = useState(initialValue.length)
  const offset = useRef({ y: 0, x: 0 })

  const multiline = useMemo(() => {
    return typeof height === 'number' && height > 1
  }, [height])

  useInput(
    (_, raw) => {
      if (raw === undefined) return
      if (!focus) return

      const [valueNew, posNew, action] = mutate(value, pos, raw(), multiline)
      switch (action) {
        case 'cancel':
          onCancel()
          break
        case 'submit':
          onSubmit(valueNew)
          setValue('')
          setPos(0)
          break
        default:
          setValue(valueNew)
          setPos(posNew)
      }
    },
    [focus, value, pos, onCancel, onSubmit]
  )

  useEffect(() => {
    onChange(value)
  }, [value])

  if (type === 'hidden') return null

  const text = useMemo(() => {
    if (type === 'password') return '*'.repeat(value.length)
    return value
  }, [value, type])

  const { y: yo, x: xo } = useMemo(() => {
    if (typeof width !== 'number') return offset.current

    let posLine = pos
    let valueLine = value
    if (multiline && typeof height === 'number') {
      const line = value.substring(0, pos).split('\n').length - 1
      if (offset.current.y < line - height + 1) offset.current.y = line - height + 1
      if (offset.current.y > line) offset.current.y = line

      const currentLine = value.substring(0, pos).lastIndexOf('\n')
      posLine = pos - (currentLine !== -1 ? currentLine + 1 : 0)
      const nextLine = value.substring(pos).indexOf('\n')
      valueLine = value.substring(currentLine + 1, nextLine !== -1 ? pos + nextLine : value.length)
    }

    if (!multiline && offset.current.x + valueLine.length + 1 > width)
      offset.current.x = Math.max(0, valueLine.length - width + 1)
    if (offset.current.x < posLine - width + 1) offset.current.x = posLine - width + 1
    if (offset.current.x > posLine) offset.current.x = posLine

    return offset.current
  }, [value, pos, width])

  return (
    <Text height={height} width={width} {...props}>
      <Text y={-yo} x={-xo}>
        {text.substring(0, pos)}
        {focus && (
          <>
            <Text inverse={cursorBackground === undefined} background={cursorBackground}>
              {(text[pos] !== '\n' && text[pos]) || ' '}
            </Text>
            {text[pos] === '\n' && '\n'}
          </>
        )}
        {text.length > pos && text.substring(pos + (focus ? 1 : 0))}
      </Text>
    </Text>
  )
}
