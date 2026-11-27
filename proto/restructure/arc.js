#!/usr/bin/env node
/* ============================================================
   arc.js. What the ninety day model says the restructure is worth, and
   the one thing in it that the model can price. Round FY.

   Evidence for RESEARCH-field-summary-restructure.md. Not a gate.

     node proto/restructure/arc.js

   THE MODEL IS proto/ritual/losssim.js, unedited on disk, validated first as
   proto/ninety/arc90.js does. Every figure it prints is a MODEL calibrated to
   reviews/simulation-quarter.md 6.3, not an observed person.

   ONE TERM IN THAT MODEL IS WHAT THE PROPOSED FIELD DOES. losssim's
   `firstshow` is "the first session ENDS BY SHOWING WHAT LANDED", gated on
   the first session putting something on the record at all. Today the commit
   sits on the Story tab and the Field's held count does not move for a new
   person (proto/restructure/bankvault.js: 38 of 38 first week commits left it
   where it was). The proposed Field ticks the bank on the same screen the
   entry was written on. So the proposal is modelled as the shipped build with
   firstshow switched on and nothing else. That join is JUDGEMENT.

   Nothing else the restructure does has a term in the model: fewer controls
   on the Field, the Summary's sections, the avatar as the setup door, the
   words Bank and Vault. They are not priced here and the report does not
   pretend they are.

   HOW THE CONFIG IS ADDED WITHOUT EDITING THE FILE. losssim's configurations
   are a closed table. The source is read, one line is appended in memory that
   composes an existing config with an existing term, and the result is run in
   a module sandbox. The file on disk is not touched, and its md5 is printed.
   ============================================================ */
'use strict';
const path=require('path'), fs=require('fs'), cp=require('child_process'), vm=require('vm'), crypto=require('crypto');
const ROOT=path.resolve(__dirname,'../..');
const LF=path.join(ROOT,'proto','ritual','losssim.js');
const src=fs.readFileSync(LF,'utf8');
const md5=crypto.createHash('md5').update(src).digest('hex');
const sh=c=>{try{return cp.execSync(c,{cwd:ROOT,stdio:['ignore','pipe','ignore']}).toString().trim();}catch(e){return '';}};
console.log('arc.js  commit '+sh('git rev-parse --short HEAD')+'  losssim.js md5 '+md5+(sh('git status --porcelain proto/ritual/losssim.js')?' (dirty)':' (clean)'));

const v=cp.spawnSync(process.execPath,[LF,'--validate'],{cwd:ROOT,encoding:'utf8'});
const ok=((v.stdout||'').match(/^\s+ok\s/mg)||[]).length, fail=((v.stdout||'').match(/^\s+FAIL\s/mg)||[]).length;
console.log('losssim.js --validate: '+ok+' passed, '+fail+' failed, exit '+v.status+'.');
if(fail||v.status!==0){console.log('The model does not validate at this commit. Nothing is reported.');process.exit(2);}

const inject=src.replace(/if\(typeof module!=='undefined'\)module\.exports=\{runSim,TRACE\};/,
 "CFG['built, and the first commit shown where it was written']=Object.assign({},BUILT,{firstshow:1});\n"
 +"if(typeof module!=='undefined')module.exports={runSim,TRACE};");
if(inject===src){console.log('losssim.js no longer ends the way this file expects. Re-read it.');process.exit(3);}
const mod={exports:{}};
const log=console.log; console.log=function(){};
try{vm.runInNewContext(inject,{module:mod,exports:mod.exports,require:require,__dirname:path.dirname(LF),__filename:LF,
 process:Object.assign({},process,{argv:[process.argv[0],LF]}),console:console,Math:Math,JSON:JSON,Date:Date},{filename:LF});}
finally{console.log=log;}
const LOSS=mod.exports;
const SEEDS=[20260920,11,222,3333,44444], DAYS=[1,2,7,14,30,60,90];
const ORDER=['Angela','Derek','James','Marcus','Sofia','Diane','Ana','Gordon','Rosa'];
const run=c=>SEEDS.map(s=>LOSS.runSim(c,{seed:s}));
const mean=(R,f)=>R.reduce((a,r)=>a+f(r),0)/R.length;
const A=run('built'), B=run('built, and the first commit shown where it was written');
const W={}; ORDER.forEach(n=>{W[n]=A[0].meas[n].w;});
console.log('\nPeople of 1000 still active, mean of '+SEEDS.length+' seeds. MODEL, not observation.');
console.log(['config'].concat(DAYS.map(d=>'d'+d)).join('\t'));
[['built today',A],['proposed Field (firstshow on)',B]].forEach(([nm,R])=>
 console.log([nm].concat(DAYS.map(d=>mean(R,r=>r.total[d]).toFixed(1))).join('\t')));
console.log(['difference'].concat(DAYS.map(d=>(mean(B,r=>r.total[d])-mean(A,r=>r.total[d])).toFixed(1))).join('\t'));
console.log('\nPer ICP, share of the row still active at day 7 and day 30, today > proposed.');
console.log('The grid level is the one losssim.js reads off the engine (BUYERS.md grid, on CQ), not a typed one.');
console.log(['who','weight','grid level','CQ','d2 today','d2 proposed','d7 today','d7 proposed','d30 today','d30 proposed'].join('\t'));
ORDER.forEach(n=>{
 const m=A[0].meas[n];
 const s=(R,d)=>(100*mean(R,r=>r.alive[n][d])/W[n]).toFixed(1);
 console.log([n,W[n],m.grid,m.CQ,s(A,2),s(B,2),s(A,7),s(B,7),s(A,30),s(B,30)].join('\t'));});
console.log('\nThe firstshow term, as losssim.js sources it: '+(src.match(/firstshow:\{v:[^,]+, s:'([^']{0,160})/)||[])[1]+' ...');
