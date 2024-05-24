#!/usr/bin/env node

import { 
  intro, outro,
  isCancel,
  text 
} from '@clack/prompts';
import pc from 'picocolors';

intro(pc.bgCyan(pc.bold(` Create NextDoc `)));

const dir = await text({
  message: 'Where do you want to create?',
  placeholder: 'my-next-docs',
  initialValue: 'my-next-docs',
  validate(value) {
    if (value.length === 0) return `Value is required!`;
  },
});

if(isCancel(dir)){
  outro('Canceled.')
  process.exit(0)
}


outro('Ok, created :)')
