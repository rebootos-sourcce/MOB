#!/usr/bin/env node
'use strict';
/* Regenerate the static, offline-safe browser mirror from the canonical JSON.
 * Usage: node tools/build-integrity-v2-data.cjs [--check] */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const inp=path.join(root,'docs/data/compass/quiz/v2/INTEGRITY_21_LAW_THREE_REGISTER_V2.json');
const out=path.join(root,'funnel/integrity-v2-data.js');
const bank=JSON.parse(fs.readFileSync(inp,'utf8'));
const text='/* AUTO-GENERATED MIRROR of docs/data/compass/quiz/v2/INTEGRITY_21_LAW_THREE_REGISTER_V2.json.\n'+
 '   Do not hand-edit. Regenerate when that canonical content changes. */\n'+
 'window.ATUNED_INTEGRITY21_V2='+JSON.stringify(bank)+';\n';
if(process.argv.includes('--check')){
 if(!fs.existsSync(out)||fs.readFileSync(out,'utf8')!==text){
  console.error('V2 browser question mirror differs from canonical JSON; regenerate before shipping');
  process.exitCode=1;
 }else console.log('V2 browser question mirror matches canonical JSON');
}else{fs.writeFileSync(out,text);console.log('Regenerated '+path.relative(root,out));}
