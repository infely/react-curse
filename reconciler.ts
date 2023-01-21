import Reconciler from 'react-reconciler'
import { type TextProps } from './components/Text'

export class TextElement {
  props: TextProps
  parent: null | TextElement
  children: TextElement[]
  constructor(props: object = {}) {
    this.props = props
    this.parent = null
    this.children = []
  }
  terminate() {
    this.children = []
  }
  appendChild(child: any) {
    this.children = [...this.children, child]
  }
  commitUpdate(nextProps: any) {
    this.props = nextProps
  }
  insertBefore(child: any, beforeChild: any) {
    const index = this.children.indexOf(beforeChild)
    if (index !== -1) this.children.splice(index, 0, child)
  }
  removeChild(child: any) {
    const index = this.children.indexOf(child)
    if (index !== -1) this.children.splice(index, 1)
  }
}

export class TextInstance {
  value: string
  constructor(value: string) {
    this.value = value
  }
  commitTextUpdate(value: string) {
    this.value = value
  }
  toString() {
    return this.value
  }
}

export default (resetAfterCommit: Function) => {
  // @ts-ignore
  // prettier-ignore
  const reconciler = Reconciler({
    supportsMutation: true,
    appendChild(parentInstance: any, child: any) { parentInstance.appendChild(child) },
    appendChildToContainer(container: any, child: any) { container.appendChild(child) },
    appendInitialChild(parentInstance: any, child: any) { parentInstance.appendChild(child) },
    clearContainer() {},
    commitTextUpdate(textInstance: any, _oldText: any, newText: any) { textInstance.commitTextUpdate(newText) },
    commitUpdate(instance: any, _updatePayload: any, _type: any, _prevProps: any, nextProps: any) { instance.commitUpdate(nextProps) },
    createInstance(type: any, props: any) { if (type === 'text') { return new TextElement(props) } else { throw new Error('must be <Text>') } },
    createTextInstance(text: string) { return new TextInstance(text) },
    detachDeletedInstance() {},
    finalizeInitialChildren() { return false },
    getChildHostContext() { return {} },
    getPublicInstance(instance: any) { return instance },
    getRootHostContext(rootContainer: any) { return rootContainer },
    insertBefore(parentInstance: any, child: any, beforeChild: any) { parentInstance.insertBefore(child, beforeChild) },
    insertInContainerBefore(container: any, child: any, beforeChild: any) { container.insertBefore(child, beforeChild) },
    prepareForCommit() { return null },
    prepareUpdate() { return true },
    removeChild(parentInstance: any, child: any) { parentInstance.removeChild(child) },
    removeChildFromContainer(container: any, child: any) { container.removeChild(child) },
    resetAfterCommit() { resetAfterCommit() },
    shouldSetTextContent() { return false },
  })

  return reconciler
}
