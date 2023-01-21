import { type DependencyList, useEffect } from 'react'
import Renderer from '../renderer'

interface Event {
  type: 'mousedown' | 'mouseup' | 'wheeldown' | 'wheelup'
  x: number
  y: number
}

export default (callback: (event: Event) => void, deps: DependencyList = []) => {
  useEffect(() => {
    if (!process.stdin.isRaw) process.stdin.setRawMode?.(true)
    Renderer.term.enableMouse()
  }, [])

  useEffect(() => {
    const handler = (input: string) => {
      if (!input.startsWith('\x1b\x5b\x4d')) return

      const b = input.charCodeAt(3)
      const type = (1 << 6) & b ? (1 & b ? 'wheelup' : 'wheeldown') : (3 & b) === 3 ? 'mouseup' : 'mousedown'

      const x = input.charCodeAt(4) - 0o41
      const y = input.charCodeAt(5) - 0o41

      callback({ type, x, y })
    }

    Renderer.input.on(handler)
    return () => {
      Renderer.input.off(handler)
    }
  }, deps)
}
