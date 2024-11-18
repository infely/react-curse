import Renderer from '../renderer'
import { type DependencyList, useEffect } from 'react'

export default (callback: (input: string, raw: () => string) => void = () => {}, deps: DependencyList = []) => {
  useEffect(() => {
    if (!process.stdin.isRaw) process.stdin.setRawMode?.(true)
  }, [])

  useEffect(() => {
    const handler = (input: string, raw: () => string) => {
      if (input === '\x03') process.exit()
      if (input.startsWith('\x1b\x5b\x4d')) return

      callback(input, raw)
    }

    Renderer.input.on(handler)
    return () => {
      Renderer.input.off(handler)
    }
  }, deps)
}
