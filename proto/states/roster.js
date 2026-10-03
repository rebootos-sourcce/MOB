/* THE ROSTER. Every reference case with birth data, read through the
   committed engine and the stack, printed in full. The text a person would
   see, not a description of it.

     node proto/states/roster.js [engine.js]      default: git show HEAD:engine.js

   Reads the engine off HEAD rather than the working tree, because a parallel
   seat has astro.js and birth.js open and a half built engine is not a
   reading. Writes proto/states/roster.txt beside itself. */
const fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os');
const D=__dirname, ROOT=path.resolve(D,'..','..');
let ENG=process.argv[2];
if(!ENG){ENG=path.join(os.tmpdir(),'states-engine-head.js');
 fs.writeFileSync(ENG,cp.execSync('git show HEAD:engine.js',{cwd:ROOT,maxBuffer:64<<20}));}
const E=require(path.resolve(ENG));
Object.assign(global,require('./copy.js'));
const {readStack}=require('./synth.js');
const Z=E.ZSIGN||eval(fs.readFileSync(ENG,'utf8').match(/var ZSIGN=(\[[\s\S]*?\]\]);/)[1]);
const head=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
let out='States stack, read off engine.js at '+head+'\n';
function one(nm,e){
 const R=readStack(e,Z);
 out+='\n==== '+nm+'  '+[e.sun,e.moon,e.rising].join(' / ')+'  '+e.celem+' '+e.chinese
  +'  ('+e.birth.d+' '+(e.birth.t||'no time')+', '+(e.birth.p||'no place')+')\n';
 out+='rail     Stack: '+R.rail+'\n';
 out+='joints   '+R.joints.map(j=>j.key+' '+j.kind).join(', ')+'\n\n';
 out+=R.head+'\n\n';
 R.order.forEach(l=>{
  if(l.open){out+=ST_POS[l.k].nm+'. not read yet\n';return;}
  out+=ST_POS[l.k].nm+', '+(l.k==='year'?l.nm:l.sign)+'. '+l.line+'\n';});
 if(R.ground)out+='\nGround\n  '+R.ground+'\n';
 out+='Where it shears\n'+(R.seams.length?R.seams.map(s=>'  '+s.say).join('\n')
  :'  '+(R.limit?'Nothing that was read shears.':ST_CLEAN))+'\n';
 if(R.weight)out+='Weight\n  '+R.weight+'\n';
 if(R.limit)out+='Limit\n  '+R.limit+'\n';}
const names=Object.keys(E.BIRTH).filter(n=>E.BIRTH[n]);
names.forEach(n=>one(n,E.spiritual(n)));
/* the unresolved path, which the fixtures never take: James with no time */
const j=Object.assign({},E.BIRTH.James,{t:''});
one('James, time removed',E.spiritualOf(j));
/* the distribution, over every reference case, so a reading that says the
   same thing about everybody shows up here as a number */
const tally={};names.forEach(n=>readStack(E.spiritual(n),Z).joints.forEach(j=>{tally[j.kind]=(tally[j.kind]||0)+1;}));
out+='\n---- joints over the '+names.length+' reference cases: '+JSON.stringify(tally)+'\n';
fs.writeFileSync(path.join(D,'roster.txt'),out);
console.log(out);
