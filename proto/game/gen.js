#!/usr/bin/env node
/* ============================================================
   THE PROTOTYPE'S DATA. Dumped out of the real engine, so nothing on the page
   was authored by hand.

   Same method as proto/field and proto/feather: engine.js driven headless, a
   persona loaded off the roster, compute() run, the ladder read, the content
   chain run, and the whole lot written as one JSON blob the page carries
   inline. The page then has no dependency and makes no request.

   Run:  node proto/game/gen.js > proto/game/data.json
   ============================================================ */
const path=require('path'), fs=require('fs');
const R=path.resolve(__dirname,'../..');
const E=require(path.join(R,'engine.js'));
const CHAIN=require('./chain.js'), STEM=require('./stem.js'), FRAMES=require('./frames.js');
const {S,CHARGES,SINAMES,PEOPLE,LAWSET,buildSoul,compute,W,PRACTICE,CHILD,MARKS,
       ladderRead,ledgerRead,streakRead,PAL,blankProfile}=E;

/* ---- the persona, loaded exactly as ui/personas.js loads one ---- */
function loadPerson(p){
 S.dom=p.dom; S.a1=p.a1; S.a2=p.a2;
 S.doms=[p.dom]; S.arcs=[p.a1,p.a2]; S.roots=[];
 buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:5.5};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5);});
 return compute();}

const WHO='Diane';
const per=PEOPLE.find(x=>x.nm===WHO);
const r=loadPerson(per);

/* ---- the entry. Written as an example, in her voice, and every number the
   page prints about it is computed from it by the real engine. ---- */
const ENTRY="Board call ran to nine again. I said yes to the extra review because "
 +"saying no felt worse than the work, and the work is never done. Rest feels "
 +"like a moral failure. I can never say what I actually mean in front of them, "
 +"so I write it down afterwards instead and then delete it.";

const LEXKEYS=(function(){
 const s=fs.readFileSync(path.join(R,'engine.js'),'utf8');
 const i=s.indexOf('var LEX={'), j=s.indexOf('\nvar ',i+10);
 const blk=s.slice(i,j), re=/(?:'([a-z][a-z' ]*)'|\b([a-z]{2,})\s*):\s*\[/g;
 let m, keys=[]; while((m=re.exec(blk))!==null)keys.push(m[1]||m[2]);
 return [...new Set(keys)];})();
const KNOWN={}; LEXKEYS.forEach(k=>KNOWN[k]=1);
const IX=STEM.index(LEXKEYS);
const fold=STEM.fold(ENTRY,IX,KNOWN);
const parsed=E.parseStory(fold.text);
if(parsed.path&&parsed.path.kink&&fold.back[parsed.path.kink.word])
 parsed.path.kink.word=fold.back[parsed.path.kink.word];
const frames=FRAMES.framesIn(ENTRY);
const chain=CHAIN.chainOf(ENTRY,parsed,CHILD,frames);

/* ---- AND A FRAME HAS TO PRODUCE AN IMPRINT, NOT ONLY A SPAN.

   Measured on this entry: the sniffer as built reads it as nothing at all,
   zero imprints, even with the stemmer folded in, and the two frames carry the
   whole reading. So a frame layer that only fed the content chain would leave
   the body map empty on a sentence the product had plainly understood. A frame
   carries a seat, an intensity and a stated fetter, which is exactly the three
   things a LEX word with a third element carries, so it feeds the same
   arithmetic parseStory already uses: the band total over three, capped at
   ten, shared across up to four addresses of the named fetter at that seat,
   sorted by susceptibility. Nothing new is invented, the existing rule is
   given a new kind of hit.

   The addresses come from W, the real 112, so these are real addresses. ---- */
const K2B={root:'Root',sacral:'Sacral',solar:'Solar',heart:'Heart',
 throat:'Throat',eye:'3rd Eye',crown:'Crown'};
function frameImprints(fs){
 var byBand={}, fet={};
 fs.forEach(f=>{ if(f.seat==='coherent')return;
  byBand[f.seat]=(byBand[f.seat]||0)+f.amt; if(f.fet)fet[f.seat]=f.fet; });
 var out=[];
 Object.keys(byBand).forEach(k=>{
  var bn=K2B[k]; if(!bn)return;
  var all=W.filter(n=>n.b===bn&&n.cf);
  var seg=fet[k]?all.filter(n=>n.cf===fet[k]):[];
  if(!seg.length)seg=all;
  seg=seg.slice().sort((a,b)=>(b.susc||1)-(a.susc||1));
  var total=Math.min(10,byBand[k]/3), share=total/Math.min(4,seg.length);
  seg.slice(0,4).forEach(n=>out.push({node:n.i, name:n.k, band:bn, fetter:n.cf,
   inferred:!fet[k], amt:Math.round(share*10)/10, from:'frame'}));});
 return out;}
const FIMP=frameImprints(frames);
const bad=CHAIN.verbatim(ENTRY,chain);
if(bad.length){console.error('VERBATIM FAILURE, refusing to write data: '+bad.join('; '));process.exit(1);}

/* ---- the record. A profile built out of a plausible fortnight, then read by
   the real engine.ladder functions rather than by anything here. ---- */
const now=Date.parse('2026-09-20T19:00:00Z');
const DAY=86400000;
const prof=blankProfile('Diane');
/* eleven practised days out of the last fourteen, with one two day gap, so the
   halving has something to do and the streak is a real streak. */
const pattern=[13,12,11,10,9,8,6,5,4,3,2,1,0];
prof.rituals=pattern.map((back,i)=>({t:new Date(now-back*DAY).toISOString(),
 track:'Somatic', band:'Solar', steps:['truth'], min:2,
 when:'after the last call of the day', where:'the chair by the window',
 done:new Date(now-back*DAY+3600000).toISOString()}));
prof.story={entries:[
 {t:new Date(now-9*DAY).toISOString(), text:ENTRY, imprints:parsed.imprints.length, bands:parsed.bands},
 {t:new Date(now-4*DAY).toISOString(), text:ENTRY, imprints:parsed.imprints.length, bands:parsed.bands},
 {t:new Date(now).toISOString(), text:ENTRY, imprints:parsed.imprints.length, bands:parsed.bands}]};
prof.meter={lines:96, unique:new Array(24).fill(0).map((_,i)=>'k'+i), firsts:{}};
prof.axes={}; CHILD.forEach((c,i)=>{prof.axes[c.nm]={held:(S.charge[c.nm]||0), opp:(i<2?5.2:0)};});
prof.history=new Array(6).fill(0).map((_,i)=>({t:new Date(now-(12-i*2)*DAY).toISOString(),
 cq:+(24+i*0.9).toFixed(1), jq:+(3.9-i*0.07).toFixed(2)}));
prof.intake={completedAt:new Date(now-11*DAY).toISOString()};
prof.seed='ESFJ';

const led=ledgerRead(prof), stk=streakRead(prof,now), lad=ladderRead(prof,now);

/* ---- the awards. Three families, and the third exists because of a
   measurement: four of the sixteen marks can never be earned by anybody whose
   reading holds nothing above the release threshold. ---- */
const releasable=W.filter(n=>n.sq>=4).length;
const AWARDS=[
 {k:'cleared', fam:'Cleared', b:'Throat', nm:'Ground cleared',
  d:'An address that was carrying is held at the opposite pole instead.',
  needs:'a release', reach:releasable>0,
  got:led.clear>=1, n:led.clear},
 {k:'held', fam:'Held', b:'Heart', nm:'Seven days at the pole',
  d:'An axis that stayed at its coherent pole for seven readings in a row.',
  needs:'a reading, and nothing else', reach:true,
  got:stk.days>=7, n:stk.days},
 {k:'moved', fam:'Moved', b:'Root', nm:'A band crossed',
  d:'Coherence crossed a band boundary, in either direction, on a date.',
  needs:'two readings', reach:true,
  got:prof.history.length>=2, n:prof.history.length}];

/* ---- what the practice looks like with the graft in it ---- */
const TRACK4BAND={Root:'Body',Sacral:'Somatic',Solar:'Somatic',Heart:'Body',
 Throat:'Mind','3rd Eye':'Mind',Crown:'Energy'};
const track=TRACK4BAND[r.darkB]||'Body';
const tier=r.DQ>=8?1:(r.DQ>=4?2:3);
const fit=PRACTICE.filter(p=>p.tier<=tier);
const inTrack=fit.filter(p=>p.track===track);
const lightest=set=>set.slice().sort((a,b)=>(a.min-b.min)||(a.tier-b.tier))[0];
const called=inTrack.length?lightest(inTrack):lightest(fit);
const truth=PRACTICE.find(p=>p.k==='truth');

/* ---- the bank. Rates from tools/loopsim.js section F. ---- */
const EARN={ritual:1, journal:1, mark:5, award:5, season:8};
const earned=led.done*EARN.ritual
 + prof.story.entries.length*EARN.journal
 + lad.earned.length*EARN.mark
 + AWARDS.filter(a=>a.got).length*EARN.award
 + Math.floor(led.done/7)*EARN.season;

const OUT={
 stamp:new Date().toISOString(),
 who:WHO, role:per.role, says:per.says,
 reading:{CQ:+r.CQ.toFixed(1), DQ:+r.DQ.toFixed(2), band:r.band||null,
  seat:r.darkB, tier:tier, track:track, releasable:releasable,
  loaded:(r.loaded||[]).length, sabs:(r.sabs||[]).length},
 entry:ENTRY,
 chain:{span:chain.span, second:chain.second, fetter:chain.fetter, opp:chain.opp,
  seat:chain.seat, oppSeat:chain.oppSeat, affirm:chain.affirm, from:chain.from,
  why:chain.why, folded:fold.folded,
  imprintsBuilt:parsed.imprints.slice(0,6).map(i=>({name:i.name, band:i.band,
   fetter:i.fetter, amt:i.amt, inferred:!!i.inferred, from:'word'})),
  imprints:parsed.imprints.concat(FIMP).slice(0,8).map(i=>({name:i.name, band:i.band,
   fetter:i.fetter, amt:i.amt, inferred:!!i.inferred, from:i.from||'word'})),
  frames:frames.map(f=>({nm:f.nm, seat:f.seat, amt:f.amt, span:f.span, at:f.at}))},
 practice:{called:called, graft:chain.span?chain.span.text:null,
  floor:{nm:truth.nm, min:truth.min, how:truth.how}},
 record:{ledger:led, streak:{run:stk.run, live:stk.live, best:stk.best, days:stk.days, gap:stk.gap},
  days:pattern.slice().reverse()},
 marks:{all:MARKS.map(m=>({k:m.k, fam:m.fam, b:m.b, nm:m.nm, d:m.d, ic:m.ic})),
  earned:lad.earned.map(m=>m.k), next:lad.next?lad.next.k:null},
 awards:AWARDS,
 bank:{earned:earned, granted:100, spentFloor:4, runCap:25,
  rates:EARN, weekDaily:7*(EARN.ritual+EARN.journal)+EARN.season, allowance:10},
 pal:PAL, unreachable:(releasable===0?4:0)};
process.stdout.write(JSON.stringify(OUT,null,1));
