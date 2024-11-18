/* @vhs 80x3@1 */
import ReactCurse, { Banner, useInput } from '..'
import React from 'react'

const App = () => {
  useInput()

  return <Banner>{'12:34:56' /* new Date().toTimeString().substring(0, 8) */}</Banner>
}

ReactCurse.render(<App />)
