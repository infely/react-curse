#!/usr/bin/env node
import { rmSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'

const filename = join(tmpdir(), 'node-log.sock')

try {
  rmSync(filename)
} catch {
  //
}

createServer(stream => {
  stream.on('data', data => {
    data = data.toString()
    if (data === '\0') return process.stdout.write('\x1bc')

    process.stdout.write(data)
  })
}).listen(filename)
