/* @vhs 80x3
Hide
Type@0 npm_start
Enter
Sleep 250ms

Show
Sleep 250ms
Type hello world
Left 11
Sleep 1s */
import ReactCurse, { Input } from '..'
import React from 'react'

const App = () => {
  return <Input background="White" height={1} width={8} />
}

ReactCurse.render(<App />)
