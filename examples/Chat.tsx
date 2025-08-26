import ReactCurse, { Banner, Input, Separator, Text, Trail, useAnimation, useWordWrap } from '..'
import { useState } from 'react'

const Message = ({ color: toColor, children }: { color: string; children: string }) => {
  const { interpolateColor } = useAnimation(1000)
  const color = interpolateColor('#888888', toColor)

  return <Text color={color}>{useWordWrap(children)}</Text>
}

const App = () => {
  const [messages, setMessages] = useState<{ role: 'system' | 'user'; message: string }[]>([
    { role: 'system', message: 'Hello' },
    { role: 'system', message: 'Type anything' },
    { role: 'system', message: 'And press enter' }
  ])

  const submitHandler = (message: string) => {
    if (message) setMessages([...messages, { role: 'user', message }])
  }

  return (
    <>
      <Banner block>CHAT</Banner>
      <Text height="100%-5" block>
        <Trail delay={250}>
          {messages.map((i, key) => (
            <Text key={key} color={i.role === 'system' ? 'Red' : 'Blue'} block>
              <Text>{`${i.role}:`.padEnd(7, ' ')}</Text>{' '}
              <Message color={i.role === 'system' ? '#e02020' : '#2020e0'}>{i.message}</Message>
            </Text>
          ))}
        </Trail>
      </Text>
      <Separator type="horizontal" dim block />
      <Text>
        <Text dim>#</Text> <Input initialValue="Hi there" width="100%" color="Blue" onSubmit={submitHandler} />
      </Text>
    </>
  )
}

ReactCurse.render(<App />)
