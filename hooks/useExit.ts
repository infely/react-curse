import Renderer from '../renderer'
import process from 'process'

/**
 * @deprecated
 */
export default (code: number | any = 0) => {
  if (typeof code === 'number') process.exit(code)

  Renderer.term.setResult(code)
}
