import ReactCurse, { Text, useInput } from '..'
import Banner from '../components/Banner'
import React, { useEffect, useState } from 'react'

const lorem = [...Array(3)]
  .map((_, offset) => [...Array(32)].map((_, index) => String.fromCharCode((offset + 1) * 32 + index)).join(''))
  .join('\n')

const getTime = () => new Date().toTimeString().substring(0, 8)

const Clock = (props: any) => {
  const [time, setTime] = useState(getTime())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 1000)

    return () => clearInterval(interval)
  }, [])

  useInput((input: string) => {
    if (input === 'q') ReactCurse.exit()
  })

  return <Banner {...props}>{time}</Banner>
}

ReactCurse.render(
  <>
    <Clock color="Red" x="50%-15" block />
    <Text>
      <Text x={2} width={6} dim>
        0x20{'\n'.repeat(3)}0x40{'\n'.repeat(3)}0x60
      </Text>
      <Banner color="Blue">{lorem}</Banner>
    </Text>
  </>
)
