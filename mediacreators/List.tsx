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
import ReactCurse, { List, Text } from '..'
import React from 'react'

const App = () => {
  const items = [...Array(8)].map((_, index) => ({ id: index + 1, title: `Task ${index + 1}` }))
  return (
    <List
      data={items}
      renderItem={({ item, selected }) => <Text color={selected ? 'BrightGreen' : undefined}>{item.title}</Text>}
    />
  )
}

ReactCurse.render(<App />)
