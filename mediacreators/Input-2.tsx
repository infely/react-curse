/* @vhs 80x3
Hide
Type@0 npm_start
Enter
Sleep 250ms

Show
Sleep 250ms
Type hello
Enter
Type world
Enter
Enter
Up@200ms 4
Down@200ms 4
Sleep 1s */
import ReactCurse, { Input } from '..'
import React from 'react'

const App = () => {
  return <Input background="White" height={3} width={16} />
}

ReactCurse.render(<App />)
