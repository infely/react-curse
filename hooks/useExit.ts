import process from 'node:process'
import Renderer from '../renderer'

export default (code: number | any = 0) => {
  if (typeof code === 'number') process.exit(code)

  Renderer.term.setResult(code)
}
