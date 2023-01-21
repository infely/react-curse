/* @vhs 80x3@1 */

import React from 'react'
import ReactCurse, { Banner, useInput } from '..'

const App = () => {
  useInput()

  return <Banner>{'12:34:56' /* new Date().toTimeString().substring(0, 8) */}</Banner>
}

ReactCurse.render(<App />)
