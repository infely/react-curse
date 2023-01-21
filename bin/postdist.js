#!/usr/bin/env node

import { readFileSync, writeFileSync, chmodSync, unlinkSync } from 'node:fs'
import { argv } from 'node:process'

let [, , arg] = argv
if (arg === undefined) {
  const json = JSON.parse(readFileSync('package.json', 'utf8'))
  arg = json.main.replace(/\.[jt]sx?$/, '')
}

const src = '.dist/index.cjs'
const dest = `.dist/${arg}.cjs`
writeFileSync(dest, `#!/usr/bin/env node\n${readFileSync(src, 'utf8')}`)
unlinkSync(src)
chmodSync(dest, '755')
