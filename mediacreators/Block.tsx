/* @vhs 80x3@1 */
import ReactCurse, { Block } from '..'
import React from 'react'

const App = () => {
  setTimeout(() => {}, 1000)

  return (
    <>
      <Block>left</Block>
      <Block align="center">center</Block>
      <Block align="right">right</Block>
    </>
  )
}

process.stdout.write('\x1bc')
ReactCurse.inline(<App />)
