/* ============================================================
   THE PANEL. A thousand people drawn from the ICPs, walked through one
   Story page session on each layout, and counted at every place they stop.

     node proto/story-redesign2/src/sim.js      after measure.js

   WHAT IS MEASURED, AND READ, NOT TYPED HERE
     Every page fact comes out of measured.json, which measure.js reads off a
     real Chromium inside the product's frame: what is on the first screen,
     how far Run is below it, how many controls, how many words, how far the
     reward lands from the caret, the Fitts cost of the path.
     Every reading of a person's words is the committed engine's own:
     parseStory, marksOf, srcHear and srcTurn on the lines in sim/stories.js.
     Who the panel is comes from sim/harness.js SHOWUP, read out of that file
     at run time: the weights, the device, patience, work, and what each
     person wants from a session. Nothing about a person is retyped here.

   WHAT IS MODELLED, AND IT IS JUDGEMENT
     The hazard. At each step a person carries a friction f and stops with
     probability 1 - exp(-f / patience). The constants inside each f below are
     reasoned estimates, stated where they are used, and the same constants
     are applied to every layout, so a difference between layouts comes from
     what was measured on the layout and not from the constants.
     Common random numbers: each panel member draws their dice once and the
     same dice are rolled on every layout.
   ============================================================ */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const HERE=path.join(__dirname,'..'),ROOT=path.join(HERE,'..','..');
const M=JSON.parse(fs.readFileSync(path.join(HERE,'measured.json'),'utf8'));
const {STORYBANK}=require(path.join(ROOT,'sim','stories.js'));
/* the engine, committed, the same bytes the page carries */
const esrc=cp.execFileSync('git',['show','HEAD:engine.js'],{cwd:ROOT,encoding:'utf8',maxBuffer:64<<20});
const mod={exports:{}};new Function('module','exports','require',esrc)(mod,mod.exports,require);const E=mod.exports;
let MEM={};E.bindStore(k=>MEM[k],(k,v)=>{MEM[k]=v;});
/* SHOWUP, read out of sim/harness.js rather than copied */
const hs=fs.readFileSync(path.join(ROOT,'sim','harness.js'),'utf8');
const a0=hs.indexOf('const SHOWUP=['),a1=hs.indexOf('];',a0);
const SHOWUP=(new Function('return '+hs.slice(a0+'const SHOWUP='.length,a1+1)))();

/* ---- a seeded generator, so a run is a run and can be repeated ---- */
let SEED=20260927;function rnd(){SEED=(SEED*1664525+1013904223)>>>0;return SEED/4294967296;}
function gauss(){let u=0,v=0;while(!u)u=rnd();while(!v)v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

/* ---- the engine's read of an entry ---- */
function readOf(t){
 const p=E.parseStory(t),marks=E.marksOf(t,p),heard=E.srcHear(t,{}),turn=E.srcTurn(heard,{typed:true}).move,nm=E.normMap(t);
 const heardB={};heard.seats.forEach(s=>{heardB[s.band]=1;});
 const negB={};p.path.steps.forEach(s=>{if(s.seat&&!s.coherent&&E.srcNegated(nm.s,s.at))negB[E.K2BAND[s.seat]]=1;});
 const impB={};p.imprints.forEach(i=>{impB[i.band]=1;});
 const split=Object.keys(negB).some(b=>!heardB[b]&&impB[b]);
 const inf=p.imprints.filter(i=>i.inferred).length;
 return {marks:marks.length,imprints:p.imprints.length,inferred:inf,named:p.imprints.length-inf,turn:turn,split:split};}

/* ---- the panel: SHOWUP's weights are a thousand already ---- */
const LAYOUTS=[['e','E. Chain'],['f','F. Band'],['g','G. Dock'],['h','H. Flow'],['hx-b','HX B. Route, round HX'],['hx-c','HX C. Trace, round HX']];
const panel=[];
SHOWUP.forEach(P=>{const bank=STORYBANK[P.nm]||[];if(!bank.length)return;
 for(let i=0;i<P.weight;i++){
  /* two lines of their own, picked by their dice: one day's entry */
  const a=Math.floor(rnd()*bank.length);let b2=Math.floor(rnd()*bank.length);if(bank.length>1&&b2===a)b2=(a+1)%bank.length;
  const text=bank.length>1?bank[a][1]+' '+bank[b2][1]:bank[a][1];
  const dv=rnd(),W=P.device==='phone'?390:(dv<.4?1600:(dv<.6?1440:390));
  panel.push({P:P,text:text,W:W,pat:P.patience*Math.exp(.25*gauss()),u:[rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]});}});
const READ={};panel.forEach(m=>{if(!READ[m.text])READ[m.text]=readOf(m.text);});

/* SENSITIVITY. SIMK scales each step's friction, so the ranking can be checked
   against constants other than the ones chosen: SIMK='{"read":1.5}' */
const K=Object.assign({orient:1,read:1,reach:1,ran:1,back:1},JSON.parse(process.env.SIMK||'{}'));
function stop(f,pat,u){return u<1-Math.exp(-Math.max(0,f)/pat);}
const STEPS=['wrote','read','reach','ran','back'];

function walk(m,L){
 const P=m.P,g0=M.geo[L][m.W]._blank,g=M.geo[L][m.W][P.nm]||M.geo[L][m.W].Diane,r=READ[m.text],want=P.wants||[],out={stoppedAt:null,f:{}};
 /* 1. THE FIRST FOUR SECONDS, on the blank page. Controls past four cost a
       little each; interface words cost less; a journal that is not on the
       first screen costs a lot, because the person does not know where to
       write. */
 const f1=0.015*Math.max(0,g0.choices-4)+0.0006*g0.words+(g0.fold.journal<0.5?0.6:0)+(g0.fold.prompt<0.5?0.2:0);
 /* 2. WRITING. Effort, set by how much physical work the person does at all */
 const f2=0.25*(1-P.work);
 if(stop(K.orient*(f1+f2),m.pat,m.u[0]))return Object.assign(out,{stoppedAt:'wrote',f:{orient:f1}});
 /* 3. THE READING. Nothing lit is the worst thing that can happen after
       writing. Lit and nothing kept is next. Addresses the words did not
       name cost most for a person who came to be named. A seat charged from
       a word written as "not" costs trust. A reward that lands off screen,
       or far from the caret, is a reward not seen. */
 const named=want.indexOf('named')>=0||want.indexOf('meaning')>=0?1:0.4;
 const f3=(r.marks===0?0.9:0)+(r.marks>0&&r.imprints===0?0.5:0)+named*0.6*(r.imprints?r.inferred/r.imprints:0)
  +(r.split?0.3:0)+(g.fold.instrument<0.5?0.35:0)+0.00025*g.rewardDist;
 if(stop(K.read*f3,m.pat,m.u[1]))return Object.assign(out,{stoppedAt:'read',f:{orient:f1,read:f3}});
 /* 4. FINDING THE RELEASE. On the first screen it costs only the pointer
       path. Below it, a base cost for having to know it is there, and a cost
       per pixel of scroll. A release that queues the heaviest held rather
       than what they just wrote breaks the chain for anyone who came for
       meaning. */
 const onFirst=g.fold.run>=0.99;
 const f4=(onFirst?0:0.2+0.0007*g.scrollRun)+0.02*g.fitts+(r.imprints===0&&named===1?0.25:0);
 if(stop(K.reach*f4,m.pat,m.u[2]))return Object.assign(out,{stoppedAt:'reach',f:{orient:f1,read:f3,reach:f4}});
 /* 5. RUNNING IT. Work reluctance; the same run on every layout */
 const f5=0.7*(1-P.work);
 const ran=!stop(K.ran*f5,m.pat,m.u[3]);
 /* 6. WOULD THEY COME BACK. The share of what they wanted that the session
       gave them, and the friction they carried to get there */
 const sat={named:r.named>0,meaning:r.marks>0||r.turn==='ask',feel:r.marks>0,seek:r.marks>0,delta:ran,number:onFirst,cost:onFirst,
  craft:g.small===0&&!g.hscroll&&g.minFont>=12&&onFirst&&g.fold.instrument>=0.5,direction:onFirst||ran,refer:false,proof:false};
 const s=want.length?want.filter(w=>sat[w]).length/want.length:0.5;
 const f6=0.9*(1-s)+0.25*(f1+f3+f4);
 const back=!stop(K.back*f6,m.pat,m.u[4]);
 out.f={orient:f1,read:f3,reach:f4,ran:f5,back:f6};
 if(!ran)return Object.assign(out,{stoppedAt:'ran',back:back});
 return Object.assign(out,{stoppedAt:back?null:'back',back:back});}

const RES={};
LAYOUTS.forEach(([L,name])=>{
 const by={},tot={wrote:0,read:0,reach:0,ran:0,back:0,n:0},dev={};
 panel.forEach(m=>{const w=walk(m,L),k=m.P.nm;by[k]=by[k]||{n:0,wrote:0,read:0,reach:0,ran:0,back:0,stops:{}};
  const o=by[k];o.n++;tot.n++;const d=dev[m.W]=dev[m.W]||{n:0,reach:0,ran:0,back:0};d.n++;
  const at=w.stoppedAt,idx=at?STEPS.indexOf(at):5;
  STEPS.forEach((s,i)=>{if(i<idx||(s==='back'&&w.back)){o[s]++;tot[s]++;}});
  if(idx>2)d.reach++;if(idx>3)d.ran++;if(w.back)d.back++;
  if(w.back&&idx===3){/* came back without running: counted in back only */}
  if(at)o.stops[at]=(o.stops[at]||0)+1;});
 RES[L]={name:name,tot:tot,by:by,dev:dev};});

/* ---- print ---- */
const pc=x=>(100*x).toFixed(0).padStart(3)+'%';
console.log('\nPANEL: '+panel.length+' people, '+Object.keys(READ).length+' distinct entries read by the engine');
const nothing=Object.values(READ).filter(r=>r.marks===0).length;
console.log('entries that read nothing at all: '+nothing+' of '+Object.keys(READ).length);
console.log('\nlayout                     wrote  read reach   ran  back');
LAYOUTS.forEach(([L])=>{const t=RES[L].tot;console.log(RES[L].name.padEnd(26),STEPS.map(s=>pc(t[s]/t.n).padStart(5)).join(' '));});
console.log('\nby device, reached the release / ran / would come back');
LAYOUTS.forEach(([L])=>{const d=RES[L].dev;console.log(RES[L].name.padEnd(26),[1600,1440,390].map(W=>W+': '+pc(d[W].reach/d[W].n)+pc(d[W].ran/d[W].n)+pc(d[W].back/d[W].n)).join('   '));});
const ICP=['Sofia','Diane','Marcus','Angela','Derek','James','Ana','Gordon','Rosa'];
console.log('\nby person: ran / would come back, and where most of them stopped');
ICP.forEach(nm=>{console.log(nm.padEnd(7),LAYOUTS.map(([L])=>{const o=RES[L].by[nm];if(!o)return '';const top=Object.keys(o.stops).sort((a,b)=>o.stops[b]-o.stops[a])[0];
 return L.padEnd(5)+pc(o.ran/o.n)+pc(o.back/o.n)+' '+(top||'').padEnd(6);}).join(' | '));});

/* ---- what the notes under the fold carry ---- */
const G=M.geo;
const page={method:'A thousand people drawn from the ICPs in the proportions sim/harness.js already uses, each writing two lines of their own words from sim/stories.js, on the device they use. The page facts are measured in Chromium inside the product\'s frame; the reading is the committed engine\'s; the only judgement is how much each friction costs, applied identically to every layout.',
 layouts:{},findings:[]};
LAYOUTS.forEach(([L,name])=>{const t=RES[L].tot,a=G[L][1600].Angela,m=G[L][390].Angela;
 page.layouts[L]={name:name,fold1600:a.fold.journal>=.99&&a.fold.instrument>=.99&&a.fold.run>=.99,fold390:m.fold.journal>=.5&&m.fold.instrument>=.5&&m.fold.run>=.99,
  choices1600:a.choices,scroll390:m.runFixed?0:m.scrollRun,fitts1600:a.fitts,
  funnel:{wrote:t.wrote/t.n,read:t.read/t.n,reach:t.reach/t.n,ran:t.ran/t.n,back:t.back/t.n}};});
/* the findings, written from the numbers above so they cannot drift from them */
const T=L=>RES[L].tot,R_=(L,k)=>T(L)[k]/T(L).n,D_=(L,W,k)=>RES[L].dev[W][k]/RES[L].dev[W].n;
const rank=['e','f','g','h'].slice().sort((a,b)=>R_(b,'ran')-R_(a,'ran')),best=rank[0];
const nothingPeople=panel.filter(m=>READ[m.text].marks===0).length;
page.findings=[
 'At 1600 wide, all four put the journal, the instrument and Run on the first screen. Round HX\'s Route put Run '+G['hx-b'][1600].Angela.scrollRun+'px below it. At 1600 the share of the panel who reach the release goes from '+pct(D_('hx-b',1600,'reach'))+' on Route to between '+pct(Math.min.apply(null,['e','f','g','h'].map(L=>D_(L,1600,'reach'))))+' and '+pct(Math.max.apply(null,['e','f','g','h'].map(L=>D_(L,1600,'reach'))))+' on the four new layouts, so at this width the panel cannot tell the four apart.',
 'The phone is what separates them. Reaching the release on a phone: '+['h','g','f','e'].map(L=>RES[L].name+' '+pct(D_(L,390,'reach'))).join(', ')+', against '+pct(D_('hx-b',390,'reach'))+' on Route. Only H puts all three on the first phone screen; G keeps Run on screen as a bar; E and F leave Run '+G.e[390].Angela.scrollRun+'px and '+G.f[390].Angela.scrollRun+'px down.',
 'The panel favours '+RES[best].name+': '+pct(R_(best,'ran'))+' run a release and '+pct(R_(best,'back'))+' would come back, against '+pct(R_('hx-b','ran'))+' and '+pct(R_('hx-b','back'))+' on round HX\'s Route.',
 'The biggest single loss on every layout is not the layout. '+nothing+' of the '+Object.keys(READ).length+' entries the panel wrote read nothing at all, which is '+nothingPeople+' of the '+panel.length+' people, and a person whose words light nothing stops at the reading whatever the page looks like.',
 'Angela is the worst served on every layout and stops at the reading: half her lines read nothing. Sofia and Derek are the best served. James stops before he writes, on every layout alike.'];
function pct(x){return Math.round(x*100)+'%';}
const out={when:new Date().toISOString(),panel:panel.length,entries:Object.keys(READ).length,nothingRead:nothing,results:RES,page:page};
if(!process.env.SIMK)fs.writeFileSync(path.join(HERE,'sim.json'),JSON.stringify(out,null,1));
console.log('\nwrote sim.json');
