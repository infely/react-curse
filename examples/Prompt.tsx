import React, { useState } from 'react'
import ReactCurse, { Block, Frame, Input, Text, useAnimation, useExit, useInput } from '..'

const InputText = ({ text, type, color }: { text: string; type: any; color: any }) => {
  const [focus, setFocus] = useState(true)
  const [value, setValue] = useState('')

  const onSubmit = (input: string) => {
    setFocus(false)
    setValue(input)
    useExit(input)
  }

  return (
    <>
      <Text color={color} underline>
        {text}
      </Text>
      <Text>: </Text>
      {focus && <Input type={type} onSubmit={onSubmit} color={color} />}
      {!focus && <Text bold>{value}</Text>}
    </>
  )
}

const InputList = ({ items, color }: { items: string[]; color: any }) => {
  const [, setFocus] = useState(true)
  const [selected, setSelected] = useState(0)

  useInput(
    (input: string) => {
      if (input === 'q') useExit()

      if (input === 'k') setSelected(i => Math.max(0, i - 1))
      if (input === 'j') setSelected(i => Math.min(items.length - 1, i + 1))
      if (input === '\x0d') {
        useExit(items[selected])
        setFocus(false)
      }
    },
    [selected]
  )

  return (
    <>
      <Text block>
        <Text color={color}>Please select an option</Text>:
      </Text>
      {items.map((i, key) => (
        <Text key={key} block>
          <Text color={color}>{selected === key ? '>' : ' '}</Text> {i}
        </Text>
      ))}
    </>
  )
}

const Spinner = ({ text }) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] // ['|', '/', '-', '\\']

  const { ms, interpolate } = useAnimation(Infinity)
  const frame = Math.floor(interpolate(0, frames.length, 0, 500, ms % 500))
  const color = 255 - Math.abs(Math.floor(interpolate(-16, 16, 0, 1500, ms % 1500)))

  return (
    <>
      <Text color={color}>{frames[frame]}</Text> {text}
    </>
  )
}

;(async () => {
  await ReactCurse.frame(
    <Frame type="rounded" width={32} block color="Blue">
      <Block color="Yellow" width={32} align="center">
        hello world
      </Block>
    </Frame>
  )

  const res1 = await ReactCurse.prompt(<InputText text="Question 1" type="text" color="Red" />)
  console.log(`Answer 1: ${res1}`)

  const res2 = await ReactCurse.prompt(<InputText text="Question 2" type="password" color="Green" />)
  console.log(`Answer 2: ${res2}`)

  const res3 = await ReactCurse.prompt(<InputText text="Question 3" type="hidden" color="Blue" />)
  console.log(`Answer 3: ${res3}`)

  const res4 = await ReactCurse.prompt(<InputList items={['Item 1', 'Item 2', 'Item 3', 'Item 4']} color="Yellow" />)
  console.log(`Answer 3: ${res4}`)

  ReactCurse.inline(<Spinner text={JSON.stringify({ res1, res2, res3, res4 })} />)
  await new Promise(resolve => setTimeout(resolve, 500))

  process.exit()
})()
