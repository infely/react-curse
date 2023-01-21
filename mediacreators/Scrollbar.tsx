/* @vhs 80x3@1 */

import React from 'react'
import ReactCurse, { Scrollbar, useInput } from '..'

const App = () => {
  useInput()

  return <Scrollbar type="horizontal" offset={10} limit={80} length={160} background={254} />
}

ReactCurse.render(<App />)
