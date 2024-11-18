import Input from './input'
import Reconciler, { TextElement } from './reconciler'
import Screen from './screen'
import Term from './term'
import { spawnSync, type SpawnSyncOptions, type SpawnSyncReturns } from 'node:child_process'
import { type ReactElement } from 'react'

class Renderer {
  container: TextElement
  screen: Screen
  input: Input
  term: Term
  reconciler: any
  callback: (value: any) => void
  throttleAt = 0
  throttleTimeout: NodeJS.Timeout

  #throttle = () => {
    const at = Date.now()
    const nextAt = Math.max(0, 1000 / 60 - (at - this.throttleAt))
    clearTimeout(this.throttleTimeout)
    this.throttleTimeout = setTimeout(() => {
      this.throttleAt = at
      this.screen.render(this.container.children)
      this.term.render(this.screen.buffer)
      this.input.render()
    }, nextAt)
  }

  render(reactElement: ReactElement, options = { fullscreen: true, print: false }) {
    this.container = new TextElement()
    this.screen = new Screen()
    this.input = new Input()
    this.term = new Term()
    this.reconciler = Reconciler(this.#throttle)

    this.term.init(options.fullscreen, options.print)
    this.reconciler.updateContainer(
      reactElement,
      this.reconciler.createContainer(this.container, 0, null, false, null, '', () => {}, null)
    )
  }
  inline(reactElement: ReactElement, options = { fullscreen: false, print: false }) {
    this.render(reactElement, options)
  }
  prompt<T>(reactElement: ReactElement, options = { fullscreen: false, print: false }): Promise<T> {
    this.render(reactElement, options)

    return new Promise(resolve => {
      this.callback = resolve
    })
  }
  print(reactElement: ReactElement, options = { fullscreen: false, print: true }) {
    this.render(reactElement, options)

    return new Promise(resolve => {
      this.callback = resolve
    })
  }
  frame(reactElement: ReactElement, options = { fullscreen: false, print: true }) {
    this.render(reactElement, options)

    return new Promise(resolve => {
      this.callback = (value: any) => {
        process.stdout.write(value)
        resolve(value)
      }
    })
  }
  terminate(value: any) {
    this.container.terminate()
    this.input.terminate()
    this.term.terminate()
    this.callback(value)
  }
  spawnSync(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnSyncOptions
  ): SpawnSyncReturns<string | Buffer> {
    const res = spawnSync(command, args, options)
    this.term.reinit()
    this.term.render(this.screen.buffer)
    return res
  }
  bell() {
    process.stdout.write('\x07')
  }
  exit(code: number | any = 0) {
    if (typeof code === 'number') process.exit(code)
    this.term.setResult(code)
  }
}

export default new Renderer()
