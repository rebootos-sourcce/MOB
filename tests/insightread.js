/* ============================================================
   THE INSIGHT READING, HEADLESS. engine/insight.js, 18 November.

   The owner: "Whatever I select, it should give me source AI's reading of the
   cascade of that information, how it flows through me, and what the
   appropriate actions are." And: "The insight panel will always show 3
   paragraphs with dots for more information."

   The reading is composed with no language model, from fixed templates and
   named record fields, so every property that makes it honest can be read off
   the output without a browser:

     three paragraphs on every page, under the three fixed headers
     every segment names the field it came from, and the name resolves
     every percent in a sentence is fmtPct of a field the segment traces
     no decimal anywhere, no em dash, no word an offer is banned from
     every quotation is a substring of its source
     the same input is byte for byte the same output, and nothing it reads
     is changed by reading it
     the safety line is the whole third paragraph when the check holds
     an overshot pattern is never offered a release
     a blank record reads nothing, and a pattern that is gone says so
     no paragraph is longer than its ceiling, and the three together stay
     inside 210 words

   Run from the repo root:  node tests/insightread.js
   ENGINE=path runs it against another build.
   node tools/insightread-mutants.js breaks engine.js one way at a time and names
   the group that notices each break.
   ============================================================ */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
const {S,CHARGES,PEOPLE,SINAMES,LAWSET,compute,buildSoul,fmtPct,PCT_DASH,CHILD,W,BY,NODES,
 insightRead,insightRelease,insightResolve,insightText,INS_HEAD,INS_MAX,INS_LIST,CRISIS_SAY}=E;
let P=0,F=0,GRP='';
const g=n=>{GRP=n;console.log('\n'+n);};
const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};

const BAN=/\b(should|must|need to|needs to|have to|has to)\b/i;
function load(p){
 S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
 SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:LS._);
 SINAMES.forEach(l=>{E.LAW_UNSET[l]=false;});
 return compute();}
/* every kind of selection the rail can hold, on one reading */
function selections(r){
 const out=[];
 ['sab','cx','hy','sup'].forEach(k=>(r[INS_LIST[k]]||[]).forEach(o=>out.push({kind:k,nm:o.nm})));
 CHILD.forEach(c=>out.push({kind:'fet',nm:c.nm}));
 W.slice().sort((a,b)=>b.sq-a.sq).slice(0,4).forEach(n=>out.push({kind:'addr',i:n.i}));
 out.push({kind:'addr',i:8});                       /* Entitlement: no child emotion */
 out.push({kind:'dom',nm:E.DOMAINS[S.doms[0]].nm});
 E.DOMAINS.forEach(d=>out.push({kind:'dom',nm:d.nm}));
 out.push({kind:'arch',nm:E.ARCH[0].nm},{kind:'mask',nm:E.MASKS[0].nm},{kind:'law',nm:SINAMES[0]},
  {kind:'seat',nm:'Root'},{kind:'seat',nm:'3rd Eye'},{kind:'core'},{kind:'path',nm:'Compass'},
  {kind:'bal',nm:'Balance'},{kind:'gates',nm:'Awareness'},{kind:'pole',nm:'The upward cone'});
 return out;}
const words=s=>String(s).trim().split(/\s+/).filter(Boolean).length;
const paraWords=p=>words(p.h+' '+p.segs.map(s=>s.text).join(' '));
const textOf=out=>out.pages.map(pg=>insightText(pg.paras)).join('\n');
const clone=x=>JSON.parse(JSON.stringify(x));

g('IN0 · the composer is exported and the host stays out of it');
ok(typeof insightRead==='function'&&typeof insightRelease==='function'&&typeof insightResolve==='function'
 &&typeof insightText==='function','insightRead, insightRelease, insightResolve and insightText are exported');
ok(INS_HEAD.join('|')==='Where it sits.|How it runs.|What to do.','the three headers are fixed labels, in that order');
ok(INS_MAX.length===3&&INS_MAX[0]+INS_MAX[1]+INS_MAX[2]<=210,'the three ceilings add to no more than 210 words, '+INS_MAX.join('+'));
ok(typeof E.leaves==='function'&&typeof E.patFam==='function','leaves and patFam live in the engine now');
{
 const r=load(PEOPLE.find(p=>p.nm==='Lance 15'));
 const o=r.hys[0];
 ok(E.leaves(o).length>0&&E.leaves(o).every(n=>!n.parts),'leaves() returns addresses, never a parent');
 ok(E.leaves(o).length===new Set(E.leaves(o).map(n=>n.i)).size,'and each address once');
 ok(E.patFam(o)&&E.patFam(o).nm===o.nm,'patFam() of a hyper complex is itself');
 ok(E.patFam(null)===null,'and of nothing is nothing');
}

g('IN1 · every persona, every kind of selection');
let pagesSeen=0, kindsSeen={}, withPct=0;
PEOPLE.forEach(p=>{
 const r=load(p);
 if(r.unread)return;
 const before=JSON.stringify({c:S.charge,rp:S.replace,l:S.law}), rj=JSON.stringify(r.sabs.map(x=>x.w));
 const bad={three:[],head:[],src:[],resolve:[],fig:[],pct:[],dec:[],quote:[],ban:[],dash:[],det:[],words:[],total:[],pages:[],kind:[]};
 selections(r).forEach(sel=>{
  const a=insightRead(sel,r,null,{}), b=insightRead(sel,r,null,{});
  const tag=p.nm+' '+sel.kind+' '+(sel.nm||sel.i);
  if(!a.ok){ if(INS_LIST[sel.kind]||sel.kind==='fet'||sel.kind==='dom')bad.three.push(tag+' did not read: '+a.why); return;}
  kindsSeen[sel.kind]=1;
  if(JSON.stringify(a)!==JSON.stringify(b))bad.det.push(tag);
  if(a.pages.length<1||a.pages.length>5)bad.pages.push(tag+' '+a.pages.length);
  const keys=a.pages.map(x=>x.key); if(keys.length!==new Set(keys).size)bad.pages.push(tag+' repeats a page');
  a.pages.forEach((pg,pi)=>{
   pagesSeen++;
   if(pg.paras.length!==3)bad.three.push(tag+' page '+pi+' has '+pg.paras.length);
   if(!/^Page \d+ of \d+, .+/.test(pg.aria)||!pg.tip)bad.pages.push(tag+' page '+pi+' has no name');
   let tot=0;
   pg.paras.forEach((para,j)=>{
    if(para.h!==INS_HEAD[j])bad.head.push(tag+' '+para.h);
    if(!para.segs.length)bad.three.push(tag+' page '+pi+' paragraph '+j+' is empty');
    const w=paraWords(para); tot+=w;
    if(w>INS_MAX[j])bad.words.push(tag+' p'+(j+1)+' '+w+' words');
    para.segs.forEach(sg=>{
     if(!sg.text||!sg.kind){bad.src.push(tag+' empty segment');return;}
     if(['model','mine','quote','book','offer','gap'].indexOf(sg.kind)<0)bad.kind.push(tag+' '+sg.kind);
     if(!(sg.src instanceof Array)||!sg.src.length||sg.src.some(x=>!x))bad.src.push(tag+' '+sg.text.slice(0,40));
     else sg.src.forEach(path=>{if(insightResolve(path,r)===undefined)bad.resolve.push(tag+' '+path);});
     const pcts=sg.text.match(/\d+%/g)||[];
     if(pcts.length)withPct++;
     const allowed=(sg.fig||[]).map(f=>fmtPct(f[0],f[1]));
     (sg.fig||[]).forEach((f,k)=>{if(sg.text.indexOf(allowed[k])<0)bad.fig.push(tag+' '+sg.text.slice(0,50)+' wants '+allowed[k]);});
     pcts.forEach(x=>{if(allowed.indexOf(x)<0)bad.pct.push(tag+' prints '+x+' with no field behind it: '+sg.text.slice(0,60));});
     if(/\d\.\d|NaN|undefined|null/.test(sg.text))bad.dec.push(tag+' '+sg.text.slice(0,60));
     if((/%/.test(sg.text)||/\b(plexus|nerve|ganglion|branches)\b|\b(in|at) the [\w -]+ seat\b/i.test(sg.text))&&sg.speak)bad.pct.push(tag+' says a percent or a body place aloud: '+sg.text.slice(0,40));
     if(sg.q){const v=insightResolve(sg.src[0],r); if(typeof v!=='string'||v.indexOf(sg.q)<0)bad.quote.push(tag+' '+sg.q.slice(0,50));
      if(sg.text.indexOf('“'+sg.q+'”')<0)bad.quote.push(tag+' quote not marked in its own sentence');}
     /* an address is called Need To Be Needed, so a fact read off the record or the map is not held to the banned list; what the composer offers, quotes and says is missing is */
     if(['offer','gap','book'].indexOf(sg.kind)>=0&&BAN.test(NODES.reduce((x,n)=>x.split(n.k).join(' '),sg.text)))bad.ban.push(tag+' '+sg.text.slice(0,60));
     if(/\u2014|--/.test(sg.text))bad.dash.push(tag+' '+sg.text.slice(0,60));
     if(sg.kind==='offer'&&!/(is available|you can|if you want|works its heaviest|lowers the charge|installs)/.test(sg.text))bad.ban.push(tag+' offer without an offer form: '+sg.text.slice(0,60));
    });});
   if(tot>210)bad.total.push(tag+' page '+pi+' '+tot+' words');});});
 Object.keys(bad).forEach(k=>ok(bad[k].length===0,p.nm+': '+k+' holds, '+bad[k].length+' break it'+(bad[k][0]?', first: '+bad[k][0]:'')));
 ok(before===JSON.stringify({c:S.charge,rp:S.replace,l:S.law})&&rj===JSON.stringify(r.sabs.map(x=>x.w)),
  p.nm+': reading it changes nothing it reads');});
ok(pagesSeen>800,'a real number of pages were read, '+pagesSeen);
ok(withPct>400,'and a real number of sentences carry a percent, '+withPct);
['sab','cx','hy','sup','fet','addr','dom','arch','mask','law','seat','core'].forEach(k=>ok(kindsSeen[k],'the reading covered a '+k));

g('IN2 · what a reading says when the data is thin');
{
 const blank=E.blankProfile('blank'); E.loadProfile(blank);
 const rb=compute();
 ok(rb.unread,'a blank profile is unread');
 ['sab','fet','addr','dom','law','core'].forEach(k=>{
  const a=insightRead({kind:k,nm:k==='dom'?E.DOMAINS[0].nm:(k==='fet'?CHILD[0].nm:'x'),i:1},rb,null,{});
  ok(a.ok===false&&a.why==='unread','a blank record reads nothing for a '+k+', it says it is unread');});
 ok(insightRead(null,rb,null,{}).ok===false,'and nothing selected reads nothing');
 const r=load(PEOPLE.find(p=>p.nm==='Lance 15'));
 const gone=insightRead({kind:'sab',nm:'No Such Saboteur'},r,null,{});
 ok(gone.ok===false&&gone.why==='gone','a pattern that is no longer running says it is gone, never reads another');
 /* Rosa carries one child emotion and no patterns */
 const ra=load(PEOPLE.find(p=>p.nm==='Rosa'));
 if(!ra.unread){
  const c=insightRead({kind:'fet',nm:CHILD.find(x=>(S.charge[x.nm]||0)>0)?CHILD.find(x=>(S.charge[x.nm]||0)>0).nm:CHILD[0].nm},ra,null,{});
  ok(c.ok&&c.pages[0].paras.length===3,'a child emotion reads on a record with no patterns, three paragraphs');}
 /* an unnamed saboteur is named by its seat and its feeling, and borrows no card */
 const un=(r.sabs||[]).concat(...PEOPLE.map(p=>{const x=load(p);return x.sabs||[];})).find(s=>s.unnamed);
 if(un){
  const rr=PEOPLE.map(p=>load(p)).find(x=>(x.sabs||[]).some(s=>s.unnamed&&s.nm===un.nm))||r;
  const o=insightRead({kind:'sab',nm:un.nm},rr,null,{});
  const t=o.ok?textOf(o):'';
  ok(o.ok&&/no name for this cluster/.test(o.pages[0].paras[0].segs.map(s=>s.text).join(' ')),'an unnamed saboteur says the library has no name for it');
  ok(o.ok&&!o.pages[0].paras[0].segs.some(s=>s.q&&/^SABDEF/.test(s.src[0])),'and quotes no saboteur record that is not its own');}
}

g('IN3 · the safety door is never behind an offer');
{
 const r=load(PEOPLE.find(p=>p.nm==='Lance 15'));
 const sels=selections(r).filter(s=>INS_LIST[s.kind]||s.kind==='fet'||s.kind==='addr'||s.kind==='dom');
 let bad=[];
 sels.forEach(sel=>{
  const a=insightRead(sel,r,null,{safe:true});
  if(!a.ok){bad.push(sel.kind+' '+(sel.nm||sel.i)+' did not read'); return;}
  a.pages.forEach(pg=>{
   const p3=pg.paras[2];
   if(p3.segs.length!==1||p3.segs[0].text!==CRISIS_SAY.q)bad.push(sel.kind+' '+(sel.nm||sel.i)+' p3 is not the safety line alone: '+p3.segs.map(s=>s.text).join(' ').slice(0,60));
   pg.paras.forEach(pa=>pa.segs.forEach(sg=>{if(sg.kind==='offer')bad.push('an offer stands beside the safety line: '+sg.text.slice(0,50));}));});});
 ok(bad.length===0,'with the safety check on, the third paragraph is the one safety line on every page and nothing is offered, '+bad.length+' break it'+(bad[0]?', first: '+bad[0]:''));
 ok(CRISIS_SAY&&CRISIS_SAY.q&&CRISIS_SAY.q.length>10,'and that line exists');
}

g('IN4 · a release is offered where it can run, and nowhere else');
{
 const bySq=n=>n.sq;
 let overSeen=0, canSeen=0, bad=[];
 PEOPLE.forEach(p=>{
  const r=load(p); if(r.unread)return;
  ['sab','cx','hy','sup'].forEach(k=>(r[INS_LIST[k]]||[]).forEach(o=>{
   const x=insightRelease({kind:k,nm:o.nm},r,{});
   if(o.over){overSeen++;
    if(x.ok)bad.push(p.nm+' '+o.nm+' is overshot and offers a release');
    const a=insightRead({kind:k,nm:o.nm},r,null,{});
    if(a.ok&&a.pages[0].paras[2].segs.some(s=>s.kind==='offer'))bad.push(p.nm+' '+o.nm+' is overshot and its third paragraph offers');}
   else{
    const held=E.leaves(o).filter(n=>n.cf&&n.sq>=1);
    if(x.ok!==(held.length>0))bad.push(p.nm+' '+o.nm+' release '+x.ok+' against '+held.length+' addresses');
    if(x.ok){canSeen++;
     if(x.ids.length!==held.length)bad.push(p.nm+' '+o.nm+' ids '+x.ids.length+' against '+held.length);
     if(!held.some(n=>n.i===x.first.i))bad.push(p.nm+' '+o.nm+' starts at an address it does not hold');}}}));
  const top=W.filter(n=>n.cf&&n.sq>=1).sort((a,b)=>b.sq-a.sq)[0];
  if(top){const x=insightRelease({kind:'addr',i:top.i},r,{}); if(!x.ok||x.first.i!==top.i)bad.push(p.nm+' the heaviest address offers no release');}
  /* no roster record holds charge at Entitlement, so the check would pass on an empty list: give it some, and put it back */
  const was8=BY[8].sq; BY[8].sq=6;
  const ent=insightRelease({kind:'addr',i:8},r,{});
  BY[8].sq=was8;
  if(ent.ok)bad.push(p.nm+' Entitlement offers a release, and no feeling is mapped to it');
  const fv=CHILD.find(c=>W.some(n=>n.cf===c.nm&&n.sq>=1));
  if(fv){const x=insightRelease({kind:'fet',nm:fv.nm},r,{}); if(!x.ok||!x.ids.every(i=>BY[i].cf===fv.nm))bad.push(p.nm+' a child emotion releases addresses that are not its own');}
  ['dom','arch','mask','law','seat','core'].forEach(k=>{if(insightRelease({kind:k,nm:'x'},r,{}).ok)bad.push(p.nm+' a '+k+' offers a release');});});
 ok(bad.length===0,'a release is offered exactly where charge sits and the pattern is not overshot, '+bad.length+' break it'+(bad[0]?', first: '+bad[0]:''));
 ok(overSeen>0,'the roster has an overshot pattern to test against, '+overSeen);
 ok(canSeen>50,'and plenty that can release, '+canSeen);
 /* the host can say which addresses are already opened, and the offer moves on without ever saying all */
 const r=load(PEOPLE.find(p=>p.nm==='Gordon'));
 const o=r.sabs[0], x0=insightRelease({kind:'sab',nm:o.nm},r,{});
 const rel={}; rel[x0.first.i]=true;
 const x1=insightRelease({kind:'sab',nm:o.nm},r,{released:rel});
 ok(x0.ok&&x1.ok&&(x1.first.i!==x0.first.i||x1.ids.length===1),'an address already opened is not the one the offer starts at while another remains');
 const ranked=insightRelease({kind:'sab',nm:o.nm},r,{rank:list=>list.slice().reverse()});
 ok(ranked.ids[0]===x0.ids[x0.ids.length-1],'the host\'s own order for the release door is the order the offer starts in');
 const a=insightRead({kind:'sab',nm:o.nm},r,null,{});
 ok(!/\ball\b/i.test(a.pages[0].paras[2].segs.map(s=>s.text).join(' ')),'a release is never said to reach all of anything');
}

g('IN5 · the pages, and what they page through');
{
 const r=load(PEOPLE.find(p=>p.nm==='Lance 15'));
 const sup=r.sups[0], hy=insightRead({kind:'hy',nm:r.hys[0].nm},r,null,{});
 ok(hy.pages[0].rung==='self'&&hy.pages.slice(1).every(pg=>pg.rung==='part'||pg.rung==='parent'),'page one is the selection, the rest are its parts and its parent');
 ok(hy.pages.filter(pg=>pg.rung==='parent').length<=1&&hy.pages.length<=5,'at most one parent page and five pages in all');
 const sp=insightRead({kind:'sup',nm:sup.nm},r,null,{});
 ok(!sp.pages.some(pg=>pg.rung==='parent'),'a super complex has no page above it, because nothing sits above it');
 ok(/Nothing sits above it/.test(sp.pages[0].paras[0].segs.map(s=>s.text).join(' ')),'and says so once');
 const sab=insightRead({kind:'sab',nm:r.sabs[0].nm},r,null,{});
 ok(sab.pages.slice(1).some(pg=>pg.sel.kind==='addr')&&sab.pages.some(pg=>pg.rung==='parent'),'a saboteur pages through its addresses and the complex it feeds');
 const fet=insightRead({kind:'fet',nm:CHILD.find(c=>(S.charge[c.nm]||0)>0).nm},r,null,{});
 ok(fet.pages.slice(1).every(pg=>pg.sel.kind==='sab'),'a child emotion pages through the saboteurs that run on it');
 ok(fet.pages.every((pg,i)=>pg.aria==='Page '+(i+1)+' of '+fet.pages.length+', '+pg.title),'every dot has the name the rail gives it');
 ok(hy.pages.slice(1).every(pg=>/^Page \d+: .+, (a part of this|what this feeds)$/.test(pg.tip)),'and a short sentence for hover and tap');
 const rd=insightRead({kind:'hy',nm:r.hys[0].nm},r,null,{});
 ok(JSON.stringify(rd)===JSON.stringify(hy),'a second read gives the same pages');
 ok(hy.id.title===r.hys[0].nm&&hy.id.kindWord==='Hyper complex'&&/^\d+%$/.test(hy.id.fig),'the identity line is the name, the kind in words and a percent');
 const longest=Math.max.apply(null,PEOPLE.map(p=>{const x=load(p); if(x.unread||!x.sabs.length)return 0;
  return Math.max.apply(null,x.sabs.map(s=>paraWords(insightRead({kind:'sab',nm:s.nm},x,null,{}).pages[0].paras[0])));}));
 ok(longest>=35,'a full record reaches the longer reading he asked for, a first paragraph of '+longest+' words');
}

g('IN6 · the graph, when there is one');
{
 const r=load(PEOPLE.find(p=>p.nm==='Gordon'));
 const sab=r.sabs.find(s=>E.leaves(s).length>=2)||r.sabs[0], lv=E.leaves(sab);
 ok(lv.length>=2,'the saboteur used for the graph holds two addresses, so one entry can land on both, '+lv.length);
 const none=insightRead({kind:'sab',nm:sab.nm},r,null,{});
 ok(!/entr(y|ies) in your journal/.test(textOf(none)),'with no graph the reading says nothing about entries, it does not guess');
 /* a graph built through the engine's own door, as a record's would be */
 const mk=(stories,at)=>{const gr=E.traceNew();
  stories.forEach(t=>E.traceAddNode(gr,'story',t,'known'));
  at.forEach(i=>E.traceAddNode(gr,'pattern',String(i),'known'));
  return gr;};
 const edge=(gr,t,i)=>E.traceAddEdge(gr,'story:'+t,'supports','pattern:'+i,'inferred');
 const g1=mk(['2026-10-07'],[lv[0].i,lv[1]?lv[1].i:lv[0].i]);
 ok(edge(g1,'2026-10-07',lv[0].i).ok,'the harness can land an entry on an address through the graph\'s own door');
 if(lv[1])ok(edge(g1,'2026-10-07',lv[1].i).ok,'and the same entry on a second address');
 const one=textOf(insightRead({kind:'sab',nm:sab.nm},r,g1,{}));
 ok(/One entry in your journal lands at addresses under it\./.test(one),'one entry that lands on two of its addresses is counted once, as one entry, never as two');
 const g2=mk(['2026-10-07','2026-10-16'],[lv[0].i]);
 edge(g2,'2026-10-07',lv[0].i); edge(g2,'2026-10-16',lv[0].i);
 ok(/2 entries in your journal land at addresses under it\./.test(textOf(insightRead({kind:'sab',nm:sab.nm},r,g2,{}))),'two entries are two');
 const g3=mk(['2026-10-07'],[lv[0].i]);
 const empty=textOf(insightRead({kind:'sab',nm:sab.nm},r,g3,{}));
 ok(/No entry in your journal is linked to it yet\. The reading did not pick one up\./.test(empty),'an entry that lands nowhere under it says the reading did not pick one up');
 ok(!/did not write|you did not|you never/i.test(empty+one),'and never says the person did not write about it');
 const g4=E.traceNew();
 ok(!/entr(y|ies) in your journal|No entry/.test(textOf(insightRead({kind:'sab',nm:sab.nm},r,g4,{}))),'a graph with no entries at all says nothing about entries');
 const ad=textOf(insightRead({kind:'addr',i:lv[0].i},r,g1,{}));
 ok(/One entry in your journal lands here\./.test(ad),'an address says how many entries land on it');
}

/* ---------------------------------------------------------------------------
   A SWEEP OF EVERYTHING A PERSON CAN BE READ ON. Two phrases were broken in the
   first build and no check noticed, because every check above reads one record:
   'The map seats Anticipation at the below the heart' (a place that already
   carries its own preposition) and 'Earth Star is an address, at the null' (the
   four field anchors have no nerve). Both were found by reading the output of
   every roster record at once, so that is now a check: every page of every
   selection on every record, and the four anchors by number.
   --------------------------------------------------------------------------- */
g('IN7 · no broken phrase in any reading, across the whole roster');
{
 const bad=[[/\bat the (below|above|behind|under|beside|null|undefined|nan)\b/i,'a place that carries its own preposition'],
  [/\b(undefined|NaN|null)\b|\[object/,'a value that never printed'],[/\b(\w+) \1\b/i,'a repeated word'],
  [/ ,| \.|\.\./,'stray punctuation']];
 let n=0; const hit=[];
 PEOPLE.forEach(p=>{let r; try{r=load(p);}catch(e){return;}
  selections(r).concat([109,110,111,112].map(i=>({kind:'addr',i}))).forEach(sel=>{
   const o=insightRead(sel,r,null,{}); if(!o.ok)return;
   o.pages.forEach(pg=>{n++;
    const t=pg.paras.map(x=>x.h+' '+x.segs.map(sg=>sg.text).join(' ')).join('\n');
    bad.forEach(b=>{const m=b[0].exec(t);
     if(m&&hit.length<4)hit.push(p.nm+' '+(sel.nm||sel.i||sel.kind)+': '+b[1]+' '+JSON.stringify(t.slice(Math.max(0,m.index-30),m.index+40)));});});});});
 ok(n>1000,'the sweep read over a thousand pages, read '+n);
 ok(hit.length===0,'no page has a broken phrase: '+hit.join(' | '));
}

console.log('\n===== '+P+' passed, '+F+' failed =====');
process.exit(F?1:0);
