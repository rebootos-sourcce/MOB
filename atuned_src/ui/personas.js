
/* ---- THE MATRIX. 19 domains across, 9 child fetters down. Cells drill. ---- */
const MXC=[];
for(let rw=0;rw<9;rw++)for(let c=0;c<19;c++){
 const b=document.createElement('button');b.type='button';
 b.title=DOMAINS[c].nm+' × '+CHILD[rw].nm;
 b.setAttribute('aria-label',DOMAINS[c].nm+' by '+CHILD[rw].nm);
 b.dataset.c=c;b.dataset.rw=rw;
 b.addEventListener('click',function(){runCellDrill(c,rw);});
 b.addEventListener('mouseenter',function(){
  const seg=W.filter(function(n){
   return Math.min(18,Math.floor(n.slot/(108/19)))===c&&n.cf===CHILD[rw].nm;});
  const held=seg.length?seg.reduce(function(a,n){return a+n.sq;},0)/seg.length:0;
  $('mxk').innerHTML='<b>'+DOMAINS[c].nm+'</b> × <b>'+CHILD[rw].nm+'</b><br>'
   +seg.length+' address'+(seg.length===1?'':'es')+', SQ <b>'+held.toFixed(1)+'</b>'
   +((AFFIN[DOMAINS[c].r]||[]).indexOf(CHILD[rw].nm)>=0
     ?'<br><b>1.3× affinity pair</b> for '+DOMAINS[c].r:'');});
 $('mx').appendChild(b);MXC.push(b);}
$('mx').addEventListener('mouseleave',mxKey);
function mxKey(){$('mxk').innerHTML='Columns are domains, rows are child fetters. '
 +'Brightness is the SQ held in that cell. A gold ring is a <b>1.3× affinity pair</b>. '
 +'Click any cell.<div class="mxrow">'
 +ROOTD.map(function(rd){return '<span><i style="background:'+ROOTCOL[rd]+'"></i>'+rd+'</span>';}).join('')
 +'</div>';}
function syncMx(){MXC.forEach(function(b){
 const c=+b.dataset.c,rw=+b.dataset.rw,cf=CHILD[rw].nm,D=DOMAINS[c];
 const seg=W.filter(function(n){return Math.min(18,Math.floor(n.slot/(108/19)))===c&&n.cf===cf;});
 const held=seg.length?seg.reduce(function(a,n){return a+n.sq;},0)/seg.length/10:0;
 const base=hx(ROOTCOL[D.r]).join(',');
 b.style.background='rgba('+base+','+(seg.length?(0.05+held*0.9).toFixed(2):'0.02')+')';
 b.dataset.sel=S.doms.indexOf(c)>=0?'1':'0';
 b.style.outline=(AFFIN[D.r]||[]).indexOf(cf)>=0
  ?('1px solid rgba(223,204,126,'+(S.doms.indexOf(c)>=0?'.95':'.3')+')'):'none';});}

/* ---- spiritual states. behaviour, not definition. every row drills. ---- */
function renderSpirit(){
 var el=$('spirit'); if(!el)return;
 var p=PEOPLE[S.who]||PEOPLE[0], sp=spiritual(p.nm);
 /* A person's own birth data goes into Intake, is saved to CURP.who.born, and
    until now nothing read it. BIRTH.You is null and always was, so the whole
    ephemeris was visible to nine fixtures and to nobody real. spiritualOf was
    written to close exactly this and was never called. It is called here. */
 if(!sp&&CURP&&CURP.who&&CURP.who.born&&CURP.who.born.date){
  var bn=CURP.who.born;
  sp=spiritualOf({d:bn.date, t:(bn.timeUnknown?'':(bn.time||'')), p:bn.place||''});}
 if(!sp){
  el.innerHTML='<div class="sp-none">No birth data. Date, time and place unlock sun, moon, '
   +'rising, the year animal, life path and design type.</div>';
  return;}
 function row(k,glyph,v,x,dk,dv){
  return '<button class="sp-row" data-sp="'+dk+'" data-spv="'+esc(dv||v)+'">'
   +'<span class="sp-k">'+k+'</span>'
   +'<span class="sp-v">'+(glyph?'<em class="sp-g">'+glyph+'</em>':'')+esc(v)+'</span>'
   +'<span class="sp-x">'+esc(x||'')+'</span></button>';}
 el.innerHTML='<div class="sp-hd">Western</div>'
  +row('Sun',ZGLYPH[sp.sun],sp.sun,sp.sunEl,'sign')
  +row('Moon',ZGLYPH[sp.moon],sp.moon,sp.moonEl,'sign')
  /* The ascendant is the one reading that needs a place, because it is the
     degree rising on the horizon and that depends on where the horizon was.
     A blank row says nothing, so the row says what is missing and why. */
  +(sp.rising
    ? row('Rising',ZGLYPH[sp.rising],sp.rising,sp.risingEl,'sign')
    : '<div class="sp-row static"><span class="sp-k">Rising</span>'
      +'<span class="sp-v">unresolved</span><span class="sp-x">'
      +(sp.needsTime?'needs a birth time':'needs a birthplace the instrument can locate')
      +'</span></div>')
  +'<div class="sp-hd">Eastern</div>'
  +row('Year','',sp.celem+' '+sp.chinese,'','chinese',sp.chinese)
  +row('Element','',sp.celem,'','celem',sp.celem)
  +'<div class="sp-hd">Number</div>'
  +row('Path','',String(sp.lp),sp.lpMean,'lp',String(sp.lp))
  +(sp.master?row('Master','',String(sp.master),'survives reduction','lp',String(sp.master)):'')
  +'<div class="sp-hd">Design</div>'
  /* the personality and design gates are real and computed. the type is
     not, and says so, rather than printing one that sounds right. */
  +row('Profile','',sp.hd.profile||'unresolved','personality line over design line','hd',sp.hd.profile||'')
  +row('Personality','',sp.hd.personality?('gate '+sp.hd.personality.gate+'.'+sp.hd.personality.line):'unresolved',
    'the sun at birth','gk',sp.hd.personality?String(sp.hd.personality.gate):'')
  +row('Design','',sp.hd.design?('gate '+sp.hd.design.gate+'.'+sp.hd.design.line):'unresolved',
    'the sun 88 degrees earlier','gk',sp.hd.design?String(sp.hd.design.gate):'')
  +'<div class="sp-row static"><span class="sp-k">Type</span><span class="sp-v">unresolved</span>'
  +'<span class="sp-x">needs the full bodygraph</span></div>'
  +row('Gene key','',sp.gk.gate+'.'+sp.gk.line,'the gate the sun occupied','gk',sp.gk.gate+'.'+sp.gk.line)
  +'<div class="sp-hd">Born</div>'
  +'<div class="sp-row static"><span class="sp-k">When</span><span class="sp-v">'
  +sp.birth.d+'</span><span class="sp-x">'+sp.birth.t+'</span></div>'
  +'<div class="sp-row static"><span class="sp-k">Where</span><span class="sp-v">'
  +esc(sp.birth.p)+'</span><span class="sp-x"></span></div>';
 el.querySelectorAll('[data-sp]').forEach(function(btn){
  btn.onclick=function(){runSpDrill(btn.getAttribute('data-sp'),btn.getAttribute('data-spv'));};});}

/* ---- the compass. where coherence sits, and how far it swings. ---- */
function renderPol2(r){
 var el=$('pol2'); if(!el)return;
 /* the labels sit at x+20 and run right, so a 58 wide box cut them off.
    the box is wide enough to hold what it draws. */
 var H=360,Wd=104,top=30,bot=H-30,x=34;
 var cq=Math.max(0,Math.min(100,r.CQ));
 /* the band narrows as coherence rises. tight alignment leaves little room to
    wander, a decohering field ranges wide. */
 var swing=(1-cq/100), bandPts=2.5+swing*swing*26;
 var lo=Math.max(0,cq-bandPts/2), hi=Math.min(100,cq+bandPts/2);
 var yLo=bot-(lo/100)*(bot-top), yHi=bot-(hi/100)*(bot-top);
 var t=REDUCED?0:S.t;
 var drift=REDUCED?0:(Math.sin(t*0.55)*0.62+Math.sin(t*0.23+1.1)*0.38);
 var live=cq+drift*(bandPts/2);
 var y=bot-(Math.max(0,Math.min(100,live))/100)*(bot-top);
 var mid=bot-(bot-top)*0.50, y60=bot-(bot-top)*0.60, y40=bot-(bot-top)*0.40;
 var up=cq>=50, gc=GOLD, rc=PAL.Root;
 var s='<svg viewBox="0 0 '+Wd+' '+H+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
 s+='<line x1="'+x+'" y1="'+top+'" x2="'+x+'" y2="'+mid+'" stroke="'+gc+'" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>';
 s+='<line x1="'+x+'" y1="'+mid+'" x2="'+x+'" y2="'+bot+'" stroke="'+rc+'" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>';
 s+='<rect x="'+(x-5)+'" y="'+y60+'" width="10" height="'+(y40-y60).toFixed(1)+'" rx="2" fill="rgba(128,128,128,.10)"/>';
 [[60,y60],[50,mid],[40,y40]].forEach(function(tk){
  s+='<line x1="'+(x-6)+'" y1="'+tk[1]+'" x2="'+(x+6)+'" y2="'+tk[1]+'" stroke="rgba(128,128,128,.34)" stroke-width="1"/>';
  s+='<text x="'+(x-10)+'" y="'+(tk[1]+3.5)+'" text-anchor="end" class="pol2-t">'+tk[0]+'</text>';});
 /* THE TWO ENDS ARE DOORS. The compass was a picture of a direction with
    nothing at either end of it. The top of the cone is anchored by the
    twelve, the bottom by the blueprint and the nine circles, and both are
    behaviours rather than figures. Each end carries its own hit box, which
    is generous because the glyphs are small, and opens its own roster. */
 s+='<g class="p2end" data-polend="up" opacity="'+(up?1:.35)+'">'
  +'<rect x="'+(x-22)+'" y="'+(top-30)+'" width="44" height="34" fill="transparent"/>'
  +'<ellipse cx="'+x+'" cy="'+(top-15)+'" rx="8" ry="3.2" fill="none" stroke="'+gc+'" stroke-width="1.6"/>'
  +'<path d="M'+(x-7)+' '+(top-4)+' Q'+x+' '+(top-11)+' '+(x+7)+' '+(top-4)+'" fill="none" stroke="'+gc+'" stroke-width="1.3" opacity=".6"/></g>';
 s+='<g class="p2end" data-polend="dn" opacity="'+(up?.35:1)+'">'
  +'<rect x="'+(x-22)+'" y="'+(bot)+'" width="44" height="32" fill="transparent"/>'
  +'<path d="M'+x+' '+(bot+22)+' L'+x+' '+(bot+11)+'" stroke="'+rc+'" stroke-width="1.8" fill="none"/>'
  +'<path d="M'+(x-6)+' '+(bot+11)+' L'+(x-6)+' '+(bot+4)+' M'+x+' '+(bot+11)+' L'+x+' '+(bot+2)
  +' M'+(x+6)+' '+(bot+11)+' L'+(x+6)+' '+(bot+4)+'" stroke="'+rc+'" stroke-width="1.5" fill="none"/>'
  +'<path d="M'+(x-7)+' '+(bot+11)+' L'+(x+7)+' '+(bot+11)+'" stroke="'+rc+'" stroke-width="1.5" fill="none"/></g>';
 var mc=up?gc:rc;
 s+='<rect x="'+(x-3.5)+'" y="'+yHi.toFixed(1)+'" width="7" height="'+(yLo-yHi).toFixed(1)
  +'" rx="3.5" fill="'+mc+'" opacity=".16"/>';
 s+='<text x="'+(x+20)+'" y="'+(yHi-4).toFixed(1)+'" class="pol2-t">swing '+bandPts.toFixed(0)+'</text>';
 s+='<path d="M'+(x+9)+' '+y.toFixed(1)+' L'+(x+17)+' '+(y-4.5).toFixed(1)+' L'+(x+17)+' '+(y+4.5).toFixed(1)+' Z" fill="'+mc+'"/>';
 s+='<circle cx="'+x+'" cy="'+y.toFixed(1)+'" r="3.6" fill="'+mc+'"/>';
 s+='<circle cx="'+x+'" cy="'+y.toFixed(1)+'" r="7" fill="none" stroke="'+mc+'" stroke-width="1" opacity=".45"/>';
 /* not off the defaults. the marker still sits where the arithmetic puts it,
    because the picture of an unread field is a real picture, but the number
    beside it is not printed until somebody has entered something. */
 s+='<text x="'+(x+20)+'" y="'+(y+4).toFixed(1)+'" class="pol2-c" style="fill:'+mc+'">'
  +(r.unread?'\u2013':Math.round(cq))+'</text>';
 el.innerHTML=s+'</svg>';}

/* ---- accuracy. one value, given room. B19 scope. ---- */
function renderAcc(r){
 var el=$('acc'); if(!el)return;
 var a=accuracy(r), w=[];
 if(a.cov<21) w.push((21-a.cov)+' law'+(21-a.cov===1?'':'s')+' unmeasured, sitting at the default 6');
 if(a.signal<70) w.push('signal '+a.signal+'%, '+a.held+' held');
 if(a.exq<0.7) w.push('expression '+Math.round(a.exq*100)+'%');
 if(a.deg) w.push(a.deg+' degenerate pair'+(a.deg>1?'s':''));
 /* This was a figure and three lines of diagnostics, 325 by 140, parked in
    the bottom corner of the stage. A circle inside a rectangle leaves the
    corners free, but not that much of them: the block reached into the wheel
    and the wheel had to give up radius to clear it, which is why the field
    was rendering small. The figure stays on the stage. The three lines move
    into the drill, which is where a person asks for them, and the figure
    becomes a button, because the house rule is that a number on the stage
    has a door. */
 /* and not off the defaults either. A field nobody has entered anything into
    identifies with nothing, and printing a percentage against that is the
    instrument reporting on itself as though it had read somebody. */
 var un=r.unread;
 el.innerHTML='<button type="button" class="acc-b" id="accbtn" '
  +'aria-label="Family identification. How sure the reading is. Opens the detail.">'
  +cr('Crown',un?0:a.pct,{size:'lg',raw:un?'\u2013':a.pct.toFixed(1)+'%',label:'identification'})
  +'<span class="acc-l">Identification</span></button>';
 var bt=document.getElementById('accbtn');
 if(bt)bt.onclick=function(){runAccDrill();};}
/* the detail the stage used to print whether it was asked for or not */
function runAccDrill(){
 var r=compute(), a=accuracy(r), w=[];
 if(a.cov<21) w.push((21-a.cov)+' law'+(21-a.cov===1?'':'s')+' unmeasured, sitting at the default 6');
 if(a.signal<70) w.push('signal '+a.signal+'%, '+a.held+' held');
 if(a.exq<0.7) w.push('expression '+Math.round(a.exq*100)+'%');
 if(a.deg) w.push(a.deg+' degenerate pair'+(a.deg>1?'s':''));
 rdShell('<div class="pm-eye">Family identification</div>'
  +'<div class="ad-nm">'+a.pct.toFixed(1)+'%</div>'
  +'<div class="pm-eye">What it is</div>'
  +'<p class="ad-p">How closely this field matches a named family, and how wide the '
  +'match is. Plus or minus <b>'+a.band.toFixed(1)+'</b> at this reading. A narrow band '
  +'means one family fits and the others do not. A wide one means several fit about as '
  +'well, and the name is a guess.</p>'
  +'<div class="pm-eye">What is limiting it</div>'
  +'<p class="ad-p">'+esc(w.length?w.join('. '):'Laws, signal and expression are all full.')+'</p>'
  +'<div class="pm-eye">How reliable</div>'
  +'<p class="ad-p">'+(a.relN>=0.6?'Reliable':(a.relN>=0.3?'Partial':'Not callable'))
  +'. <b>'+a.rel+'%</b> of the laws are spread three or more, which is what separates one '
  +'family from another. Laws sitting close together name nothing.</p>');}

/* ---- personas ---- */
/* CUSTOM, and a line a person can actually read.

   It said "Set the root, the archetypes, and the nine poled axes. Everything
   else derives." Nobody arriving at this software knows what any of that
   means, and it was the first sentence on the first screen. Three internal
   terms and a claim about derivation, addressed to somebody who has not been
   told what a root is.

   The replacement says what will happen, in the order it happens, using words
   that carry their own meaning. */
PEOPLE.unshift({nm:'You',age:'',role:'custom',dom:0,a1:0,a2:1,
 says:'Nothing has been entered yet. Write what happened, or answer the questions, and this fills in.',
 /* This was 3 on every axis, and it is the persona the app opens on. So a
    stranger's first screen showed Fear 3.0, Anger 3.0, Shame 3.0 and the rest,
    three rows below a panel correctly saying nothing was held. Nobody entered
    those numbers. An empty field is empty. */
 c:{Fear:0,Anger:0,Shame:0,Disgust:0,Apathy:0,Shock:0,Sad:0,Surprise:0,Anticipation:0},
 rep:{Fear:0,Anger:0,Shame:0,Disgust:0,Apathy:0,Shock:0,Sad:0,Surprise:0,Anticipation:0},you:true});
BIRTH.You=null; LAWSET.You={_:6.5};
/* a profile per persona, so switching one never overwrites another's diagnostic.
   the original assigned every persona's seeded answers straight onto CURP. */
var PROF_BY={};
function lawsFor(p){ return p.law || LAWSET[p.nm] || {_:5.5}; }
(function(){var sel=$('psel');
 var mk=function(lab){var g=document.createElement('optgroup');g.label=lab;sel.appendChild(g);return g;};
 var gYou=null,gICP=null,gRef=null;
 PEOPLE.forEach(function(p,i){var o=document.createElement('option');o.value=i;
  o.textContent=p.you?'Custom':(p.nm+', '+p.age+', '+p.role.replace(' · ICP',''));
  if(p.you){gYou=gYou||mk('Your own');gYou.appendChild(o);}
  else if(/ICP/.test(p.role)){gICP=gICP||mk('ICPs');gICP.appendChild(o);}
  else {gRef=gRef||mk('Reference cases');gRef.appendChild(o);}});})();
$('psel').addEventListener('change',function(e){loadP(+e.target.value);});
/* This set the flag and moved the dropdown and left CURP pointing at whichever
   reference case was loaded, so the next save wrote the person's own edit into
   that case's record. It repoints the record without reloading S, because the
   caller is usually midway through a drag and reloading would undo it. */
function toYou(){if(S.who===0)return;S.who=0;$('psel').value='0';
 var own=PROF_BY[PEOPLE[0].nm];
 if(own&&PROFILES.indexOf(own)>=0)CURP=own;
 renderSpirit();}
function saveYou(){if(S.who!==0)return;var Y=PEOPLE[0];
 Y.dom=S.dom;Y.a1=S.a1;Y.a2=S.a2;Y.doms=S.doms.slice();Y.arcs=S.arcs.slice();Y.roots=S.roots.slice();
 CHARGES.forEach(function(c){Y.c[c]=S.charge[c];});
 Y.rep={};CHARGES.forEach(function(c){Y.rep[c]=S.replace[c]||0;});
 /* the original wrote Y.law here and lawsFor could never read it back. */
 Y.law={};SINAMES.forEach(function(l){Y.law[l]=S.law[l];});
 /* And it only ever wrote to the in memory persona, so every charge, law,
    domain and archetype a person set in the tools panel was gone on reload
    unless they happened to open Intake and press Save. It writes through to
    the record too. Debounced, because this fires on every pointer move of a
    slider and a write per frame is a write per frame. */
 persistYou();}
var YOU_T=null;
function persistYou(){
 if(!CURP)return;
 if(YOU_T)clearTimeout(YOU_T);
 YOU_T=setTimeout(persistNow,400);}
/* the write, and the check that it can land. a profile outside the list is
   not reachable by any save, so claiming success would be the lie this
   codebase forbids by name. */
function persistNow(){
 if(YOU_T){clearTimeout(YOU_T); YOU_T=null;}
 if(!CURP)return;
 saveProfile(CURP);
 if(PROFILES.indexOf(CURP)<0){
  status('Not saved. This profile is not in the record list.'); return;}
 if(!pPersist())status('Not saved. '+(saveState().err||'storage refused the write')+'.');}
/* a debounce with no flush loses whatever is in flight when the tab closes,
   and never reports it, because the write never reaches the store at all. */
if(typeof addEventListener==='function')['pagehide','visibilitychange'].forEach(function(ev){
 addEventListener(ev,function(){ if(YOU_T)persistNow(); });});
/* each persona gets a real 63-answer intake derived from the laws they carry,
   so their spread and lean are theirs and not a default. */
function seedIntake(p){
 if(p._seeded)return; p._seeded=1;
 var LS=lawsFor(p), base=(LS._!==undefined)?LS._:5.5, bias=(p.nm||'').length%3;
 p.intakeAnswers={};
 SI.forEach(function(l,li){
  var v=(LS[l.nm]!==undefined)?LS[l.nm]:base;
  /* a weak law splits wide: it holds in one context and fails in another. under
     3 the spread is inside self-report noise, so do not manufacture one. */
  var split=Math.max(0,(9-v))*(0.62+bias*0.30);
  if(v<7) split=Math.max(split,3.4);
  var L=clamp(v+split/2,0,10), R=clamp(v-split/2,0,10), N=clamp(v,0,10);
  if(bias===1){var t=L;L=R;R=t;}
  p.intakeAnswers[li*3]=Math.round(L*10)/10;
  p.intakeAnswers[li*3+1]=Math.round(R*10)/10;
  p.intakeAnswers[li*3+2]=Math.round(N*10)/10;});}
function loadP(i){
 var p=PEOPLE[i]; seedIntake(p); S.who=i; S.pin=null;
 S.dom=p.dom;S.a1=p.a1;S.a2=p.a2;
 S.doms=p.doms?p.doms.slice():[p.dom];
 S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
 S.roots=p.roots?p.roots.slice():[];
 buildSoul();
 CHARGES.forEach(function(c){
  S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 /* THE CUSTOM PERSONA IS NOT A DEMO AND MUST NOT BE GIVEN LAW SCORES.

    lawsFor falls back to {_:5.5} for anybody with no table, and "You" is the
    profile a stranger arrives on, so every one of the twenty one laws was set
    to 5.5: a score nobody entered, on the one profile that is supposed to hold
    nothing. saveProfile then wrote all of them, so measured went to 21 and
    unread went false, which is the flag every surface checks before it agrees
    to print a band, a tier or a reading. Measured on a fresh page: 21 of 21
    laws non null on a profile with zero charge.

    A demo persona keeps its table, because that is what a demo is. The custom
    one is left unmeasured and stays unmeasured until the intake writes a real
    score. */
 var LS=lawsFor(p);
 /* THE CUSTOM PERSONA'S OWN LAWS COME FROM ITS OWN PROFILE, never from CURP.
    This read CURP, and at this point in loadP CURP is still whoever was
    loaded BEFORE this call: it is not repointed until eight lines below. So
    arriving at You from any demo persona copied that persona's twenty one law
    scores into the blank and kept them as measurements. saveProfile then
    persisted them, so it did not wash out on the next render either.

    Measured, both on a fresh page. loadP(0) alone: unread true, measured 0,
    21 laws unset, CQ 42.3 with no tier printed. loadP(14) then loadP(0):
    unread false, measured 21, law mean 9.72, Truth 9.9, CQ 94.2 and the word
    Mastery, off Lance's numbers, on a profile where nobody had entered
    anything. Every guard in the product that checks unread before printing a
    band, a tier or a reading was passing for a stranger.

    This is the second route into the failure FINDINGS-fixed.md already
    recorded once. That fix corrected the seeding and left the ordering, which
    is why it came back wearing a different cause. The target profile is the
    only thing entitled to answer what the target profile has measured. */
 var OWN=PROF_BY[p.nm];
 SINAMES.forEach(function(l){
  var v=(p.you&&OWN&&OWN.laws)?OWN.laws[l]:undefined;
  /* The placeholder is unchanged, so the field geometry is unchanged. What
     changes is only whether it is allowed to persist as a measurement: on the
     custom persona an unmeasured law is seeded and marked, and saveProfile
     leaves a seeded law alone until somebody moves it. A demo persona's table
     IS its measurement, so it is written as before. */
  S.law[l]=(v!=null)?v:((LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5));
  LAW_UNSET[l]=!!(p.you&&v==null);
  LAW_SEED[l]=S.law[l];});
 /* switch profiles, never overwrite one. */
 if(!PROF_BY[p.nm]){
  var pr=blankProfile(p.nm==='You'?'You':p.nm);
  if(p.intakeAnswers)pr.intake.answers=Object.assign({},p.intakeAnswers);
  PROFILES.push(pr); PROF_BY[p.nm]=pr;}
 CURP=PROF_BY[p.nm];
 saveProfile(CURP); iqApply(CURP);
 $('psel').value=String(i);
 syncSoul();syncCh();syncLw();renderSpirit();renderIntake();render();}

/* ---- release button ---- */
var REL=null;
$('bRel').addEventListener('click',function(){
 var hot=W.filter(function(n){return n.sq>=4;}).sort(function(a,b){return b.sq-a.sq;});
 if(hot.length){relPick(hot.slice(0,8).map(function(n){return n.i;}));return;}
 /* THIS IS WHERE THE REWARD CURVE ENDED. The queue was built at the sq 4 line
    only, so the control refused the moment nothing was stacked that high, and
    the core loop of the product had exactly two runs in it.

    Measured on James, through this control. Run one +4.04 CQ, run two +1.80,
    run three refused. He is left at CQ 18.6, tier Severe, the worst band but
    one, with 72 addresses still carrying, and the product tells him there is
    nothing to release. Three of the six ICPs never get past this line even on
    their first visit, because their load was never stacked above it.

    Below the line there is still ground, so the control takes it. The queue is
    the heaviest addresses actually holding something. The release run already
    handles them: it frees weight proportional to what is there, so the returns
    fall away honestly as the field empties instead of stopping at a cliff. */
 var warm=W.filter(function(n){return n.sq>0;}).sort(function(a,b){return b.sq-a.sq;});
 if(warm.length){relPick(warm.slice(0,8).map(function(n){return n.i;}));return;}
 /* Nothing is held, so there is nothing to release. This used to run a 2.8
    second animation that zeroed every charge and raised every law toward ten,
    on one click, with no confirmation and no undo. It was written as a
    demonstration of the mechanism and a person cannot tell a demonstration
    from the real thing: the numbers simply changed and there was no way back.
    A control must never claim to have done something it has not done, and it
    must never do something destructive it was not asked to do. */
 status('Nothing is held above the line, so there is nothing to release. '
  +'Write a story or set a charge first.','warn');});
function stepRel(now){
 if(!REL)return;
 var k=Math.min(1,(now-REL.t0)/2800), e=1-Math.pow(1-k,3);
 CHARGES.forEach(function(c){S.charge[c]=REL.c[c]*(1-e);
  S.replace[c]=(S.replace[c]||0)+Math.max(0,(e-0.45)/0.55)*(REL.c[c]/10)*8*0.04;});
 SINAMES.forEach(function(x){S.law[x]=REL.l[x]+(10-REL.l[x])*e*.55;});
 syncCh();syncLw();render();if(k>=1)REL=null;}
