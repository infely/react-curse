import process from 'node:process'
import { useEffect, useState } from 'react'

const subscribers = new Set<Function>()

const getSize = () => {
  const { columns: width, rows: height } = process.stdout
  return { width, height }
}

process.stdout.on('resize', () => {
  const size = getSize()
  subscribers.forEach((_, fn) => fn(size))
})

export default () => {
  const [size, setSize] = useState(getSize())

  useEffect(() => {
    subscribers.add(setSize)

    return () => {
      subscribers.delete(setSize)
    }
  }, [])

  return size
}
