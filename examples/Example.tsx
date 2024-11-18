import ReactCurse, { Text, Input, useInput, useMouse } from '..'
import React, { useState } from 'react'

const App = () => {
  const [focus, setFocus] = useState(true)
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [cancel, setCancel] = useState('')
  const [event, setEvent] = useState({})
  const [keys, setKeys] = useState('')

  const onChange = (input: string) => {
    setValue(input)
  }

  const onSubmit = (input: string) => {
    setFocus(false)
    setResult(input)
  }

  const onCancel = () => {
    setFocus(false)
    setCancel(`${+new Date()}`)
  }

  useInput(
    input => {
      if (input === '\x10\x0d') ReactCurse.exit()
      if (input === 'q') ReactCurse.exit()

      if (input === '\x0d') setFocus(true)
      if (!focus) setKeys(i => i + input)
    },
    [focus]
  )

  useMouse(event => {
    setEvent(event)
  })

  return (
    <Text>
      <Input
        focus={focus}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        background="#404040"
        initialValue={'123123123\n123123123123\n123123123\n1231231231231231231231231231231\n'}
        height={5}
        width={32}
      />
      <Text absolute y="100%-5" x="100%-24">
        <Text block background="#404040">
          KEYS: {Buffer.from(keys).toString('hex')}
        </Text>
        <Text block background="#404040">
          EVENT: {JSON.stringify(event)}
        </Text>
        <Text block background="#404040">
          CANCEL: {cancel}
        </Text>
        <Text block background="#404040">
          RESULT: {result}
        </Text>
        <Text block background="#404040">
          VALUE: {value}
        </Text>
      </Text>
    </Text>
  )
}

ReactCurse.render(<App />)
