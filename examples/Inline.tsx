import ReactCurse, { Text } from '..'

const App = () => {
  return (
    <>
      <Text block>Line 1</Text>
      <Text block>Line 2</Text>
      <Text block>Line 3</Text>
    </>
  )
}

ReactCurse.inline(<App />)
