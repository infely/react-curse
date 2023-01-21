#!/usr/bin/env node

import { execSync, spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import { readdirSync, readFileSync } from 'node:fs'
import { argv } from 'node:process'

const header = `
Set Theme {"black":"#3e3e3e","red":"#970b16","green":"#07962a","yellow":"#f8eec7","blue":"#003e8a","magenta":"#e94691","cyan":"#89d1ec","white":"#ffffff","brightBlack":"#666666","brightRed":"#de0000","brightGreen":"#87d5a2","brightYellow":"#f1d007","brightBlue":"#2e6cba","brightMagenta":"#ffa29f","brightCyan":"#1cfafe","brightWhite":"#ffffff","background":"#f7f7f7","foreground":"#3e3e3e"}
# Set Shell zsh
Set FontFamily "JetBrainsMono Nerd Font"
Set FontSize 24
Set Width 1146
Set Height 590
Set Framerate 50
Set Padding 0
Output rc.gif

Hide
Sleep 0.1s
Type@0s "export PS1='\\e[38;2;255;255;0m# \\e[0m'; alias npm_start='node .dist'; clear"
Enter
Sleep 0.1s
Show
`.trim()

const body = `
Hide
Type@0 npm_start
Enter
Sleep 250ms
Show

Sleep 250ms
`.trim()

const record = async name => {
  const res = readFileSync(`mediacreators/${name}.tsx`, 'utf8')
  if (!res.startsWith('/* @vhs')) return

  const comment = res.substring(7).split('*/\n')[0]
  const [params, ...rest] = comment.split('\n')
  const [width, temp] = params.trim().split('x')
  const [height, frames] = temp.split('@')
  let script = rest.length === 0 && frames === '1' ? body.split('\n') : rest
  const overrides = Object.fromEntries(
    script.filter(i => i.startsWith('Set ')).map(i => [i.split(' ', 2).join(' '), i])
  )
  script = script.filter(i => !i.startsWith('Set '))

  let fontSize = 1
  const head = header
    .split('\n')
    .map(i => {
      if (i.startsWith('Set FontSize ')) fontSize = parseInt(i.substring(13))
      if (i.startsWith('Set Width ') && width) return `Set Width ${Math.floor((fontSize * 0.6 * width) / 2) * 2}`
      if (i.startsWith('Set Height ') && height) return `Set Height ${Math.floor((fontSize * 1.5 * height) / 2) * 2}`
      if (i.startsWith('Output ')) return `Output media/${name}.gif`
      if (i.startsWith('Set ')) return overrides[i.split(' ', 2).join(' ')] ?? i
      return i
    })
    .join('\n')

  const tape = head + '\n\n' + script.join('\n')

  // return console.log(tape)

  execSync(
    `esbuild mediacreators/${name}.tsx --outfile=.dist/index.js --bundle --platform=node --format=esm --external:'./node_modules/*'`
  )
  await new Promise(resolve => {
    const p1 = spawn('vhs', { stdio: ['pipe', 'inherit', 'inherit'] })
    p1.stdio[0].write(tape)
    p1.stdio[0].end()
    p1.on('exit', resolve)
  })
  if (frames === '1') {
    try {
      rmSync(`media/${name}.png`)
    } catch (e) {}
    execSync(`ffmpeg -i media/${name}.gif -update 1 media/${name}.png`)
    rmSync(`media/${name}.gif`)
  }
}

;(async () => {
  const files = argv.length > 2 ? [argv[argv.length - 1] + '.tsx'] : readdirSync('mediacreators')
  for (const name of files.filter(i => i.endsWith('.tsx')).map(i => i.substring(0, i.length - 4))) {
    console.log(`\x1b[32m// ${name}\x1b[0m`)
    await record(name)
    console.log()
  }

  console.log('\x1b[32m// done\x1b[0m')
})()
