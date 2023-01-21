import { type ReactElement } from 'react'
import { type TextProps } from './components/Text'
import { type TextElement } from './reconciler'

export type Color =
  | number
  | string
  | 'Black'
  | 'Red'
  | 'Green'
  | 'Yellow'
  | 'Blue'
  | 'Magenta'
  | 'Cyan'
  | 'White'
  | 'BrightBlack'
  | 'BrightRed'
  | 'BrightGreen'
  | 'BrightYellow'
  | 'BrightBlue'
  | 'BrightMagenta'
  | 'BrightCyan'
  | 'BrightWhite'

export interface Modifier {
  background?: Color
  color?: Color
  clear?: boolean
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  blinking?: boolean
  inverse?: boolean
  strikethrough?: boolean
}

export type Char = [string, Modifier]

interface Bounds {
  x: number
  y: number
  x1: number
  y1: number
  x2: number
  y2: number
}

class Screen {
  buffer: Char[][]
  cursor = { x: 0, y: 0 }
  size = { x1: 0, y1: 0, x2: 0, y2: 0 }
  constructor() {
    this.buffer = this.generateBuffer()
  }
  generateBuffer() {
    this.size = { x1: 0, y1: 0, x2: process.stdout.columns, y2: process.stdout.rows }
    return [...Array(this.size.y2)].map(() => [...Array(this.size.x2)].map(() => [' ', {}] as Char))
  }
  clearBuffer() {
    this.buffer = this.generateBuffer()
    this.cursor = { x: 0, y: 0 }
  }
  render(elements: TextElement[]) {
    this.clearBuffer()
    this.renderElement(elements, { ...this.cursor, ...this.size })
  }
  stringAt(value: string, limit: number) {
    const percent = parseFloat(value)
    let diff = ''

    const index = value.search(/%[+-]\d+$/)
    if (index !== -1) diff = value.substring(index + 1)
    if (!value.endsWith('%' + diff) || isNaN(percent)) throw new Error('must be percent')

    return Math.round((limit / 100) * percent) + parseInt(diff || '0')
  }
  renderElement(element: ReactElement | ReactElement[] | any, prevBounds: Bounds, prevProps: TextProps = {}) {
    if (Array.isArray(element)) return element.forEach(i => this.renderElement(i, prevBounds, prevProps))

    const { children, ...props } = element.props ?? { children: element }

    if (typeof props.x === 'string')
      props.x = this.stringAt(props.x, props.absolute ? this.buffer[0].length : prevBounds.x2 - prevBounds.x)
    if (typeof props.y === 'string')
      props.y = this.stringAt(props.y, props.absolute ? this.buffer.length : prevBounds.y2 - prevBounds.y)
    if (typeof props.width === 'string')
      props.width = this.stringAt(props.width, props.absolute ? this.buffer[0].length : prevBounds.x2 - prevBounds.x)
    if (typeof props.height === 'string')
      props.height = this.stringAt(props.height, props.absolute ? this.buffer.length : prevBounds.y2 - prevBounds.y)
    if (props.width !== undefined && isNaN(props.width)) props.width = 0
    if (props.height !== undefined && isNaN(props.height)) props.height = 0
    const x = props.x !== undefined ? (props.absolute ? 0 : prevBounds.x) + props.x : this.cursor.x
    const y = props.y !== undefined ? (props.absolute ? 0 : prevBounds.y) + props.y : this.cursor.y
    const x1 =
      props.x !== undefined
        ? props.absolute
          ? props.x
          : Math.max(prevBounds.x, prevBounds.x + props.x)
        : prevBounds.x1
    const y1 =
      props.y !== undefined
        ? props.absolute
          ? props.y
          : Math.max(prevBounds.y, prevBounds.y + props.y)
        : prevBounds.y1
    const x2 =
      props.width !== undefined
        ? Math.min(props.absolute ? this.buffer[0].length : prevBounds.x2, props.width + x)
        : props.absolute
        ? this.buffer[0].length
        : prevBounds.x2
    const y2 =
      props.height !== undefined
        ? Math.min(props.absolute ? this.buffer.length : prevBounds.y2, props.height + y)
        : props.absolute
        ? this.buffer.length
        : prevBounds.y2
    const bounds = { x, y, x1, y1, x2, y2 }
    this.cursor.x = bounds.x
    this.cursor.y = bounds.y

    const modifiers = Object.fromEntries(
      ['color', 'background', 'bold', 'dim', 'italic', 'underline', 'blinking', 'inverse', 'strikethrough']
        .map(i => [i, props[i] ?? prevProps[i]])
        .filter(i => i[1])
    )
    if ((props.background || props.clear) && (props.width || props.height))
      this.fill(bounds, props.absolute ? bounds : prevBounds, modifiers)

    if (Array.isArray(children) || children?.props) {
      this.renderElement(element.children, bounds, modifiers)
    } else if (children) {
      const text = children.toString()
      if (text.includes('\n')) {
        const lines = children.toString().split('\n')
        lines.forEach((line: string, index: number) => {
          this.renderElement(line, bounds, modifiers)
          if (index < lines.length - 1) this.carret(prevBounds)
        })
      } else {
        this.cursor.x = this.put(text, bounds, modifiers)
      }
    }

    if (props.block) this.carret(prevBounds)
    if (props.width || props.height) {
      this.cursor.x = props.block ? prevBounds.x : bounds.x2
      this.cursor.y = props.block ? bounds.y2 : prevBounds.y
    }
  }
  fill(bounds: Bounds, prevBounds: Bounds, modifiers: TextProps) {
    for (let y = bounds.y; y < bounds.y2; y++) {
      if (y < Math.max(0, prevBounds.y1) || y >= Math.min(prevBounds.y2, this.buffer.length)) continue
      for (let x = bounds.x; x < bounds.x2; x++) {
        if (x < Math.max(0, prevBounds.x1) || x >= Math.min(prevBounds.x2, this.buffer[y].length)) continue

        this.buffer[y][x] = [' ', modifiers]
      }
    }
  }
  put(text: string, bounds: Bounds, modifiers: TextProps) {
    let { x, y } = bounds

    let i: number
    for (i = 0; i < text.length; i++) {
      if (y < Math.max(0, bounds.y1) || y >= Math.min(this.buffer.length, bounds.y2)) break
      if (x + i < Math.max(0, bounds.x1) || x + i >= Math.min(this.buffer[y].length, bounds.x2)) continue

      this.buffer[y][x + i] = [text[i], modifiers]
    }

    return x + i
  }
  carret(bounds: Bounds) {
    this.cursor.x = bounds.x ?? 0
    this.cursor.y++
  }
}

export default Screen
