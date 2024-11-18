#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'

const makeJson = () => {
  const json = JSON.parse(readFileSync('package.json', 'utf8'))

  const keys = [
    'name',
    'version',
    'description',
    'keywords',
    'author',
    'repository',
    'homepage',
    'main',
    'license',
    'type',
    'dependencies'
  ]
  const jsonNew = {
    ...Object.fromEntries(Object.entries(json).filter(([key]) => keys.includes(key))),
    ...{
      main: 'index.js'
    }
  }
  writeFileSync('.npm/package.json', JSON.stringify(jsonNew, null, 2))
}

const makeReadme = () => {
  const data = readFileSync('README.md', 'utf8')

  const dataNew = data
    .split('\n')
    .map(i => i.replace('media/', 'https://raw.githubusercontent.com/infely/react-curse/HEAD/media/'))
    .join('\n')
  writeFileSync('.npm/README.md', dataNew)
}

makeJson()
makeReadme()
