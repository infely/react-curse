import { type ReactElement, useEffect, useState } from 'react'

const render = (element: ReactElement | ReactElement[] | any) => {
  if (Array.isArray(element)) return element.map(i => render(i)).join('')

  const { children } = (element as ReactElement).props ?? { children: element }
  if (Array.isArray(children) || children.props) return render(children)

  return children.toString()
}

const getSize = (children: ReactElement | ReactElement[] | any) => {
  const string = render(children).split('\n')
  const width = string.reduce((acc: number, i: string) => Math.max(acc, i.length), 0)
  const height = string.length

  return { width, height }
}

export default (children: ReactElement | ReactElement[] | any) => {
  const [size, setSize] = useState(getSize(children))

  useEffect(() => {
    setSize(getSize(children))
  }, [children])

  return size
}
