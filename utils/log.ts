import { createConnection } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspect } from 'node:util'

let socket: any

const connect = () => {
  return new Promise((resolve, reject) => {
    socket = createConnection(join(tmpdir(), 'node-log.sock'))
      .on('connect', function () {
        this.write('\0')
        resolve(this)
      })
      .on('error', () => {
        reject(undefined)
      })
  })
}

const toString = (data: any[]) => data.map(i => inspect(i, undefined, null, true)).join(' ')

export const log = async (...rest: any) => {
  try {
    if (socket === undefined) socket = await connect()
    socket.write(toString(rest) + '\n')
  } catch (e) {
    socket = undefined
    console.log(...rest)
  }
}

export default log
