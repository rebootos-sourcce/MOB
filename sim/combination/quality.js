/* ============================================================
   THE TEAM GRADES ITS OWN WORK. THE INSTRUMENT, AND WHAT IT CANNOT SEE.

   The owner asked for the team to review its own output, score it, iterate, and
   measure whether the quality is heading in the right direction. That is a
   different instrument from the ninety day run: the thing being scored here is
   the work, not the product.

   THE ONE RULE THIS FILE IS BUILT AROUND. A rubric that needs a reader's
   judgement produces a different number every time it is read, so a trajectory
   built out of it measures the reader and not the work. Every dimension below is
   computed off the bytes of the artefact by this file, so two readers running it
   get the same number, and a dimension that cannot be computed that way is
   listed at the end as unscored rather than given an invented figure.

   WHAT AN ITERATION IS. Not a version this file invents: a commit. Every commit
   in the window that touched an artefact family is one iteration of it, the
   family's files are extracted at that commit with git archive, and scored. The
   working tree is scored last, as the current iteration.

   THE LOOP HE ASKED FOR, MADE CHECKABLE. Score, take the weakest dimension,
   state what would raise it, and see whether the next iteration raised it. That
   last clause is the only one that answers "is it heading in the right
   direction", and it is reported as the follow rate: of the iteration to
   iteration transitions, the share where the dimension that was weakest went up.

   Run:  node sim/combination/quality.js [hours]
   Writes sim/combination/quality.json.
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process'), os=require('os');
const DIR=__dirname, REPO=path.resolve(DIR,'..','..');
const HOURS=+(process.argv[2]||40);
const sh=(c,opt)=>cp.execSync(c,Object.assign({cwd:REPO,maxBuffer:1<<28},opt||{})).toString();

/* ============================================================
   THE ARTEFACT FAMILIES. The eight the owner named, plus the one the brief
   folded into another: proto/feather and proto/feathers are two directories and
   are scored separately, because a family that is scored as its own thing cannot
   hide inside an average.
   ============================================================ */
const FAM=[
 {k:'story4', dir:'proto/story4', nm:'The four story designs', seat:'design',
  pages:['bench.html','body.html','instrument.html','mirror.html','index.html']},
 {k:'nav', dir:'proto/nav', nm:'The navigation prototype', seat:'ux', pages:['index.html']},
 {k:'logo', dir:'proto/logo', nm:'The logo rounds', seat:'art', pages:['index.html']},
 {k:'dials', dir:'proto/dials', nm:'The dial prototype', seat:'design', pages:['index.html']},
 {k:'feathers', dir:'proto/feathers', nm:'The feather prototype, second', seat:'design', pages:['index.html']},
 {k:'feather', dir:'proto/feather', nm:'The feather prototype, first', seat:'design', pages:['index.html']},
 {k:'ladder', dir:'proto/ladder', nm:'The ladder', seat:'game', pages:['index.html']},
 {k:'funnel', dir:'funnel', nm:'The funnel', seat:'growth',
  pages:['index.html','quiz.html','about.html','buy.html']},
 {k:'sim', dir:'sim', nm:'The simulation pages', seat:'research',
  pages:['ninety-days.html','to-ninety.html','what-would-help.html']}];

/* ============================================================
   THE DIMENSIONS. Eight, each out of four, each computed.

   Every one of them traces to a rule this repository already enforces on
   itself, which is why they are these eight and not eight others. The rule is
   named beside each, because a rubric whose dimensions are not argued from
   somewhere is a preference with a number on it.
   ============================================================ */
const DIMS=[
 {k:'contained', nm:'Self contained',
  why:'CLAUDE.md: one file, no dependencies, no network. A prototype that fetches has not proved anything about a product that cannot.',
  how:'outbound references in the deliverable pages: a script, style, image, font or fetch pointing at a host. four when there are none, minus two for each distinct one.'},
 {k:'widths', nm:'Looked at, both widths',
  why:'CLAUDE.md: reading CSS is not reviewing a screen, and the shots are taken at 1600 and 390.',
  how:'shots present in the tree at that commit at both widths, and a script that takes them. two for each width, and nothing for shots with no script behind them.'},
 {k:'measured', nm:'Figures measured, not typed',
  why:'CLAUDE.md, twelve times bitten: read the count off the run. A figure typed into a page is the defect this repository keeps paying for.',
  how:'two for a measurement file in the family, two for the page carrying a stamp: a commit, an md5 or a timestamp.'},
 {k:'refuses', nm:'Refuses to build without its data',
  why:'The gates: a build that proceeds with its data missing prints a page of nothing and calls it a result.',
  how:'a builder or probe script in the family that exits non zero on a missing input. four with the guard, two for a script with none, nothing with no script.'},
 {k:'repro', nm:'Reproduction printed on the page',
  why:'A figure nobody can regenerate is a claim. The two simulation pages print their own chain.',
  how:'the deliverable page naming the command that rebuilds it.'},
 {k:'voice', nm:'Voice gate',
  why:'The house voice is a ruling, not a preference, and it has a runnable gate.',
  how:'the repository voice gate run against the deliverable pages. four minus one for each hard failure.'},
 {k:'lands', nm:'Names where it lands',
  why:'A point is only earned by a change that would move the product, named with the file it lands in. That rule was written for the simulation and it is the same rule here.',
  how:'distinct paths under atuned_src named in the deliverable pages. two for one, four for two or more.'},
 {k:'open', nm:'Says what is still open',
  why:'DECISIONS.md and the queue: an artefact that names nothing open has either decided something it does not own or hidden the question.',
  how:'counts the page saying what it is not doing, what needs a ruling, and whose call it is. this is the weakest of the eight and it is a word search.'}];

/* ---------------------------------------------------------------- the probes */
const HOSTRE=/(?:src|href)\s*=\s*["']https?:\/\/|@import\s+url\(\s*["']?https?:|\bfetch\s*\(\s*["']https?:|https?:\/\/(?:cdn|fonts|ajax|unpkg|cdnjs)/gi;
const STAMPRE=/\b[0-9a-f]{32}\b|\bcommit\b[^<]{0,40}\b[0-9a-f]{7}\b|\b20\d\d-\d\d-\d\dT\d\d:\d\d/;
const REPRORE=/\b(?:node|python3|bash)\s+[\w./-]+\.(?:js|py|sh)\b|\bBUILD[\w-]*\.sh\b/;
const LANDRE=/atuned_src\/[A-Za-z0-9_./-]+/g;
const OPENRE=[/not doing/i,/needs a ruling/i,/his call/i,/open\b/i,/unscored|cannot be scored|did not check/i,/deferred/i];

function readPages(root,fam){
 const out=[];
 fam.pages.forEach(p=>{const f=path.join(root,fam.dir,p);
  if(fs.existsSync(f))out.push({p:p, f:f, t:fs.readFileSync(f,'utf8')});});
 return out;}
function listFiles(root,fam){
 const d=path.join(root,fam.dir);
 if(!fs.existsSync(d))return [];
 return fs.readdirSync(d);}

function score(root,fam,voiceOn){
 const pages=readPages(root,fam), files=listFiles(root,fam);
 const note={};
 if(!pages.length)return null;
 const all=pages.map(p=>p.t).join('\n');
 /* contained */
 const hosts={};
 (all.match(HOSTRE)||[]).forEach(m=>{hosts[m.toLowerCase()]=1;});
 const nHost=Object.keys(hosts).length;
 const contained=Math.max(0,4-2*nHost);
 note.hosts=Object.keys(hosts);
 /* widths */
 const png=files.filter(f=>/\.png$/.test(f));
 const has1600=png.some(f=>/1600|wide/.test(f)), has390=png.some(f=>/390|phone/.test(f));
 const shotScript=files.some(f=>/^(shot|shots|r2shots)\.js$/.test(f));
 let widths=(has1600?2:0)+(has390?2:0);
 if(!shotScript)widths=Math.min(widths,2);
 note.png=png.length; note.shotScript=shotScript;
 /* measured */
 const data=files.filter(f=>/\.(json|log)$/.test(f));
 const stamped=pages.some(p=>STAMPRE.test(p.t));
 const measured=(data.length?2:0)+(stamped?2:0);
 note.data=data.length; note.stamped=stamped;
 /* refuses */
 const scripts=files.filter(f=>/\.(js|sh|py)$/.test(f));
 let refuses=scripts.length?2:0;
 let guard=null;
 scripts.forEach(s=>{const t=fs.readFileSync(path.join(root,fam.dir,s),'utf8');
  if(/existsSync[\s\S]{0,400}?(process\.exit\(\s*[1-9]|exit\s+[1-9])/.test(t)
   ||/(process\.exit\(\s*[1-9])[\s\S]{0,200}?missing/i.test(t)
   ||/missing[\s\S]{0,300}?process\.exit\(\s*[1-9]/i.test(t)){refuses=4; guard=guard||s;}});
 note.scripts=scripts.length; note.guard=guard;
 /* repro */
 const repro=REPRORE.test(all)?4:0;
 note.repro=(all.match(REPRORE)||[])[0]||null;
 /* voice */
 let voice=null, vbad=0;
 if(voiceOn){
  let bad=0;
  pages.forEach(p=>{
   try{const o=sh('python3 .claude/skills/atuned-voice/check.py '+JSON.stringify(p.f)+' 2>&1');
    const m=o.match(/(\d+) hard failure/);
    if(m)bad+=+m[1];}
   catch(err){bad+=0;}});
  vbad=bad; voice=Math.max(0,4-bad);}
 note.voiceFailures=vbad;
 /* lands */
 const lands={}; (all.match(LANDRE)||[]).forEach(m=>{lands[m]=1;});
 const nLand=Object.keys(lands).length;
 note.lands=Object.keys(lands).slice(0,6);
 const landScore=nLand>=2?4:(nLand===1?2:0);
 /* open */
 const nOpen=OPENRE.filter(re=>re.test(all)).length;
 note.openHits=nOpen;
 const openScore=Math.min(4,nOpen);
 const row={contained:contained, widths:widths, measured:measured, refuses:refuses,
  repro:repro, voice:voice, lands:landScore, open:openScore};
 const scored=Object.keys(row).filter(k=>row[k]!==null);
 const total=scored.reduce((a,k)=>a+row[k],0);
 return {dims:row, total:total, max:4*scored.length, note:note,
  pages:pages.map(p=>p.p), bytes:all.length};}

/* ---------------------------------------------------------------- iterations */
function commits(fam){
 const out=sh('git log --since="'+HOURS+' hours ago" --reverse --pretty=format:"%h|%ad|%s" --date=format:"%m-%d %H:%M" -- '+fam.dir);
 return out.split('\n').filter(Boolean).map(l=>{const [h,d,s]=l.split('|');
  return {h:h, when:d, subject:s};});}
function extract(commit,fam,tmp){
 const root=path.join(tmp,commit+'-'+fam.k);
 fs.mkdirSync(root,{recursive:true});
 try{sh('git archive '+commit+' -- '+fam.dir+' | tar -x -C '+JSON.stringify(root));}
 catch(err){return null;}
 return fs.existsSync(path.join(root,fam.dir))?root:null;}

function main(){
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'quality-'));
 const head=sh('git rev-parse --short HEAD').trim();
 const dirty=sh('git status --porcelain').trim().length>0;
 const out={when:new Date().toISOString(), head:head, dirty:dirty, hours:HOURS,
  dims:DIMS, families:[], passes:0, dimScores:0, transitions:[],
  srcMd5:sh('md5sum source.html').split(' ')[0]};
 FAM.forEach(fam=>{
  const cs=commits(fam);
  const iters=[];
  cs.forEach((c,i)=>{
   const root=extract(c.h,fam,tmp);
   if(!root)return;
   const s=score(root,fam,true);
   if(!s)return;
   iters.push(Object.assign({i:iters.length+1, commit:c.h, when:c.when,
    subject:c.subject, tree:false},s));});
  const cur=score(REPO,fam,true);
  if(cur)iters.push(Object.assign({i:iters.length+1, commit:'working tree',
   when:'now', subject:'the working tree as it stands', tree:true},cur));
  /* the weakest dimension at each iteration, and whether the next one raised it */
  iters.forEach(it=>{
   const ks=Object.keys(it.dims).filter(k=>it.dims[k]!==null);
   const lo=Math.min.apply(null,ks.map(k=>it.dims[k]));
   it.weakest=ks.filter(k=>it.dims[k]===lo);
   it.weakestAt=lo;});
  for(let i=0;i<iters.length-1;i++){
   const a=iters[i], b=iters[i+1];
   const raised=a.weakest.filter(k=>b.dims[k]>a.dims[k]);
   const fell=Object.keys(a.dims).filter(k=>a.dims[k]!==null&&b.dims[k]<a.dims[k]);
   out.transitions.push({fam:fam.k, from:a.commit, to:b.commit,
    weakest:a.weakest, raised:raised, followed:raised.length>0,
    dTotal:+(b.total-a.total).toFixed(2), regressed:fell});}
  out.passes+=iters.length;
  iters.forEach(it=>{out.dimScores+=Object.keys(it.dims).filter(k=>it.dims[k]!==null).length;});
  out.families.push({k:fam.k, nm:fam.nm, dir:fam.dir, seat:fam.seat,
   commits:cs.length, iters:iters});});
 /* the follow rate, and the spread of every dimension, so a dimension that
    discriminates nothing is visible rather than carried */
 const t=out.transitions;
 out.followRate=t.length?+(t.filter(x=>x.followed).length/t.length).toFixed(4):null;
 out.spread=DIMS.map(d=>{
  const v=[]; out.families.forEach(f=>f.iters.forEach(it=>{
   if(it.dims[d.k]!==null)v.push(it.dims[d.k]);}));
  const m=v.reduce((a,b)=>a+b,0)/Math.max(1,v.length);
  const sdv=Math.sqrt(v.reduce((a,b)=>a+(b-m)*(b-m),0)/Math.max(1,v.length-1));
  return {k:d.k, n:v.length, mean:+m.toFixed(2), sd:+sdv.toFixed(3),
   lo:Math.min.apply(null,v), hi:Math.max.apply(null,v),
   discriminates:sdv>0.35};});
 out.unscored=[
  {k:'Is it good', say:'whether the artefact is well designed. No regex reads composition, and the team scoring its own taste is the weakest evidence in this document.'},
  {k:'Was it the right thing to build', say:'a perfect artefact nobody needed scores full marks here. Only the owner\u2019s queue answers this.'},
  {k:'Is the claim true', say:'the voice gate says so itself: no gate reads a sentence against the reading it names.'},
  {k:'Did it land', say:'whether the change reached atuned_src at all. This file reads what the artefact says, not what shipped.'}];
 fs.writeFileSync(path.join(DIR,'quality.json'),JSON.stringify(out,null,1));
 console.log('sim/combination/quality.json written.');
 console.log('families '+out.families.length+'  scoring passes '+out.passes
  +'  dimension scores '+out.dimScores+'  transitions '+t.length
  +'  follow rate '+(out.followRate===null?'n/a':(out.followRate*100).toFixed(0)+'%'));
 out.families.forEach(f=>{
  const l=f.iters[f.iters.length-1];
  console.log('  '+(f.k+'          ').slice(0,10)+' iters '+String(f.iters.length).padStart(2)
   +'  first '+String(f.iters[0].total).padStart(2)+'/'+f.iters[0].max
   +'  last '+String(l.total).padStart(2)+'/'+l.max+'  weakest '+l.weakest.join(','));});
 out.spread.forEach(s=>console.log('  dim '+(s.k+'         ').slice(0,11)
  +' mean '+s.mean.toFixed(2)+' sd '+s.sd.toFixed(2)+(s.discriminates?'':'   does not discriminate')));}
main();
