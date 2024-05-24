#!/usr/bin/env node

import { 
  intro, outro,
  isCancel, select,
  spinner,
  text 
} from '@clack/prompts';
import pc from 'picocolors';
import download from 'download';
import renameOverwrite from 'rename-overwrite'
import { spawn } from 'node:child_process';


console.log(`
 _  _  ____  _  _  ____  ____  _____  ___ 
( \\( )( ___)( \\/ )(_  _)(  _ \\(  _  )/ __)
 )  (  )__)  )  (   )(   )(_) ))(_)(( (__ 
(_)\\_)(____)(_/\\_) (__) (____/(_____)\\___)

v 0.1.0
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
    { value: 'npm', label: 'npm' },
    { value: 'pnpm', label: 'pnpm' },
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
await download(
  'https://github.com/juji/next-doc/archive/refs/tags/latest.tar.gz', 
  '.',
  {
    extract: true
  }
);

await renameOverwrite('next-doc-latest', dir)

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

    const sp = spawn(command[pkgm][0], [command[pkgm][1]]|| [], {
      stdio: "inherit"
    })

    sp.on('close', (code) => {
      if(code) {
        console.error(`process exited with code ${code}`)
        j(false)
      } else r(true)
    })

  })

  console.log('')
  console.log('Happy Documenting!')
  console.log('')

}else{
  outro('Done')
}



