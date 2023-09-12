import React, { useCallback, useState } from 'react'
import ReactCurse, { Block, Input, List, Text, useExit, useInput, useSize } from '..'
import useAnimation, { useTrail } from '../hooks/useAnimation'

const Task = ({ title, completed, selected }) => {
  const { interpolateColor } = useAnimation(250)

  return (
    <Text color={interpolateColor('#282828', selected ? '#b8bb26' : '#ebdbb2')} block>
      {completed ? ' ' : ' '}
      {title}
    </Text>
  )
}

const Tasks = ({ focus, setFocus }) => {
  const { height, width } = useSize()
  const [pos, setPos] = useState<{ y: number }>({ y: 0 })
  const [tasks, setTasks] = useState(() =>
    [...Array(32)].map((_, i) => ({ id: i + 1, title: `Task ${i + 1}`, completed: Math.random() >= 0.5 }))
  )

  useInput(
    input => {
      if (focus) return
      if (input === 'D') setTasks(tasks.filter((_, index) => index !== pos.y))
      if (input === ' ') setTasks(tasks.map((i, index) => (index === pos.y ? { ...i, completed: !i.completed } : i)))
      if (input === '\x0d') setFocus(true)
    },
    [pos, tasks]
  )

  const onSubmit = useCallback(
    (title: string) => {
      setFocus(false)
      setTasks(tasks => [...tasks, { id: tasks.length + 1, title, completed: false }])
    },
    [tasks]
  )

  return (
    <>
      <List
        height={height - 3}
        width={width}
        data={useTrail(1000 / 30, tasks, 'id')}
        renderItem={({ item, selected }) => {
          return <Task title={item.title} completed={item.completed} selected={selected} />
        }}
        onChange={setPos}
      />
      <Input absolute y="100%-1" x={0} focus={focus} onSubmit={onSubmit} onCancel={() => setFocus(false)} />
    </>
  )
}

const Fade = ({ children }) => {
  const { interpolateColor } = useAnimation(1000)

  const color = interpolateColor('#3c3836', '#ebdbb2', 500)
  if (color === '#3c3836') return null

  return (
    <Block align="center" color={color}>
      {children}
    </Block>
  )
}

const App = () => {
  const { width } = useSize()
  const [show, setShow] = useState(true)
  const [focus, setFocus] = useState(false)

  const { interpolate, interpolateColor } = useAnimation(500)
  const x = Math.round(interpolate(0, width))
  const background = interpolateColor('#282828', '#3c3836')

  useInput(
    input => {
      if (input === '\x10\x0d') useExit()
      if (focus) return

      if (input === 'q') useExit()
      if (input === 't') setShow(i => !i)
    },
    [focus]
  )

  return (
    <Text>
      <Text height={1} width={x} background={background}>
        <Fade>hello</Fade>
      </Text>
      <Text y={1} x={1}>
        {show && <Tasks focus={focus} setFocus={setFocus} />}
      </Text>
      <Text y="100%-2" x={width - x} height={1} background={background}>
        <Fade>world</Fade>
      </Text>
    </Text>
  )
}

ReactCurse.render(<App />)
