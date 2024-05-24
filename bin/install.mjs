#!/usr/bin/env node

import { 
  intro, outro,
  isCancel, select,
  text 
} from '@clack/prompts';
import pc from 'picocolors';

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




outro('Ok, created :)')
