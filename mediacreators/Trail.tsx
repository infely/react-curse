/* @vhs 80x8
Hide
Type@0 npm_start
Enter
Sleep 40ms

Show
Sleep 2s */
import ReactCurse, { Text, Trail, useInput } from '..'
import React from 'react'

const App = () => {
  useInput()

  const items = [...Array(8)].map((_, index) => ({ id: index + 1, title: `Task ${index + 1}` }))
  return (
    <Trail delay={100}>
      {items.map(({ id, title }) => (
        <Text key={id} block>
          {title}
        </Text>
      ))}
    </Trail>
  )
}

ReactCurse.render(<App />)
