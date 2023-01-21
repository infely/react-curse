/* @vhs 80x8
Hide
Type@0 npm_start
Enter
Sleep 250ms

Show
Sleep 500ms
Type@100ms jjj
Sleep 500ms
Type@100ms kkk
Sleep 1000ms */

import React from 'react'
import ReactCurse, { List, Text } from '..'

const App = () => {
  const items = [...Array(8)].map((_, index) => ({ id: index + 1, title: `Task ${index + 1}` }))
  return (
    <List
      data={items}
      renderItem={({ item, selected }) => (
        <Text color={selected ? 'BrightGreen' : undefined}>{item.title}</Text>
      )}
    />
  )
}

ReactCurse.render(<App />)
