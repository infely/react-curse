import { useState, useEffect, useRef } from 'react'
import Renderer from '../renderer'

const interpolate = (toLow: number, toHigh: number, fromLow: number, fromHigh: number, value: number) => {
  const res = toLow + ((((toHigh - toLow) / 100) * 100) / (fromHigh - fromLow)) * (value - fromLow)
  return Math.max(Math.min(toLow, toHigh), Math.min(Math.max(toLow, toHigh), res))
}

const interpolateColor = (toLow: string, toHigh: string, fromLow: number, fromHigh: number, value: number) => {
  if (!toLow.startsWith('#')) return toHigh
  if (!toHigh.startsWith('#')) return toHigh

  const toLowColor = Renderer.term.parseHexColor(toLow)
  return (
    '#' +
    Buffer.from(
      Renderer.term.parseHexColor(toHigh).map((i: number, index: number) => {
        return Math.round(interpolate(toLowColor[index], i, fromLow, fromHigh, value))
      })
    ).toString('hex')
  )
}

export const Trail = ({ delay, children }: { delay: number; children: any }): JSX.Element => {
  return useTrail(delay, children)
}

export const useTrail = (delay: number, children: any[], key: string = 'key'): any => {
  const ms = useRef(0)
  const timeout = useRef<NodeJS.Timeout>()
  const [keys, setKeys] = useState<any[]>([])

  useEffect(() => {
    const keysNew = children.map((i: any) => i[key])
    const keyOld = keys.find(key => !keysNew.includes(key))
    if (keyOld) {
      setKeys(keys.filter(i => i !== keyOld))
      return
    }

    const keyNew = keysNew.find((i: any) => !keys.includes(i))
    if (!keyNew) return

    const at = Date.now()
    const nextAt = Math.max(0, delay - (at - ms.current))

    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      ms.current = Date.now()
      setKeys([...keys, keyNew])
    }, nextAt)
  }, [children.map((i: any) => i[key]).join('\n'), keys])

  return children.filter((i: any) => keys.includes(i[key]))
}

interface useAnimation {
  ms: number
  interpolate: (toLow: number, toHigh: number, fromLow?: number, fromHigh?: number, value?: number) => number
  interpolateColor: (toLow: string, toHigh: string, fromLow?: number, fromHigh?: number, value?: number) => string
}

export default (time = Infinity, fps = 60): useAnimation => {
  if (time <= 0 || fps <= 0) return { ms: 0, interpolate: i => i, interpolateColor: i => i }

  const at = useRef(Date.now())
  const interval = useRef<NodeJS.Timer>()
  const [ms, setMs] = useState(0)

  useEffect(() => {
    const frameMs = 1000 / Math.min(60, fps)

    interval.current = setInterval(() => {
      const msNew = Date.now() - at.current
      if (msNew >= time) clearInterval(interval.current)
      setMs(Math.min(msNew, time))
    }, frameMs)

    return () => {
      clearInterval(interval.current)
    }
  }, [])

  return {
    ms,
    interpolate: (toLow, toHigh, fromLow = 0, fromHigh = time, value = ms) => {
      return interpolate(toLow, toHigh, fromLow, fromHigh, value)
    },
    interpolateColor: (toLow, toHigh, fromLow = 0, fromHigh = time, value = ms) => {
      return interpolateColor(toLow, toHigh, fromLow, fromHigh, value)
    }
  }
}
