#!/usr/bin/env node

import { 
  intro, outro,
  isCancel, select,
  spinner,
  text 
} from '@clack/prompts';
import pc from 'picocolors';
import { spawn } from 'node:child_process';
import { downloadExtract, getLatestTagName } from './utils.mjs';
import { readFileSync } from 'node:fs';


const currentDirectory = new URL(import.meta.url).pathname.split('/').slice(0,-1).join('/');
const pkg = readFileSync(currentDirectory+'/../package.json')
const json = JSON.parse(pkg)


console.log(`
 _  _  ____  _  _  ____  ____  _____  ___ 
( \\( )( ___)( \\/ )(_  _)(  _ \\(  _  )/ __)
 )  (  )__)  )  (   )(   )(_) ))(_)(( (__ 
(_)\\_)(____)(_/\\_) (__) (____/(_____)\\___)

v${json.version}
`)

intro(pc.bgCyan(pc.bold(` Create NextDoc `)));

const dir = await text({
  message: 'Which directory will you be working?',
  placeholder: 'my-next-docs',
  validate(value) {
    if (value.length === 0) return `Value is required!`;
  },
});

if(isCancel(dir)){
  outro('Canceled.')
  process.exit(0)
}

const pkgm = await select({
  message: 'Which pkg manager do you use?',
  options: [
    { value: 'pnpm', label: 'pnpm (recommended)' },
    { value: 'npm', label: 'npm' },
    { value: 'bun', label: 'bun' },
    { value: 'yarn', label: 'yarn' },
    { value: '_', label: '[I\'ll do the install on my own]' },
  ],
});

if(isCancel(pkgm)){
  outro('Canceled.')
  process.exit(0)
}

const s = spinner();
s.start('Downloading..');

const tagname = await getLatestTagName(
  'https://api.github.com/repos/juji/next-doc/releases/latest'
)

await downloadExtract(
  `https://github.com/juji/next-doc/archive/refs/tags/${tagname}.tar.gz`,
  `next-doc-${tagname}`,
  dir
)

s.stop('Package downloaded');


if(pkgm !== '_'){
  
  outro('Continue with installation')

  process.chdir(dir)

  const command = {
    yarn: ['yarn'],
    pnpm: ['pnpm','i'],
    npm: ['npm','i'],
    bun: ['bun','i'],
  }

  await new Promise((r,j) => {

    const sp = spawn(
      command[pkgm][0], 
      command[pkgm][1] ? [command[pkgm][1]] : [], 
      {
        stdio: "inherit"
      }
    )

    sp.on('close', (code) => {
      if(code) {
        console.error(`ERROR: process exited with code ${code}`)
        j(false)
      } else r(true)
    })

  })

}else{
  outro('Done')
}

console.log('')
console.log('Happy Documenting!')
console.log('')



