import { exec } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'
import React, { useState } from 'react'
import ReactCurse, { Input, Text, useAnimation, useExit, useInput } from '..'

const pwd = cwd()

const install = (value: string) => {
  if (!value) return

  const dest = join(pwd, value)
  if (existsSync(dest)) return

  mkdirSync(dest)
  const src = join(__dirname, 'template')
  const files = readdirSync(src)
  for (const file of files) {
    copyFileSync(join(src, file), join(dest, file))
  }

  const cp = exec(`cd ${dest} && npm i`)
  return new Promise(resolve => {
    cp.on('exit', () => {
      resolve(true)
    })
  })
}

const Spinner = ({ text }) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

  const { ms, interpolate } = useAnimation(Infinity)
  const frame = Math.floor(interpolate(0, frames.length, 0, 500, ms % 500))
  const color = 255 - Math.abs(Math.floor(interpolate(-16, 16, 0, 1500, ms % 1500)))

  return (
    <>
      <Text color={color}>{frames[frame]}</Text> {text}
    </>
  )
}

const Logo = ({ text }) => {
  const { interpolate } = useAnimation(1000)
  const w = Math.floor(interpolate(0, 22))

  return (
    <Text block>
      <Text y={0} dim block>
        {text.replace(/[^\s]/g, '#')}
      </Text>
      <Text y={0} color="BrightGreen">
        {text.substring(0, w)}
      </Text>
    </Text>
  )
}

const App = () => {
  const [focus, setFocus] = useState(1)
  const [value, setValue] = useState(null)

  const onSubmit = async (value: string) => {
    setFocus(2)

    const res = await install(value)
    setFocus(res ? 3 : -1)

    setTimeout(useExit, 1000 / 60)
  }

  useInput()

  return (
    <>
      <Logo text="Welcome to ReactCurse!" />
      <Text block>
        {focus === 1 && <Text>? </Text>}
        {focus !== 1 && <Text color="Green">{'✔ '}</Text>}
        <Text dim>Where would you like to create your app</Text>
        <Text> {pwd}/</Text>
        {focus === 1 && <Input onChange={setValue} onSubmit={onSubmit} color="Green" />}
        {focus !== 1 && <Text>{value}</Text>}
      </Text>
      {focus >= 2 && (
        <Text block>
          {focus === 2 && <Spinner text="Installing..." />}
          {focus > 2 && (
            <>
              <Text color="Green">{'✔ '}</Text>
              <Text dim>Done</Text>
            </>
          )}
        </Text>
      )}
      {focus === 3 && (
        <>
          <Text block>
            <Text dim>{'# '}</Text>cd {value}
          </Text>
          <Text block>
            <Text dim>{'# '}</Text>npm start
          </Text>
          <Text color="Green">Enjoy!</Text>
        </>
      )}
      {focus === -1 && <Text color="Red">Canceled</Text>}
    </>
  )
}

ReactCurse.inline(<App />)
