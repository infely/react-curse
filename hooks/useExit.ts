import Renderer from '../renderer'
import process from 'node:process'

/**
 * @deprecated
 */
export default (code: number | any = 0) => {
  if (typeof code === 'number') process.exit(code)

  Renderer.term.setResult(code)
}
