import { createConnection } from 'net'
import { tmpdir } from 'os'
import { join } from 'path'
import { inspect } from 'util'

let socket: any
let once = false

const connect = () => {
  return new Promise((resolve, reject) => {
    socket = createConnection(join(tmpdir(), 'node-log.sock'))
      .on('connect', function () {
        socket.write('\0')
        resolve(socket)
      })
      .on('error', () => {
        reject(undefined)
      })
  })
}

const toString = (data: any[]) => data.map(i => inspect(i, undefined, null, true)).join(' ')

export default async function log(...rest: any) {
  if (once && socket === undefined) return
  try {
    once = true
    if (socket === undefined) socket = await connect()
    socket.write(toString(rest) + '\n')
  } catch {
    socket = undefined
    // console.log(...rest)
  }
}
