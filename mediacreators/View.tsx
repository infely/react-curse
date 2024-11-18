/* @vhs 80x8
Hide
Type@0 npm_start
Enter
Sleep 250ms

Show
Sleep 750ms
Type@20ms jjjjjjjjjj
Sleep 250ms
Type@20ms kkkkkkkkkk */
import ReactCurse, { View } from '..'
import json from '../package.json'
import React from 'react'

const App = () => {
  return <View>{JSON.stringify(json, null, 2)}</View>
}

ReactCurse.render(<App />)
