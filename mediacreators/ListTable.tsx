/* @vhs 80x8
Hide
Type@0 npm_start
Enter
Sleep 250ms

Show
Sleep 500ms
Type@200ms jjl
Sleep 500ms
Type@200ms kkh
Sleep 1000ms */

import React from 'react'
import ReactCurse, { ListTable, Text } from '..'

const App = () => {
  const head = ['id', 'title']
  const items = [...Array(8)].map((_, index) => [index + 1, `Task ${index + 1}`])
  return (
    <ListTable
      head={head}
      renderHead={({ item }) => item.map((i: string, key: string) => <Text key={key} width={8}>{i}</Text>)}
      data={items}
      renderItem={({ item, x, y, index }) =>
        item.map((text: string, key: string) => (
          <Text key={key} color={y === index && x === key ? 'BrightGreen': undefined} width={8}>
            {text}
          </Text>
        ))
      }
    />
  )
}

ReactCurse.render(<App />)
