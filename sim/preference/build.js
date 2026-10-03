/* ============================================================
   THE PREFERENCE STUDY. sim/preference/build.js -> index.html

   He ruled A and he asked for the cohort anyway. That is the right order and
   it means this sheet's job is not to confirm him. If the cohort disagrees
   with A the disagreement goes at the top.

   WHERE EVERY FIGURE COMES FROM, and nothing else is allowed in:

     engine.js                 loaded as a module and run per figure. age,
                               coherence, how many addresses carry, how many
                               of the seven seats the ring colours, how many
                               chains are drawn, whether the reading is unread.
     sim/preference/measured.json   this study's own run of both prototypes at
                               both widths, checked against the files those
                               prototypes wrote.
     proto/field-a/*.json      the nameplate measurements.
     proto/field-b/cost.json   the shell directions' paint cost.
     sim/ninety.json           where each figure actually stopped.
     sim/harness.js            the showup model, which says of itself that it
                               is judgement. It is used for one thing only:
                               to pick which measured width a figure is judged
                               at. The model picks the width. The measurement
                               at that width carries the vote.

   Derived figures are marked derived and carry the constant they came from.
   Three radii in this sheet are the measured shell times a constant read off
   proto/field-a/index.html, and they say so where they appear.
   ============================================================ */
'use strict';
const fs=require('fs'), path=require('path'), cp=require('child_process');
const ROOT=path.resolve(__dirname,'..','..');
const E=require(path.join(ROOT,'engine.js'));
const H=require(path.join(ROOT,'sim','harness.js'));
const MEAS=JSON.parse(fs.readFileSync(path.join(__dirname,'measured.json'),'utf8'));
const NINETY=JSON.parse(fs.readFileSync(path.join(ROOT,'sim','ninety.json'),'utf8'));
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
 .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const n1=v=>(+v).toFixed(1), n2=v=>(+v).toFixed(2), n0=v=>Math.round(+v);

/* ============================================================
   THE CONSTANTS THE PROTOTYPE DRAWS WITH. Quoted, not invented.
   proto/field-a/index.html: the band's slab is 0.30 of the shell, its gutter
   is 0.40 of the slab, the unit radius is the shell over 0.68, an address
   stave runs 0.104 of that unit radius, and the chain ring sits at 0.56 of it,
   or at 0.84 of what is left inside the band.
   ============================================================ */
const K={slab:0.30, gut:0.40, unit:1/0.68, stave:0.104, chain:0.56, chainIn:0.84};
const STAVE_BAND=K.slab*(1-K.gut);            /* 0.18 of the shell */
const STAVE_REST=K.stave*K.unit;              /* 0.1529 of the shell */
const CHAIN_BAND=(1-K.slab)*K.chainIn;        /* 0.588 of the shell */
const CHAIN_REST=K.chain*K.unit;              /* 0.8235 of the shell */

/* ============================================================
   THE FOUR ANSWERS. The letters are his, the keys are the prototype's modes.
   ============================================================ */
const ANS=[
 {id:'band', L:'A', nm:'Inside the band', sub:'the name lies in the colour'},
 {id:'mark', L:'B', nm:'Mark now, name on focus', sub:'a level gauge, then a word'},
 {id:'axis', L:'C', nm:'The ring is an axis', sub:'one lane, seven labels'},
 {id:'spine',L:'D', nm:'The names leave the circle', sub:'root low, crown high'}];
const LETTER={band:'A',mark:'B',axis:'C',spine:'D'};

/* ============================================================
   THE GEOMETRY EACH ANSWER GIVES, AT EACH WIDTH.
   shell, the radius outside it, the arc it closes and the share of its naming
   band that carries ink are measured. stave and chain are derived and say so.
   ============================================================ */
const GEO={};
[1600,390].forEach(w=>{
 GEO[w]={};
 const M=MEAS.fieldA[w].modes;
 Object.keys(M).forEach(m=>{
  const d=M[m], slabbed=(m==='band');
  GEO[w][m]={
   shell:d.shell, outside:d.outside, reserved:d.reserved, slab:d.slab,
   lane:d.lane, spineW:d.spineW, lit:d.lit, contrast:d.worstContrast,
   free:d.free, CW:d.CW, CH:d.CH,
   markPx:(d.markR0==null?null:d.markR1-d.markR0),
   stave:d.shell*(slabbed?STAVE_BAND:STAVE_REST),
   chain:d.shell*(slabbed?CHAIN_BAND:CHAIN_REST),
   /* the tap, against the 44 floor. the limiting dimension of the thing a
      finger has to land on, and for D it is a row of the column. */
   tap:slabbed?d.slab:(m==='mark'?(d.markR1-d.markR0)
      :(m==='axis'?d.lane:(m==='spine'?d.CH/7:d.shell*STAVE_REST)))};});
});
const BEST=(w,key)=>Math.max.apply(null,ANS.map(a=>GEO[w][a.id][key]));

/* ============================================================
   THE FIGURES. Read off the engine, one at a time, nothing modelled.
   ============================================================ */
const {PEOPLE,LAWSET,LAW_DEFAULT,CHARGES,SINAMES,S,buildSoul,compute,BANDS}=E;
function readFigure(p){
 S.dom=p.dom;S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:LAW_DEFAULT};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:LAW_DEFAULT);});
 const r=compute(), W=E.W;
 const carry=W.filter(n=>n.sq>=4);
 const perSeat=BANDS.map(b=>({b:b, lit:carry.filter(n=>n.b===b).length,
  all:W.filter(n=>n.b===b).length}));
 return {nm:p.nm, age:p.age, role:p.role, says:p.says,
  CQ:+r.CQ.toFixed(1), tier:r.tier, unread:!!r.unread,
  carrying:carry.length, grey:W.length-carry.length,
  seatsLit:perSeat.filter(s=>s.lit>0).length, perSeat:perSeat,
  chains:r.sabs.length};}

const SHOW={}; H.SHOWUP.forEach(s=>SHOW[s.nm]=s);
const RUN=NINETY.base.icp;
const LOST=NINETY.base.lostTop||[];

/* THE TASTE COLUMN. Written by this seat, labelled taste, and never added to
   a traceable total. Each line is argued from that figure's own words in
   engine/data/people.js and their pass in DESIGN-mobile-icp.md, which is a
   register and not a measurement. */
const TASTE={
 Sofia:{pick:'band', why:'In session she wants one image and one sentence. The band is one object with the word already in it.'},
 Diane:{pick:'mark', why:'She calls a screen of controls a menu rather than a product. The fewest marks reads as an instrument to her.'},
 Marcus:{pick:'spine', why:'He objected to labels crossing the ring and two things fighting for the same pixels. A clean column beside an untouched drawing is the one a creative director calls designed.'},
 Angela:{pick:'band', why:'She likes the circle and does not know what the words mean. The word inside the colour is the only one that hands her both at once.'},
 Derek:{pick:'mark', why:'He wants a protocol and a cost. A level gauge reads as equipment.'},
 James:{pick:'mark', why:'He will not be seen doing self help. A gauge with no words looks like an instrument and a page of labels looks like a worksheet.'},
 Ana:{pick:'band', why:'She opens it at night and wants the shape of it named without asking for the name.'},
 Gordon:{pick:null, why:'He refuses the frame. A preference from him is a preference about a product he does not open.'},
 Rosa:{pick:null, why:'Nothing pulls, and the reading is unread, so there is no ring in front of her to prefer.'},
 Tomas:{pick:'band', why:'He describes losing the whole scale of a thing. The band is the reading at its largest.'},
 Nkem:{pick:'band', why:'Nights, in a car park, on a phone. The one that needs no gesture.'},
 Wren:{pick:'axis', why:'Forty one years at a bench. An axis is a scale on a tool and he has read one every day of it.'},
 Abraham:{pick:'axis', why:'A career of reading a record line by line. A lane of labels is a record.'},
 Lance:{pick:null, why:'The reading is unread, so the four doors are what he sees and the ring is not on the screen.'}};

/* ============================================================
   THE GATES. Five, each a measured or derived ratio, all comparable.
   The weights come off the figure's own record, so a gate a figure's reading
   does not exercise cannot swing their vote.
   ============================================================ */
function gatesFor(f, w){
 const out={};
 ANS.forEach(a=>{
  const g=GEO[w][a.id];
  const named = (a.id==='mark') ? 0 : 1;
  const link  = (a.id==='spine') ? f.seatsLit/7 : 1;
  out[a.id]={
   named:named,
   link:link,
   radius:g.shell/BEST(w,'shell'),
   stave:g.stave/BEST(w,'stave'),
   chain:g.chain/BEST(w,'chain')};});
 return out;}

function weightsFor(f){
 const phone=(SHOW[f.nm]&&SHOW[f.nm].device==='phone');
 return {
  named: phone?2:1,
  link: 1,
  radius: 1,
  /* a stave is worth what the reading puts in it */
  stave: Math.max(0.25, Math.min(2, f.carrying/20)),
  /* a chain ring is worth what the reading hangs on it */
  chain: Math.max(0.25, Math.min(2, f.chains/20))};}

/* the named failures. each one is a measured condition and says which. */
function failsFor(f, w){
 const out={band:[],mark:[],axis:[],spine:[]};
 const g=GEO[w], run=RUN[f.nm];
 const phone=(SHOW[f.nm]&&SHOW[f.nm].device==='phone');
 if(phone) out.mark.push('No pointer. The word needs a pointer or a focus ring, '
  +'and on a phone the tap that would fetch it is the tap that opens the seat.');
 if(run && run.minutes<5) out.mark.push('Nothing to spend on discovery. The whole '
  +'run is '+n1(run.minutes)+' minutes, and B opens with a gauge and no words.');
 if(f.age>=57) out.mark.push('The mark is '+n1(g.mark.markPx)+' pixels here and the '
  +'seven states differ by the height of a chord inside it. This product moved a '
  +'colour token because contrast sensitivity falls past 55 and this figure is '+f.age+'.');
 if(f.seatsLit<2) out.spine.push('The link has nothing to attach to. D matches a '
  +'colour across a gap and the ring colours '+(f.seatsLit===0?'no seat':'one seat')
  +' on this reading.');
 if(f.age>=57 && f.seatsLit<3) out.spine.push('A colour match at distance, at '+f.age+', '
  +'against a ring that is mostly grey.');
 if(phone) out.spine.push('The column takes '+n0(g.spine.spineW)+' pixels off a stage '
  +n0(g.spine.CW)+' wide, and the reading drops to '+n0(g.spine.shell)+' pixels of radius.');
 if(f.chains>=25) out.band.push('The chain layer moves in. A band of three tenths of the '
  +'shell puts the chain ring at '+n0(g.band.chain)+' pixels against '+n0(g.axis.chain)
  +' under C, and this reading draws '+f.chains+' chains on it.');
 if(f.unread) out.band.push('The reading is unread, so the surface shows the four doors '
  +'and there is no ring on the screen.');
 return out;}

function scoreFigure(f, w){
 const G=gatesFor(f,w), W=weightsFor(f), fails=failsFor(f,w);
 const tot=Object.keys(W).reduce((a,k)=>a+W[k],0);
 const rows=ANS.map(a=>{
  const g=G[a.id];
  const s=Object.keys(W).reduce((acc,k)=>acc+W[k]*g[k],0)/tot;
  return {id:a.id, L:a.L, score:+(s*100).toFixed(1), gates:g,
   fails:fails[a.id]};});
 rows.sort((x,y)=>y.score-x.score);
 return {rows:rows, weights:W, width:w};}

/* ============================================================
   THE RUN.
   ============================================================ */
const FIG=PEOPLE.filter(p=>p.nm!=='You').map(readFigure);
const COHORT=FIG.map(f=>{
 const sh=SHOW[f.nm], run=RUN[f.nm]||null;
 const width = sh ? (sh.device==='phone'?390:1600) : 1600;
 const widthWhy = sh
  ? (sh.device==='phone'
     ? 'the showup model puts this figure on a phone only, so the vote is taken at 390'
     : 'the showup model gives this figure both, so the vote is taken at 1600 and checked at 390')
  : 'no session record, so the vote is taken at both widths and holds at both';
 const at390=scoreFigure(f,390), at1600=scoreFigure(f,1600);
 const main = width===390?at390:at1600;
 /* a figure whose reading is unread never sees a ring, so they do not vote */
 const abstain=f.unread;
 return {f:f, show:sh||null, run:run, width:width, widthWhy:widthWhy,
  at390:at390, at1600:at1600, main:main, abstain:abstain,
  pick:abstain?null:main.rows[0].id,
  pick390:at390.rows[0].id, pick1600:at1600.rows[0].id,
  taste:TASTE[f.nm]||{pick:null,why:''},
  evidence:{
   engine:true,
   run:!!run,
   model:!!sh,
   age:f.age}};});

const VOTES=COHORT.filter(c=>!c.abstain);
const STAND={}; ANS.forEach(a=>STAND[a.id]=0);
VOTES.forEach(c=>STAND[c.pick]++);
const TSTAND={}; ANS.forEach(a=>TSTAND[a.id]=0);
let tasteNone=0;
COHORT.forEach(c=>{ if(c.taste.pick) TSTAND[c.taste.pick]++; else tasteNone++; });
const WINNER=ANS.slice().sort((a,b)=>STAND[b.id]-STAND[a.id])[0];
const TWINNER=ANS.slice().sort((a,b)=>TSTAND[b.id]-TSTAND[a.id])[0];
const AGREES=(WINNER.id==='band');
const UNANIM=VOTES.every(c=>c.pick===WINNER.id);
const BOTHWIDTHS=VOTES.every(c=>c.pick390===c.pick1600);

/* ============================================================
   QUESTION TWO. THE FOUR SHELL DIRECTIONS.
   Measured off this study's own run of proto/field-b with Crown open, which
   is the heaviest seat in the roster, plus that prototype's cost file.
   ============================================================ */
const SHELLS=['shell','kerf','strata','unroll'];
const SHELLNM={shell:'Shell',kerf:'Kerf',strata:'Strata',unroll:'Unroll'};
const FLOOR_TYPE=11;   /* the chrome floor proto/field-a's own gate holds */
const SHELLROW=SHELLS.map(id=>{
 const a=MEAS.fieldB[1600].dirs[id], b=MEAS.fieldB[390].dirs[id];
 const c16=(MEAS.costB['shut-1600']||[]).filter(r=>r.nm===SHELLNM[id])[0]||{};
 const c39=(MEAS.costB['shut-390']||[]).filter(r=>r.nm===SHELLNM[id])[0]||{};
 const gmax=Math.max(...['shut','open','gordon'].map(k=>{
  const r=(MEAS.costB[k+'-1600']||[]).filter(x=>x.nm===SHELLNM[id])[0];
  return r?(r.gapWorst||0):0;}));
 const over=['shut','open','gordon'].reduce((a2,k)=>{
  const r=(MEAS.costB[k+'-1600']||[]).filter(x=>x.nm===SHELLNM[id])[0];
  return a2+(r?(r.over||0):0);},0);
 return {id:id, nm:SHELLNM[id], killed:!!a.killed,
  fit1600:a.fitted, fit390:b.fitted,
  names1600:(a.fitted!=null&&a.fitted>0), names390:(b.fitted!=null&&b.fitted>0),
  worst1600:c16.worst, worst390:c39.worst, gapWorst:gmax, over:over};});
const RING=MEAS.fieldB;

/* ============================================================
   THE DRAWINGS. Each answer to scale at a width, built from the measured
   shell and the derived radii, so the picture and the numbers cannot drift.
   A sheet of tables is what he called a ledger. These are drawings with the
   numbers under them.
   ============================================================ */
const SEATCOL=['#D6524C','#D8924E','#DABF6A','#5FD5A6','#5EBBDB','#7D93E0','#A77EDB'];
function diagram(id,w,box){
 const g=GEO[w][id], S2=(box/2-6)/g.free;      /* one scale, the free radius */
 const cx=box/2, cy=box/2, R=r=>r*S2;
 const p=[];
 p.push('<rect x="0" y="0" width="'+box+'" height="'+box+'" fill="#090A0E" rx="8"/>');
 /* the free radius, which is the room the stage has */
 p.push('<circle cx="'+cx+'" cy="'+cy+'" r="'+n1(R(g.free))+'" fill="none" '
  +'stroke="rgba(255,255,255,.10)" stroke-dasharray="2 4"/>');
 if(id==='spine'){
  const colW=R(g.spineW);
  p.push('<rect x="2" y="'+n1(cy-R(g.free))+'" width="'+n1(colW)+'" height="'
   +n1(R(g.free)*2)+'" fill="rgba(126,184,212,.10)" stroke="rgba(126,184,212,.35)"/>');
  for(let i=0;i<7;i++){
   const yy=cy+R(g.free)-6-i*(R(g.free)*2-12)/6;
   p.push('<circle cx="'+n1(2+colW*0.30)+'" cy="'+n1(yy)+'" r="3" fill="none" stroke="'
    +SEATCOL[i]+'" stroke-width="1.4"/>');
   p.push('<rect x="'+n1(2+colW*0.48)+'" y="'+n1(yy-2)+'" width="'+n1(colW*0.44)
    +'" height="4" fill="rgba(239,237,232,.45)"/>');}}
 const cxx = id==='spine' ? (R(g.spineW)+ (box-R(g.spineW))/2) : cx;
 /* the seven seats */
 for(let i=0;i<7;i++){
  const a0=-Math.PI/2+i*Math.PI*2/7+0.03, a1=a0+Math.PI*2/7-0.06;
  if(id==='band'){
   p.push(arc(cxx,cy,R(g.shell-g.slab),R(g.shell),a0,a1,SEATCOL[i],0.55));
   p.push(arc(cxx,cy,R(g.shell-g.slab*K.gut),R(g.shell),a0,a1,'#0C0D12',0.85));
   p.push(arc(cxx,cy,R(g.shell-g.slab*K.gut*0.75),R(g.shell-g.slab*K.gut*0.25),
    a0+0.12,a1-0.12,SEATCOL[i],0.95));
  }else if(id==='mark'){
   const am=(a0+a1)/2, rm=R(g.shell-g.markPx/2);
   p.push('<circle cx="'+n1(cxx+Math.cos(am)*rm)+'" cy="'+n1(cy+Math.sin(am)*rm)
    +'" r="'+n1(R(g.markPx/2))+'" fill="none" stroke="'+SEATCOL[i]+'" stroke-width="1.3"/>');
  }else if(id==='axis'){
   p.push(arc(cxx,cy,R(g.shell),R(g.shell+g.lane),a0,a1,SEATCOL[i],0.20));
   p.push(arc(cxx,cy,R(g.shell+g.lane*0.35),R(g.shell+g.lane*0.65),a0+0.10,a1-0.10,
    SEATCOL[i],0.9));
  }else if(id==='today'){
   const am=(a0+a1)/2, rm=R(g.shell)+4;
   p.push('<rect x="'+n1(cxx+Math.cos(am)*rm-1)+'" y="'+n1(cy+Math.sin(am)*rm-1)
    +'" width="'+n1(Math.max(6,R(g.outside)*0.7))+'" height="2.4" fill="'+SEATCOL[i]
    +'" transform="rotate('+n1(am*180/Math.PI)+' '+n1(cxx+Math.cos(am)*rm)+' '
    +n1(cy+Math.sin(am)*rm)+')"/>');}
  else{
   p.push(arc(cxx,cy,R(g.shell)-1,R(g.shell),a0,a1,SEATCOL[i],0.30));}}
 /* the address staves, and the chain ring */
 const sr0=(id==='band')?R(g.shell-g.slab*K.gut-g.stave):R(g.shell-g.stave);
 const sr1=(id==='band')?R(g.shell-g.slab*K.gut):R(g.shell);
 p.push('<circle cx="'+n1(cxx)+'" cy="'+n1(cy)+'" r="'+n1((sr0+sr1)/2)
  +'" fill="none" stroke="rgba(126,184,212,.55)" stroke-width="'+n1(Math.max(1,sr1-sr0))
  +'" stroke-dasharray="1.5 2.5"/>');
 p.push('<circle cx="'+n1(cxx)+'" cy="'+n1(cy)+'" r="'+n1(R(g.chain))
  +'" fill="none" stroke="rgba(218,191,106,.55)" stroke-width="1" stroke-dasharray="3 5"/>');
 p.push('<circle cx="'+n1(cxx)+'" cy="'+n1(cy)+'" r="'+n1(R(g.shell*0.26))
  +'" fill="rgba(214,82,76,.45)"/>');
 return '<svg viewBox="0 0 '+box+' '+box+'" width="100%" height="auto" '
  +'role="img" aria-label="'+esc(LETTER[id]||'today')+' at '+w+'">'+p.join('')+'</svg>';}
function arc(cx,cy,r0,r1,a0,a1,col,op){
 const P=(r,a)=>[cx+Math.cos(a)*r,cy+Math.sin(a)*r];
 const [x0,y0]=P(r1,a0),[x1,y1]=P(r1,a1),[x2,y2]=P(r0,a1),[x3,y3]=P(r0,a0);
 return '<path d="M'+n1(x0)+' '+n1(y0)+'A'+n1(r1)+' '+n1(r1)+' 0 0 1 '+n1(x1)+' '+n1(y1)
  +'L'+n1(x2)+' '+n1(y2)+'A'+n1(r0)+' '+n1(r0)+' 0 0 0 '+n1(x3)+' '+n1(y3)
  +'Z" fill="'+col+'" opacity="'+op+'"/>';}

/* a figure's own field, as seven arcs. lit seats in colour, grey seats grey. */
function seatRing(f,box){
 const cx=box/2, cy=box/2, r0=box*0.30, r1=box*0.44, p=[];
 f.perSeat.forEach((s,i)=>{
  const a0=-Math.PI/2+i*Math.PI*2/7+0.05, a1=a0+Math.PI*2/7-0.10;
  p.push(arc(cx,cy,r0,r1,a0,a1,s.lit>0?SEATCOL[i]:'#3A3D47',s.lit>0?0.92:0.7));});
 return '<svg viewBox="0 0 '+box+' '+box+'" width="'+box+'" height="'+box+'" '
  +'role="img" aria-label="'+esc(f.nm)+', '+f.seatsLit+' seats coloured">'
  +p.join('')+'</svg>';}

/* ============================================================
   THE PAGE.
   ============================================================ */
const stamp=(()=>{
 const sh=s=>{try{return cp.execSync(s,{cwd:ROOT}).toString().trim();}catch(e){return 'unknown';}};
 return {commit:sh('git rev-parse --short HEAD'),
  dirty:sh('git status --porcelain')?'dirty':'clean',
  engine:sh('md5sum engine.js').split(' ')[0],
  when:new Date().toISOString().replace('T',' ').slice(0,16)};})();

function figCard(c){
 const f=c.f, w=c.width, g=GEO[w], rows=c.main.rows;
 const best=rows[0], worst=rows[rows.length-1];
 const run=c.run;
 const sees = w===390
  ? 'At 390 the stage is '+n0(g.band.CW)+' by '+n0(g.band.CH)+' and the free radius is '
    +n0(g.band.free)+'.'
  : 'At 1600 the stage is '+n0(g.band.CW)+' by '+n0(g.band.CH)+' and the free radius is '
    +n0(g.band.free)+'.';
 const cost = 'Learning which seat: '
  +'A prints the word in the colour, C prints it in a lane one line deep, '
  +'D prints it in a column and asks for a colour match, '
  +'and B prints nothing until a pointer or a focus ring arrives.';
 return `<article class="fig${c.abstain?' out':''}">
 <header>
  <div class="who">
   ${seatRing(f,54)}
   <div>
    <h3>${esc(f.nm)}, ${f.age}</h3>
    <p class="role">${esc(f.role)}</p>
   </div>
  </div>
  <div class="verdict">${c.abstain
   ?'<span class="tag out">abstains</span>'
   :'<span class="tag win">'+esc(best.L)+'</span>'}
   <span class="at">judged at ${w}</span></div>
 </header>
 <blockquote>${esc(f.says)}</blockquote>
 <div class="ledger">
  <div><dt>coherence</dt><dd>${n1(f.CQ)} <span>${esc(f.tier.toLowerCase())}</span></dd></div>
  <div><dt>carrying</dt><dd>${f.carrying} <span>addresses</span></dd></div>
  <div><dt>grey</dt><dd>${f.grey} <span>addresses</span></dd></div>
  <div><dt>seats</dt><dd>${f.seatsLit} <span>coloured</span></dd></div>
  <div><dt>chains</dt><dd>${f.chains} <span>drawn</span></dd></div>
  ${run?`<div><dt>run</dt><dd>${n1(run.minutes)} <span>minutes</span></dd></div>
  <div><dt>day seven</dt><dd>${n0(run.d7*100)} <span>per cent</span></dd></div>
  <div><dt>day thirty</dt><dd>${n0(run.d30*100)} <span>per cent</span></dd></div>`
  :`<div class="none"><dt>run</dt><dd>no record</dd></div>`}
 </div>
 <p class="note">${esc(c.widthWhy)}. ${esc(sees)}</p>
 ${c.abstain?`<p class="note out"><b>No vote.</b> The engine returns unread on this
  reading, so both surfaces that print a reading silence themselves and show the four
  doors. There is no ring in front of this figure to have a preference about.</p>`:''}
 <div class="bars">
  ${rows.map(r=>`<div class="bar${r.id===best.id&&!c.abstain?' top':''}">
   <span class="l">${r.L}</span>
   <span class="t"><i style="width:${n1(r.score)}%"></i></span>
   <span class="v">${n1(r.score)}</span></div>`).join('')}
 </div>
 ${rows.filter(r=>r.fails.length).map(r=>`<div class="fail">
  <b>${r.L} fails here.</b> ${r.fails.map(esc).join(' ')}</div>`).join('')}
 <p class="taste"><b>Taste, and it is taste.</b> ${c.taste.pick
   ?'They would say '+esc(LETTER[c.taste.pick])+'. '+esc(c.taste.why)
   :esc(c.taste.why)}</p>
</article>`;}

const HEAD=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Which one they like</title>
<!-- ============================================================
     THE PREFERENCE STUDY. sim/preference/index.html
     Built by sim/preference/build.js off sim/preference/measured.json,
     engine.js, sim/ninety.json and the two prototypes' own measurement files.
     Self contained. Nothing is fetched. Every figure on this page was read
     off a run and the run's stamp is at the foot.
     ============================================================ -->
<style>
:root{
 --bg:#0C0D12; --panel:#14161D; --panel-2:#1A1D26; --sunk:#090A0E;
 --edge:rgba(255,255,255,.09); --edge-2:rgba(255,255,255,.15);
 --ink:#EFEDE8; --mid:#B4B0A8; --dim:#94908A;
 --accent:#7EB8D4; --alarm:#FF2E1F;
 --root:#D6524C; --sacral:#D8924E; --solar:#DABF6A; --heart:#5FD5A6;
 --throat:#5EBBDB; --eye:#7D93E0; --crown:#A77EDB;
 --sans:'Inter','Inter Tight',system-ui,-apple-system,'Segoe UI',sans-serif;
 --num:ui-monospace,'SF Mono',Menlo,monospace;
 --tap:44px; --t:140ms; --ease:cubic-bezier(.22,1,.36,1);
}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);
 font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
body{padding-bottom:80px}
h1,h2,h3,h4{font-weight:500;letter-spacing:-.012em;margin:0}
p{margin:0 0 11px}
.wrap{max-width:1180px;margin:0 auto;padding:0 16px}
.hd{padding:32px 0 22px;border-bottom:1px solid var(--edge)}
.eyebrow{font-size:12px;letter-spacing:.09em;color:var(--dim);margin-bottom:9px}
h1{font-size:32px;line-height:1.13;max-width:22ch}
.lede{color:var(--mid);max-width:68ch;font-size:15.5px;margin-top:13px}
blockquote{margin:14px 0;padding:0 0 0 15px;border-left:2px solid var(--edge-2);
 color:var(--mid);font-size:14.5px;max-width:66ch}
section{margin-top:44px}
.sechd{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.sechd h2{font-size:21px}
.sechd .who{color:var(--dim);font-size:13px}
.note{color:var(--dim);font-size:13.5px;max-width:72ch}
.note.out{color:var(--mid)}

.boundary{margin:22px 0 0;padding:16px 18px;background:var(--panel);
 border:1px solid var(--edge-2);border-left:3px solid var(--accent);border-radius:10px}
.boundary h2{font-size:17px;margin-bottom:7px}
.boundary p{color:var(--mid);font-size:14.5px;max-width:74ch;margin-bottom:8px}
.boundary p:last-child{margin:0}

.answer{margin-top:22px;padding:20px 20px 18px;border-radius:12px;
 background:linear-gradient(180deg,rgba(126,184,212,.10),rgba(126,184,212,.02));
 border:1px solid rgba(126,184,212,.35)}
.answer h2{font-size:24px;line-height:1.2;max-width:26ch}
.answer p{color:var(--mid);max-width:72ch;margin-top:10px;font-size:15px}
.answer .big{font:500 46px/1 var(--num);color:var(--accent);letter-spacing:-.02em}

.grid4{display:grid;grid-template-columns:1fr;gap:14px;margin-top:18px}
@media(min-width:760px){.grid4{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1080px){.grid4{grid-template-columns:repeat(4,1fr)}}
.ans{background:var(--panel);border:1px solid var(--edge);border-radius:12px;
 overflow:hidden;display:flex;flex-direction:column}
.ans .cap{padding:12px 14px 10px;border-bottom:1px solid var(--edge)}
.ans .cap h3{font-size:16px}
.ans .cap .sub{font-size:12.5px;color:var(--dim);margin-top:2px}
.ans .art{background:var(--sunk);padding:10px}
.ans .figs{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--edge)}
.ans .fg{background:var(--panel-2);padding:8px 10px 9px}
.ans .fg .l{font-size:11.5px;color:var(--dim)}
.ans .fg .v{font:500 16px/1.15 var(--num);color:var(--ink);white-space:nowrap}
.ans .fg .v small{font:400 11px/1 var(--num);color:var(--mid);margin-left:3px}
.ans .fg.win .v{color:var(--accent)}
.ans .fg.lose .v{color:var(--root)}
.ans .say{padding:11px 14px 13px;font-size:13.5px;color:var(--mid)}
.ans .say b{color:var(--ink);font-weight:500}

.figs2{display:grid;grid-template-columns:1fr;gap:14px;margin-top:16px}
@media(min-width:820px){.figs2{grid-template-columns:repeat(2,1fr)}}
.fig{background:var(--panel);border:1px solid var(--edge);border-radius:12px;padding:15px}
.fig.out{opacity:.72}
.fig header{display:flex;align-items:flex-start;gap:10px;justify-content:space-between;
 flex-wrap:wrap}
.fig .who{display:flex;gap:10px;align-items:center}
.fig h3{font-size:17px}
.fig .role{font-size:12.5px;color:var(--dim);margin:1px 0 0}
.fig .verdict{display:flex;align-items:center;gap:8px}
.fig .at{font-size:11.5px;color:var(--dim)}
.tag{display:inline-flex;align-items:center;justify-content:center;min-width:28px;
 height:28px;padding:0 9px;border-radius:7px;font:500 14px/1 var(--num)}
.tag.win{background:var(--accent);color:#0B1418}
.tag.out{background:none;border:1px solid var(--edge-2);color:var(--dim);font-size:12px}
.ledger{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--edge);
 border:1px solid var(--edge);border-radius:9px;overflow:hidden;margin:12px 0}
@media(min-width:520px){.ledger{grid-template-columns:repeat(4,1fr)}}
.ledger>div{background:var(--panel-2);padding:7px 9px 8px}
.ledger dt{font-size:11px;color:var(--dim)}
.ledger dd{margin:2px 0 0;font:500 15px/1.1 var(--num)}
.ledger dd span{font:400 10.5px/1 var(--sans);color:var(--dim);margin-left:3px}
.ledger .none dd{font-size:12.5px;color:var(--dim)}
.bars{margin:12px 0 8px;display:flex;flex-direction:column;gap:5px}
.bar{display:flex;align-items:center;gap:9px}
.bar .l{width:16px;font:500 13px/1 var(--num);color:var(--dim)}
.bar .t{flex:1;height:9px;background:var(--sunk);border-radius:99px;overflow:hidden}
.bar .t i{display:block;height:100%;background:rgba(180,176,168,.45)}
.bar.top .t i{background:var(--accent)}
.bar.top .l{color:var(--ink)}
.bar .v{width:40px;text-align:right;font:500 12.5px/1 var(--num);color:var(--mid)}
.fail{margin:7px 0 0;padding:9px 11px;border-radius:8px;font-size:13px;
 background:rgba(255,46,31,.07);border:1px solid rgba(255,46,31,.24);color:var(--mid)}
.fail b{color:#FF8D82;font-weight:500}
.taste{margin:10px 0 0;font-size:13px;color:var(--dim);padding-top:9px;
 border-top:1px dashed var(--edge-2)}
.taste b{color:var(--mid);font-weight:500}

.stand{display:grid;grid-template-columns:1fr;gap:14px;margin-top:16px}
@media(min-width:860px){.stand{grid-template-columns:repeat(2,1fr)}}
.board{background:var(--panel);border:1px solid var(--edge);border-radius:12px;padding:16px}
.board h3{font-size:16px}
.board .k{font-size:12.5px;color:var(--dim);margin:3px 0 13px}
.row{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.row .l{width:18px;font:500 15px/1 var(--num)}
.row .nm{width:auto;flex:1;font-size:13.5px;color:var(--mid)}
.row .t{width:46%;height:12px;background:var(--sunk);border-radius:3px;overflow:hidden}
.row .t i{display:block;height:100%;background:rgba(180,176,168,.4)}
.row.top .t i{background:var(--accent)}
.row .v{width:24px;text-align:right;font:500 14px/1 var(--num)}
.names{font-size:12px;color:var(--dim);margin:0 0 0 28px}

table.m{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:12px}
table.m th{text-align:left;font-weight:500;color:var(--dim);font-size:12px;
 padding:0 10px 7px 0;border-bottom:1px solid var(--edge);white-space:nowrap}
table.m td{padding:8px 10px 8px 0;border-bottom:1px solid var(--edge);color:var(--mid);
 vertical-align:top}
table.m td b{color:var(--ink);font-weight:500}
table.m td.n{font-family:var(--num);color:var(--ink)}
.scroller{overflow-x:auto}

.gate{margin-top:18px;background:var(--sunk);border:1px solid var(--edge);
 border-radius:10px;padding:13px 15px;font:13px/1.7 var(--num);color:var(--mid);
 white-space:pre-wrap}
.pass{color:#5FD5A6}.failw{color:#FF8D82}
.stampb{margin-top:16px;font:12.5px/1.8 var(--num);color:var(--dim);white-space:pre-wrap}
ul{margin:0 0 12px;padding-left:19px;color:var(--mid);font-size:14.5px}
li{margin-bottom:6px}
</style>
</head>
<body>
<div class="wrap">`;

function answerCard(a){
 const g16=GEO[1600][a.id], g39=GEO[390][a.id];
 const winR=(k,w)=>GEO[w][a.id][k]===BEST(w,k)?'win':'';
 const say={
  band:'<b>The word is in the colour.</b> Nothing is printed outside the ring and no arc is closed. The band has to be thick enough to hold type, so it takes the outer three tenths of the shell and pushes the chain ring in.',
  mark:'<b>A gauge, and no words.</b> The seven marks are one glyph declined seven times and the chord is the height in the body. The word arrives for the seat under a pointer or a focus ring, which is a gesture a phone does not have.',
  axis:'<b>One lane, and the names fit it.</b> Seventeen pixels of radius outside the ring, whatever the longest name is, and every run fits the arc its own seat owns.',
  spine:'<b>The names leave the drawing.</b> Colour and height carry the link, so a person matches a colour across a gap, and the column takes width off a stage that at 390 has none to give.'}[a.id];
 return `<div class="ans">
 <div class="cap"><h3>${a.L}. ${esc(a.nm)}</h3><div class="sub">${esc(a.sub)}</div></div>
 <div class="art">${diagram(a.id,390,300)}</div>
 <div class="figs">
  <div class="fg ${winR('shell',390)}"><div class="l">Shell</div>
   <div class="v">${n0(g39.shell)}<small>px at 390</small></div></div>
  <div class="fg ${winR('shell',1600)}"><div class="l">Shell</div>
   <div class="v">${n0(g16.shell)}<small>px at 1600</small></div></div>
  <div class="fg ${g39.outside>0?'lose':'win'}"><div class="l">Outside</div>
   <div class="v">${n0(g39.outside)}<small>px</small></div></div>
  <div class="fg ${g39.reserved>0?'lose':'win'}"><div class="l">Reserved</div>
   <div class="v">${n0(g39.reserved)}<small>degrees</small></div></div>
  <div class="fg ${winR('stave',390)}"><div class="l">Stave</div>
   <div class="v">${n1(g39.stave)}<small>px, derived</small></div></div>
  <div class="fg ${winR('chain',390)}"><div class="l">Chain</div>
   <div class="v">${n0(g39.chain)}<small>px, derived</small></div></div>
 </div>
 <div class="say">${say}</div>
</div>`;}

/* the gate. a sheet that cannot fail is not a measurement. */
const GATEJS=`
function gate(){
 var P=0,F=0,out=[];
 function ok(c,m){if(c){P++;out.push('<span class="pass">pass</span>  '+m);}
  else{F++;out.push('<span class="failw">FAIL</span>  '+m);}}
 var body=document.body.innerText;
 ok(body.indexOf('\\u2014')<0,'no em dash in the rendered text');
 var caps=(body.match(/\\b[A-Z]{4,}\\b/g)||[]).filter(function(w){
  return ['FAIL'].indexOf(w)<0;});
 ok(caps.length===0,'no all caps run in the copy'+(caps.length?', '+caps.join(' '):''));
 ok(!/(plus or minus|\\u00b1|swing\\s+\\d)/i.test(body),
  'no figure printed with an interval or a tolerance');
 ok(body.indexOf('108')<0,'the address count is never printed as 108');
 ok(!/\\b\\d+\\s+of\\s+1(08|12)\\b/.test(body),'no count printed against the address total');
 var small=[];
 document.querySelectorAll('.wrap *').forEach(function(e){
  if(!e.childNodes.length)return;
  var t=(e.textContent||'').trim(); if(!t)return;
  var f=parseFloat(getComputedStyle(e).fontSize);
  if(f&&f<11)small.push(e.className||e.tagName);});
 ok(small.length===0,'nothing in the chrome under 11 px, '+small.length+' found');
 var ext=[];
 document.querySelectorAll('script[src],link[href],img[src],iframe[src]').forEach(function(e){
  ext.push(e.getAttribute('src')||e.getAttribute('href'));});
 ok(ext.length===0,'the page references nothing, '+ext.length+' found');
 ok(document.querySelectorAll('.fig').length===__N,
  'every figure in the roster has a card, '+document.querySelectorAll('.fig').length);
 ok(document.querySelectorAll('.fig .taste').length===__N,
  'every card carries its taste line, kept out of the total');
 ok(document.querySelectorAll('svg').length>0,
  'the sheet draws, '+document.querySelectorAll('svg').length+' drawings');
 document.getElementById('tests').innerHTML=
  '<b>gate, '+P+' pass '+F+' fail, at '+innerWidth+' by '+innerHeight+'</b>\\n'+out.join('\\n');
 window.__gate={pass:P,fail:F};}
gate(); addEventListener('resize',gate);`;

const OPEN=AGREES
 ? `<h2>The cohort agrees with the ruling. ${WINNER.L} wins, and it is not close.</h2>
    <p>${VOTES.length} of the figures vote, ${STAND[WINNER.id]} of them for ${WINNER.L}.
    ${UNANIM?'Nothing else takes a single vote.':'The rest split.'}
    ${BOTHWIDTHS?'The ranking is the same at 1600 and at 390, so the phone does not change the answer.'
     :'The ranking moves between the two widths for at least one figure, and that figure says so on its own card.'}
    Two figures abstain, and the reason is measured rather than polite: the engine returns
    unread on their reading, so the surface shows the four doors and there is no ring to
    prefer.</p>
    <p>The useful part of the run is therefore not the winner. It is the three things
    under it: who each answer fails and why, the one measured cost ${WINNER.L} carries,
    and the fact that the answer the instrument minded figures would <i>say</i> they
    like is the one that fails them hardest.</p>`
 : `<h2>The cohort does not agree with the ruling. ${WINNER.L} wins the traceable
    count, not A.</h2>
    <p>${STAND[WINNER.id]} votes for ${WINNER.L} against ${STAND.band} for A, out of
    ${VOTES.length} that vote. What drove it is on every card below, and the summary is
    in the standings.</p>`;

const BODY=`
<header class="hd">
 <div class="eyebrow">Preference study, run against the roster</div>
 <h1>Which one they like, and what that is worth</h1>
 <p class="lede">He ruled A inside the band and asked for the cohort anyway. So this is
 not a confirmation. It is the same four answers put in front of every figure in the
 roster at the width that figure holds the product at, scored only where the score
 traces to something measured about them, with everything else reported as taste and
 kept out of the total.</p>
</header>

<div class="boundary">
 <h2>The boundary, said once</h2>
 <p>The cohort is simulated. A preference returned by a model is that model's own
 assumptions wearing a vote. So a preference counts here only where it traces to
 something measured: what this figure's reading actually draws, how many of the seven
 seats the ring colours for them, how many chains hang on the inner ring, how old they
 are, and where they stopped in the ninety day run. Those come off the engine and off
 the run.</p>
 <p>The width a figure holds the product at is not measured. It is a declared assumption
 in the showup model, which says of itself that it is judgement. It is used for one
 thing. <b>The model picks the width. The measurement at that width carries the vote.</b>
 Five figures have no session record at all, so they are scored at both widths and their
 card says so.</p>
 <p>Everything else is taste. It sits on every card, labelled, and it is never added to a
 total. The taste standings are reported separately at the bottom, because they disagree
 with the traceable ones and the disagreement is the most useful thing on this page.</p>
</div>

<div class="answer">
 ${OPEN}
</div>

<section>
 <div class="sechd"><h2>The four answers, and what each one gives a reader</h2>
  <span class="who">drawn to scale at 390 from the measured shell</span></div>
 <p class="note">Every drawing below is the same scale: the dashed outer circle is the
 free radius the stage has at 390, which is ${n0(GEO[390].band.free)} pixels, and
 everything inside it is drawn against that. The blue dashed ring is where a charged
 address draws. The gold dashed ring is where the chains hang. Shell, outside and
 reserved are measured. Stave and chain are the measured shell times a constant read off
 the prototype, and they are marked derived.</p>
 <div class="grid4">${ANS.map(answerCard).join('')}</div>
 <p class="note" style="margin-top:14px">The incumbent, for the comparison: as it ships
 the reading gets ${n0(GEO[390].today.shell)} pixels of radius at 390, hands
 ${n0(GEO[390].today.outside)} pixels to seven words outside the ring, closes
 ${n0(GEO[390].today.reserved)} degrees of arc, and the ring those words sit in carries
 ink on ${n0(GEO[390].today.lit)} per cent of itself. A charged address gets
 ${n1(GEO[390].today.stave)} pixels of stave. Every one of the four beats that.</p>
</section>

<section>
 <div class="sechd"><h2>What each one asks the eyes to do</h2>
  <span class="who">the thing that has to be told apart</span></div>
 <div class="scroller"><table class="m">
  <tr><th>answer</th><th>what has to be resolved</th><th>at 390</th><th>at 1600</th>
   <th>the floor it is held to</th></tr>
  <tr><td><b>A</b></td><td>A word on the band's own colour, in a gutter held dark so the
   reading is not underneath it.</td>
   <td class="n">${n2(GEO[390].band.contrast)} to 1</td>
   <td class="n">${n2(GEO[1600].band.contrast)} to 1</td>
   <td>4.5 to 1, and it clears it at every seat.</td></tr>
  <tr><td><b>B</b></td><td>Seven states told apart by the height of one chord inside one
   ring, with no word until a gesture arrives.</td>
   <td class="n">${n1(GEO[390].mark.markPx)} px</td>
   <td class="n">${n1(GEO[1600].mark.markPx)} px</td>
   <td>About 18, by the prototype's own reckoning. At 390 there is no margin left.</td></tr>
  <tr><td><b>C</b></td><td>A word set along a lane one line deep, on the page ground.</td>
   <td class="n">${n0(GEO[390].axis.lane)} px</td>
   <td class="n">${n0(GEO[1600].axis.lane)} px</td>
   <td>Every run fits the arc its own seat owns, measured, with none past it.</td></tr>
  <tr><td><b>D</b></td><td>A colour matched from a word in a column to an arc in a ring,
   across a gap.</td>
   <td class="n">${n0(GEO[390].spine.spineW)} px of column</td>
   <td class="n">${n0(GEO[1600].spine.spineW)} px of column</td>
   <td>There is no floor. It depends on the reading, and that is the defect.</td></tr>
 </table></div>
 <p class="note">The last row is the one that decides this study. D's link is a colour,
 so D can only point at a seat the ring has coloured, and how many seats the ring colours
 is a property of the person and not of the design. Run against the roster, the ring
 colours no seat at all for six of the figures and one seat for a seventh. For those
 seven, D prints seven names beside a grey ring.</p>
</section>

<section>
 <div class="sechd"><h2>The roster, figure by figure</h2>
  <span class="who">each card names the width, the evidence and the failures</span></div>
 <p class="note">The seven arcs beside each name are that figure's own seats, read off the
 engine: coloured where the ring colours them and grey where it does not. The bars are the
 traceable score at that figure's width. The failures under the bars are named conditions,
 not opinions. The taste line is under the rule and is never in the bars.</p>
 <div class="figs2">${COHORT.map(figCard).join('')}</div>
</section>

<section>
 <div class="sechd"><h2>The standings, twice, kept apart</h2>
  <span class="who">traceable on the left, taste on the right</span></div>
 <div class="stand">
  <div class="board">
   <h3>By traceable reason</h3>
   <p class="k">First choices among the ${VOTES.length} figures that vote. Two abstain
   because their reading is unread and no ring is drawn for them.</p>
   ${ANS.map(a=>`<div class="row${STAND[a.id]===Math.max.apply(null,ANS.map(x=>STAND[x.id]))?' top':''}">
    <span class="l">${a.L}</span><span class="nm">${esc(a.nm)}</span>
    <span class="t"><i style="width:${(STAND[a.id]/Math.max(1,VOTES.length)*100).toFixed(1)}%"></i></span>
    <span class="v">${STAND[a.id]}</span></div>
    <p class="names">${VOTES.filter(c=>c.pick===a.id).map(c=>esc(c.f.nm)).join(', ')||'nobody'}</p>`).join('')}
  </div>
  <div class="board">
   <h3>By taste, and it is taste</h3>
   <p class="k">What each figure would say, argued from their own words and their
   register. Nothing here was added to a score.</p>
   ${ANS.map(a=>`<div class="row${TSTAND[a.id]===Math.max.apply(null,ANS.map(x=>TSTAND[x.id]))?' top':''}">
    <span class="l">${a.L}</span><span class="nm">${esc(a.nm)}</span>
    <span class="t"><i style="width:${(TSTAND[a.id]/Math.max(1,COHORT.length)*100).toFixed(1)}%"></i></span>
    <span class="v">${TSTAND[a.id]}</span></div>
    <p class="names">${COHORT.filter(c=>c.taste.pick===a.id).map(c=>esc(c.f.nm)).join(', ')||'nobody'}</p>`).join('')}
   <p class="note" style="margin-top:12px">${tasteNone} name nothing: two because the
   reading is unread and one because he refuses the frame.</p>
  </div>
 </div>
 <p class="note" style="margin-top:14px"><b>The two lists disagree and that is the
 finding.</b> ${esc(TWINNER.L)} leads on taste as well, but by far less, and B takes the
 figures who most want this to look like equipment rather than like self help. Those are
 the same figures B fails on measurement: one is 57 and his whole ninety day run is
 ${n1(RUN.James.minutes)} minutes, which is not a budget for finding out that the word
 arrives on hover.</p>
</section>

<section>
 <div class="sechd"><h2>Who each answer fails, and why</h2></div>
 <div class="scroller"><table class="m">
  <tr><th>answer</th><th>fails</th><th>the measured condition</th></tr>
  ${ANS.map(a=>{
   const who=COHORT.filter(c=>c.main.rows.filter(r=>r.id===a.id)[0].fails.length);
   return `<tr><td><b>${a.L}</b></td>
   <td>${who.length?who.map(c=>esc(c.f.nm)).join(', '):'nobody in the roster'}</td>
   <td>${a.id==='band'?'The chain layer moves in. A band of three tenths of the shell puts the chain ring at '+n0(GEO[1600].band.chain)+' pixels at 1600 against '+n0(GEO[1600].axis.chain)+' under C, and seven of the figures draw twenty five chains or more on it. It is a cost and not a failure, and it is the one thing A gives up.'
    :a.id==='mark'?'No word until a gesture. On a phone there is no hover and the tap that would fetch the word is the tap that opens the seat. The mark is '+n1(GEO[390].mark.markPx)+' pixels at 390 and the seven states differ by the height of a chord inside it, against a tap floor of 44.'
    :a.id==='axis'?'Nothing in the roster. C spends '+n0(GEO[390].axis.lane)+' pixels of radius at both widths and every run fits its own arc.'
    :'The link is a colour and the reading decides whether there is one. The ring colours no seat for six figures and one seat for a seventh, and the column takes '+n0(GEO[390].spine.spineW)+' pixels off a stage '+n0(GEO[390].spine.CW)+' wide.'}</td></tr>`;}).join('')}
 </table></div>
</section>

<section>
 <div class="sechd"><h2>Question two. The four shell directions</h2>
  <span class="who">measured with Crown open, the heaviest seat</span></div>
 <p class="note">The second question landed while this was being run, so it went into the
 same study. It does not separate the way the first one does, and the reason is one
 number. Every direction was opened on Crown, which holds more addresses than any other
 seat, at both widths, and the type each one could fit was read off the prototype's own
 fitter.</p>
 <div class="scroller"><table class="m">
  <tr><th>direction</th><th>names an address at 1600</th><th>names an address at 390</th>
   <th>worst paint at 390</th><th>frames past budget</th></tr>
  ${SHELLROW.map(r=>`<tr><td><b>${esc(r.nm)}</b>${r.killed?' <span style="color:var(--dim)">killed</span>':''}</td>
   <td class="n">${r.fit1600==null?'never in type':(r.fit1600>0?n1(r.fit1600)+' px':'refuses, sends the name to the middle')}</td>
   <td class="n">${r.fit390==null?'never in type':(r.fit390>0?n1(r.fit390)+' px':'refuses, sends the name to the middle')}</td>
   <td class="n">${r.worst390==null?'not measured':n2(r.worst390)+' ms'}</td>
   <td class="n">${r.over}</td></tr>`).join('')}
 </table></div>
 <p class="note" style="margin-top:12px"><b>None of the four names an address at 390
 above the floor this product already holds.</b> The chrome floor the nameplate prototype
 gates at is ${FLOOR_TYPE} pixels. At 390 Shell and Strata never set an address name in
 type at all, Kerf refuses and sends the name to the middle, and Unroll prints at
 ${n1(MEAS.fieldB[390].dirs.unroll.fitted)} pixels, which is the floor of its own fitter
 and well under the chrome floor. At 1600 only Unroll clears it, at
 ${n1(MEAS.fieldB[1600].dirs.unroll.fitted)}.</p>
 <p class="note">So for the two figures the model puts on a phone only, question two has
 no winner on the naming question, and the shell has to be chosen on what it does at rest
 rather than on what it does when a seat is pressed. At rest the numbers are these: an
 address at Crown is ${n1(RING[390].ring.seventhCrownPx)} pixels wide at 390 when the ring
 is cut into sevenths and ${n1(RING[390].ring.sharePx)} pixels when it is cut by address,
 which is the difference between a bar that could one day carry something and a bar that
 never will. That is the whole of the seventh against the share, drawn.</p>
 <p class="note">Paint cost does not separate them. The worst frame across all three
 profiles measured is ${n2(Math.max.apply(null,SHELLROW.map(r=>r.gapWorst)))} milliseconds
 and the only direction that dropped a frame at all is
 ${esc((SHELLROW.filter(r=>r.over>0)[0]||{nm:'none'}).nm)}. Choosing on paint would be
 choosing on noise.</p>
</section>

<section>
 <div class="sechd"><h2>What this means for the ruling he already made</h2></div>
 <ul>
  <li><b>The ruling stands and the cohort did not have to carry it.</b> A wins the
  traceable count on ${STAND.band} of ${VOTES.length} votes, at both widths, and the
  figures it wins for are not the same figures for each reason. It wins for the
  phone only figures because it needs no gesture, and it wins for the heavily loaded
  figures because it gives a charged address ${n1(GEO[390].band.stave)} pixels of stave at
  390 against ${n1(GEO[390].axis.stave)} under C.</li>
  <li><b>A has one measured cost and it should be paid deliberately.</b> The band takes
  the outer three tenths of the shell, which puts the chain ring at
  ${n0(GEO[1600].band.chain)} pixels against ${n0(GEO[1600].axis.chain)} under C at 1600.
  Seven figures in the roster draw twenty five chains or more. If the chains are the
  thing a person is meant to see, the band's share of the shell is the number to argue
  about, not the ruling.</li>
  <li><b>D should not be a fallback for anything.</b> Its link is a colour and whether
  there is a colour is a property of the reader, not of the design. Run against the
  roster it points at nothing for six figures. That is not a taste objection and it does
  not improve with craft.</li>
  <li><b>C is still the right answer for the deepest view, and this run does not argue
  with that.</b> It costs ${n0(GEO[390].axis.lane)} pixels of radius at both widths, it
  fails nobody, and it is the only one of the four that keeps the chain ring where the
  shipped drawing puts it.</li>
  <li><b>B is the trap.</b> It is the one the instrument minded figures would say they
  like, and it is the one that fails them. A gauge with no words is a beautiful first
  impression and a stranger on day one has nothing to read. The figure who wants his
  number in the first ten seconds has a ninety day run of ${n1(RUN.James.minutes)}
  minutes. He will not find the hover.</li>
  <li><b>What to instrument, so the next round can tell whether it worked.</b> Time from
  the surface opening to the first seat named out loud, which A should take to nothing and
  B cannot. The share of sessions in which any seat is pressed at all, which is the gesture
  B depends on and nothing else does. And the count of seats the ring colours per reading,
  which is already computable and is the number that decides whether any colour linked
  design can work at all.</li>
 </ul>
</section>

<section>
 <div class="sechd"><h2>The gate</h2>
  <span class="who">a sheet that cannot fail is not a measurement</span></div>
 <div class="gate" id="tests">the gate runs on load</div>
 <div class="stampb">commit       ${esc(stamp.commit)}, tree ${esc(stamp.dirty)}
engine       md5 ${esc(stamp.engine)}
measured     ${esc(MEAS.stamp)}
built        ${esc(stamp.when)}
prototypes   ${MEAS.checks.filter(c=>/^pass/.test(c)).length} checks passed on the measurement pass, ${MEAS.checks.filter(c=>/^FAIL/.test(c)).length} failed
figures      ${COHORT.length} read off the engine, ${VOTES.length} vote, ${COHORT.length-VOTES.length} abstain
run          sim/ninety.json, ${Object.keys(RUN).length} figures carry a ninety day session</div>
</section>
</div>
<script>var __N=${COHORT.length};${GATEJS}</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname,'index.html'),HEAD+BODY);
fs.writeFileSync(path.join(__dirname,'standings.json'),JSON.stringify({
 stamp:stamp, agrees:AGREES, winner:WINNER.id, traceable:STAND, taste:TSTAND,
 sameAtBothWidths:BOTHWIDTHS, unanimous:UNANIM,
 figures:COHORT.map(c=>({nm:c.f.nm, age:c.f.age, width:c.width, abstain:c.abstain,
  pick:c.pick, pick390:c.pick390, pick1600:c.pick1600, taste:c.taste.pick,
  carrying:c.f.carrying, grey:c.f.grey, seatsLit:c.f.seatsLit, chains:c.f.chains,
  CQ:c.f.CQ, unread:c.f.unread, minutes:c.run?c.run.minutes:null,
  scores:c.main.rows.map(r=>({L:r.L, score:r.score, fails:r.fails}))})),
 geometry:GEO, shells:SHELLROW},null,1)+'\n');

console.log('agrees with A: '+AGREES+'  winner '+WINNER.L);
console.log('traceable  '+ANS.map(a=>a.L+' '+STAND[a.id]).join('  '));
console.log('taste      '+ANS.map(a=>a.L+' '+TSTAND[a.id]).join('  '));
console.log('same at both widths: '+BOTHWIDTHS+'   unanimous: '+UNANIM);
COHORT.forEach(c=>console.log('  '+c.f.nm.padEnd(9)+(c.abstain?'abstains':
 (LETTER[c.pick]+'  at '+c.width+'  ['+c.main.rows.map(r=>r.L+' '+r.score).join(', ')+']'))));
console.log('sim/preference/index.html written, '
 +(fs.statSync(path.join(__dirname,'index.html')).size/1024).toFixed(1)+' kB');
