/* ============================================================
   DOES THE PATCH WORK. Measured, through the shipped sniffer.

   Applies sim/lexpatch.js to the shipped LEX in memory, runs the shipped
   parseStory over the same story bank the ninety day run used, and reports what
   changed. It asserts nothing: the read rate and the inferred rate come back off
   parseStory both ways. Writes sim/lexmeasured.json, which the change harness
   reads instead of a target.

     node sim/lexcheck.js
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const ROOT=process.env.SIM_ROOT?path.resolve(process.env.SIM_ROOT):path.resolve(__dirname,'..');/* SIM_ROOT pins the build. Two seats are live in atuned_src and the working
   copy of source.html and engine.js moves under this directory while it runs. A
   measurement whose subject changed halfway is not a measurement, so every
   script here reads the build out of one place and the md5 of that place is
   stamped into every file it writes. */
const E=require(path.join(ROOT,'engine.js'));
const {STORYBANK}=require(path.join(__dirname,'stories.js'));
const {PATCH}=require(path.join(__dirname,'lexpatch.js'));

const rows=[];
Object.keys(STORYBANK).forEach(who=>STORYBANK[who].forEach(([why,t])=>rows.push({who:who,why:why,text:t})));
const says=E.PEOPLE.map(p=>({who:p.nm, why:'says', text:String(p.says).trim()}));

function read(set){
 return set.map(r=>{const q=E.parseStory(r.text);
  return {who:r.who, text:r.text,
   hits:q.hits.length, imprints:q.imprints.length,
   inferred:q.imprints.length>0&&q.imprints.every(i=>i.inferred),
   stated:q.imprints.filter(i=>i.stated).length,
   offers:q.imprints.slice(0,3).map(i=>i.name)};});}
const tally=a=>({n:a.length,
 none:a.filter(r=>r.imprints===0).length,
 read:a.filter(r=>r.imprints>0).length,
 inferredOnly:a.filter(r=>r.inferred).length,
 stated:a.filter(r=>r.stated>0).length,
 readShare:+(a.filter(r=>r.imprints>0).length/a.length).toFixed(4),
 inferShare:+(a.filter(r=>r.inferred).length/Math.max(1,a.filter(r=>r.imprints>0).length).toFixed(4))});

const before={bank:read(rows), says:read(says)};
/* APPLY. Only keys the shipped LEX does not already carry, so the patch can
   never quietly change a shipped weight. Any collision is reported. */
const collide=[];
Object.keys(PATCH).forEach(k=>{
 if(E.LEX[k]){collide.push(k); return;}
 E.LEX[k]=PATCH[k];});
const after={bank:read(rows), says:read(says)};

/* THE STAMP. This file used to write no stamp, so the measurement it produced
   could not be tied to a build. A number with no build behind it is a number
   somebody has to take on trust. */
const REPO=path.resolve(__dirname,'..');
const md5=f=>cp.execSync('md5sum '+JSON.stringify(path.join(ROOT,f))).toString().split(' ')[0];
const STAMP={src:md5('source.html'), engine:md5('engine.js'),
 commit:cp.execSync('git -C '+JSON.stringify(REPO)+' rev-parse --short HEAD').toString().trim(),
 pinned:!!process.env.SIM_ROOT, when:new Date().toISOString()};
const out={stamp:STAMP, patch:{entries:Object.keys(PATCH).length, collisions:collide,
  applied:Object.keys(PATCH).length-collide.length,
  lexBefore:Object.keys(E.LEX).length-(Object.keys(PATCH).length-collide.length),
  lexAfter:Object.keys(E.LEX).length},
 bank:{before:tally(before.bank), after:tally(after.bank)},
 says:{before:tally(before.says), after:tally(after.says)},
 /* every line that changed verdict, so the patch can be reviewed line by line */
 moved:rows.map((r,i)=>({text:r.text, who:r.who,
   was:before.bank[i].imprints?(before.bank[i].inferred?'inferred':'read'):'nothing',
   now:after.bank[i].imprints?(after.bank[i].inferred?'inferred':'read'):'nothing',
   wasOffers:before.bank[i].offers, nowOffers:after.bank[i].offers}))
  .filter(r=>r.was!==r.now),
 stuck:rows.map((r,i)=>({text:r.text, who:r.who, verdict:after.bank[i].imprints?
   (after.bank[i].inferred?'inferred':'read'):'nothing'}))
  .filter(r=>r.verdict!=='read')};
fs.writeFileSync(path.join(__dirname,'lexmeasured.json'),JSON.stringify(out,null,1));
console.log('sim/lexmeasured.json written. '+out.patch.applied+' entries applied'
 +(collide.length?' ('+collide.length+' collided and were left alone)':'')
 +', LEX '+out.patch.lexBefore+' to '+out.patch.lexAfter+'.');
console.log('bank read   '+out.bank.before.read+' of '+out.bank.before.n
 +'  ->  '+out.bank.after.read+' of '+out.bank.after.n);
console.log('bank inferred only '+out.bank.before.inferredOnly+'  ->  '+out.bank.after.inferredOnly);
console.log('roster says read '+out.says.before.read+' of '+out.says.before.n
 +'  ->  '+out.says.after.read+' of '+out.says.after.n);
console.log('still not read: '+out.stuck.filter(r=>r.verdict==='nothing').length
 +', still inferred: '+out.stuck.filter(r=>r.verdict==='inferred').length);
out.stuck.forEach(r=>console.log('  '+r.verdict+'  '+r.who+' :: '+r.text.slice(0,70)));
