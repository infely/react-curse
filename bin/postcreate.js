#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, chmodSync } from 'node:fs'

const makeJs = () => {
  const file = `.create/index.js`
  writeFileSync(file, `#!/usr/bin/env node\n${readFileSync(file, 'utf8')}`)
  chmodSync(file, '755')
}

const makeJson = () => {
  const json = JSON.parse(readFileSync('package.json', 'utf8'))

  const keys = ['name', 'version', 'description', 'keywords', 'author', 'repository', 'homepage', 'license']
  const jsonNew = {
    ...Object.fromEntries(Object.entries(json).filter(([key]) => keys.includes(key))),
    ...{
      name: 'create-react-curse',
      description: 'Create React-Curse app',
      keywords: [...json.keywords, 'react-curse'],
      bin: 'index.js'
    }
  }
  writeFileSync('.create/package.json', JSON.stringify(jsonNew, null, 2))
}

makeJs()
makeJson()
execSync('cp -r create/{template,readme.md} .create')
