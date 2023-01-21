import React, { useMemo } from 'react'
import chunk from '../utils/chunk'
import Text, { type TextProps } from './Text'

const FONT =
  'BAQEAAQAqq4KDgoA6oLkKOpAZIRAoOAAKERERCgAAETuRKAAAAAOAECAAgQEBEgA5KykpO4A7iLugu4ArqjuIi4A7oLiouIA7qruou4AAEQAAEQIIE6ATiAAjkIkQIQATqqO6koA7qjIqO4AzqisqM4A7ojIio4ArqTkpK4A6iosquoAio6KiuoAzqqqqq4A7qrqio4C7qjOoq4A6kpKSk4AqqqqrkoAqqpEpKQA5iREhOYAjERERCwAQKAAAA4AhkQIBAYATERCREwAUKAAAAAA'

const letters = chunk(Buffer.from(FONT, 'base64'), 6)

const Letter = ({ children }) => {
  const text = useMemo(() => {
    let code = children.toUpperCase().charCodeAt(0)
    if (code >= 123 && code <= 126) code -= 26
    const font = letters[Math.floor((code - 32) / 2)]
    if (!font) return

    const bits = code % 2 === 0 ? 4 : 0
    return chunk(font, 2)
      .map(([top, bot]) => {
        return [3, 2, 1, 0]
          .map(i => {
            const b = Math.pow(2, i + bits)
            const code = 0 | (top & b && 0x04) | (bot & b && 0x08)
            return code ? String.fromCharCode(0x257c + code) : ' '
          })
          .join('')
      })
      .join('\n')
  }, [children])

  return <>{text}</>
}

interface Banner extends TextProps {
  children: string
}

export default ({ children, ...props }: Banner): JSX.Element | null => {
  if (children === undefined || children === null) return null

  const lines = children.toString().split('\n')
  const length = Math.max(...lines.map((i: string) => i.length))

  return (
    <Text {...props} height={lines.length * 3} width={length * 4}>
      {lines.map((line: string, key: number) => (
        <Text key={key} x={0} y={key * 3}>
          {line.split('').map((char: string, key: number) => (
            <Text key={key} x={key * 4} y={0}>
              <Letter>{char}</Letter>
            </Text>
          ))}
        </Text>
      ))}
    </Text>
  )
}
