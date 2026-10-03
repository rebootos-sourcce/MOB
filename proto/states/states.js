/* ============================================================
   STATES, REDRAWN. Prototype, round DK, 26 September.

   Laid over the committed build by proto/states/build.js. Nothing under
   atuned_src/ is touched. This file replaces one function, renderSpirit,
   which the product already calls on every render and on every change of
   profile, and every answer it opens is written through the product's own
   rdShell into the product's own Selection panel on the right, the same
   place every other drill in the product lands.

   His ask: "I need iconography, for the symbols, like clean it up, just like
   the left hand side, I don't want a wall of text, I want symbolic icons, I
   want very simple, if I click on something I want to get information on it
   on the right hand side, I want to see how these all influence each other
   and how they stack."

   The left hand side he means is the icon grid directly above this section:
   square .ib tiles on the sunk ground, a ring icon at the middle, a gold ring
   when pressed. The tiles below are those tiles, with their own classes.
   ============================================================ */
(function(){
'use strict';
var PROTO={names:true, notime:false, cur:null};
window.STATES=PROTO;
function ic(p,cls){return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'>'+p+'</svg>';}
function e_(s){return typeof esc==='function'?esc(s):String(s==null?'':s);}
/* the element colour is the product's own: element to root, root to colour,
   the same chain the sun drill already reads "This element maps to the
   Weaver root" off. The year is counted on another wheel, so it wears none. */
function elCol(el){var r=el&&ELEM2ROOT[el]; return r&&ROOTCOL[r]?ROOTCOL[r]:'var(--mid)';}
function layerIcon(l){
 if(l.open)return ST_IC.pos[l.k];
 return l.k==='year'?ST_IC.animal[l.animal]:ST_IC.sign[l.sign];}
function layerVal(l){return l.open?'not read yet':l.k==='year'?l.nm:l.sign;}

/* ---- the reading, off the engine, with one guard the engine lacks ----
   An untimed birth still gets a moon from the engine, taken at one moment of
   a day the moon can change sign in. Measured over the thirteen reference
   dates: six of them hold two moons, and for three the untimed reading is
   the wrong one. So where midnight and the last minute of the day disagree,
   the prototype reads the moon as not read yet. This belongs in the engine,
   and is reported rather than patched there. */
function birthOf(){
 var p=PEOPLE[S.who]||PEOPLE[0], bt=BIRTH[p.nm];
 if(!bt&&CURP&&CURP.who&&CURP.who.born&&CURP.who.born.date){var bn=CURP.who.born;
  bt={d:bn.date,t:(bn.timeUnknown?'':(bn.time||'')),p:bn.place||'',z:bn.zone||''};}
 if(!bt)return null;
 bt=Object.assign({},bt); if(PROTO.notime)bt.t='';
 return bt;}
function readOf(bt){
 if(!bt)return null;
 var e=spiritualOf(bt); if(!e)return null;
 if(e.needsTime&&e.moon){
  var a=spiritualOf(Object.assign({},bt,{t:'00:00'})).moon, z=spiritualOf(Object.assign({},bt,{t:'23:59'})).moon;
  if(a!==z){e=Object.assign({},e,{moon:null,moonEl:null,moonTwo:[a,z]});}}
 return e;}

/* ---- the little stack. four outlined bars, ground at the bottom. ----
   Where a joint slips the bar above it moves sideways, which is what a shear
   is. The arc on the right closes the loop from the body back to the voice
   inside. Outlined, never filled, because icons here are ring. */
var SHIFT={flush:0,braced:0,offset:1,shear:2.4,open:0};
function stackSVG(R,big){
 var J={}; R.joints.forEach(function(j){J[j.key]=j.kind;});
 var bw=big?84:32.6, bh=big?14:5.5, gap=big?48:11.6, x0=big?58:4, top=big?10:4;
 var step=big?7:3.2;
 var ys={sun:top, rising:top+gap, moon:top+gap*2, year:top+gap*3};
 var sh={year:0}; sh.moon=SHIFT[J.ground]*step;
 sh.rising=sh.moon+SHIFT[J['moon>rising']]*step; sh.sun=sh.rising+SHIFT[J['rising>sun']]*step;
 var W=big?262:64, H=ys.year+bh+(big?8:3);
 var o='<svg class="st-fig'+(big?' big':'')+'" viewBox="0 0 '+W+' '+H+'" aria-hidden="true">';
 function bar(k){var l=R.L[k], wide=k==='year'?(big?30:13):0;
  var x=x0+sh[k]-(big?0:wide/2), c=l.open?'var(--edge-2)':k==='year'?'var(--mid)':elCol(l.el);
  return '<rect x="'+x.toFixed(1)+'" y="'+ys[k]+'" width="'+(bw+wide).toFixed(1)+'" height="'+bh
   +'" rx="'+(bh/2)+'" style="stroke:'+c+'"'+(l.open?' stroke-dasharray="3 3"':'')+'/>';}
 function joint(key,lo,hi){var kind=J[key]; if(!kind||kind==='open')return '';
  var y1=ys[hi]+bh, y2=ys[lo], xm=x0+sh[lo]+bw/2, s='';
  if(kind==='flush')s='<path class="j-flush" d="M'+(x0+sh[lo]+bh/2)+' '+y1+'V'+y2+'M'+(x0+sh[lo]+bw-bh/2)+' '+y1+'V'+y2+'"/>';
  if(kind==='braced')s='<path class="j-braced" d="M'+xm+' '+y1+'V'+y2+'"/>';
  if(kind==='offset')s='<path class="j-offset" d="M'+(xm+step*0.5)+' '+y1+'V'+y2+'"/>';
  if(kind==='shear'){var ym=(y1+y2)/2, a=big?5:1.8;
   s='<path class="j-shear" d="M'+(xm-a*2)+' '+ym+'l'+a+' '+(-a)+' '+a+' '+(a*2)+' '+a+' '+(-a*2)+' '+a+' '+a+'"/>';}
  if(big)s+='<text class="j-t j-'+kind+'" x="'+(x0-8)+'" y="'+((y1+y2)/2+4)+'" text-anchor="end">'+kind+'</text>';
  return s;}
 o+=joint('ground','year','moon')+joint('moon>rising','moon','rising')+joint('rising>sun','rising','sun');
 /* the loop, sun back to moon, round the right hand side */
 var k=J['sun>moon'];
 if(k&&k!=='open'){var xs=x0+sh.sun+bw+(big?6:1.5), xm2=x0+sh.moon+bw+(big?6:1.5), r=big?30:12;
  var yS=ys.sun+bh/2, yM=ys.moon+bh/2, xr=Math.max(xs,xm2)+r*0.6;
  o+='<path class="j-loop j-'+k+'" d="M'+xs+' '+yS+'C'+xr+' '+yS+' '+xr+' '+yM+' '+xm2+' '+yM+'"'
   +(k==='shear'?' stroke-dasharray="'+(big?'5 4':'2 2')+'"':'')+'/>';
  if(big)o+='<text class="j-t j-'+k+'" x="'+(xr+6)+'" y="'+((yS+yM)/2+4)+'">'+k+'</text>';}
 ['year','moon','rising','sun'].forEach(function(q){o+=bar(q);});
 if(big)['sun','rising','moon','year'].forEach(function(q){
  var l=R.L[q], y=ys[q]+bh/2;
  o+='<text class="st-lab" x="4" y="'+(y+4)+'">'+ST_POS[q].nm+'</text>';});
 return o+'</svg>';}

/* ---------------- the rail ---------------- */
function tile(k,l,extra){
 var c=l.open?'var(--dim)':k==='year'?'var(--ink)':elCol(l.el);
 return '<div class="st-cell"><button type="button" class="ib st-ib'+(l.open?' open':'')+'" data-st="'+k+'"'
  +' aria-pressed="'+(PROTO.cur===k?'true':'false')+'" style="--c:'+c+'"'
  +' title="'+e_(ST_POS[k].nm+', '+layerVal(l)+'. '+ST_POS[k].def)+'"'
  +' aria-label="'+e_(ST_POS[k].nm+', '+layerVal(l))+'">'
  +ic(layerIcon(l))+(l.open?'':'<span class="st-pos">'+ic(ST_IC.pos[k])+'</span>')+'</button>'
  +(PROTO.names?'<span class="st-k">'+ST_POS[k].nm+'</span><span class="st-v">'+e_(layerVal(l))+'</span>':'')
  +(extra||'')+'</div>';}
function small(key,glyph,k,v,t){
 return '<div class="st-cell"><button type="button" class="ib st-ib st-sm" data-st="'+key+'"'
  +' aria-pressed="'+(PROTO.cur===key?'true':'false')+'" title="'+e_(t)+'" aria-label="'+e_(k+', '+v)+'">'
  +glyph+'</button>'
  +(PROTO.names?'<span class="st-k">'+k+'</span><span class="st-v">'+e_(v)+'</span>':'')+'</div>';}
function chrome(){
 return '<div class="st-proto"><div class="st-proto-h">Prototype only</div>'
  +'<div class="st-proto-r"><span>Names</span><div class="seg st-seg">'
  +'<button type="button" data-pn="1" aria-pressed="'+PROTO.names+'">Shown</button>'
  +'<button type="button" data-pn="0" aria-pressed="'+!PROTO.names+'">Hidden</button></div></div>'
  +'<div class="st-proto-r"><span>Time</span><div class="seg st-seg">'
  +'<button type="button" data-pt="0" aria-pressed="'+!PROTO.notime+'">As entered</button>'
  +'<button type="button" data-pt="1" aria-pressed="'+PROTO.notime+'">Removed</button></div></div></div>';}
function renderStates(){
 var el=document.getElementById('spirit'); if(!el)return;
 var bt=birthOf(), e=readOf(bt);
 if(!e){
  /* the empty state keeps the product's own sentence and door, and shows the
     four places the reading will land, so what is missing is visible */
  el.innerHTML='<div class="st-four">'
   +['sun','moon','rising','year'].map(function(k){return tile(k,{k:k,open:true});}).join('')+'</div>'
   +'<div class="sp-none">No birth data. Date, time and place unlock sun, moon, '
   +'rising, the year animal, life path and the gene key.</div>'
   +'<button class="btn" type="button" id="spgo">Open Energetics</button>'+chrome();
  document.getElementById('spgo').onclick=goIntake;
  el.querySelectorAll('.st-ib').forEach(function(b){b.onclick=function(){openLayer(b.getAttribute('data-st'),null);};});
  wireChrome(el); return;}
 var R=readStack(e,ZSIGN); PROTO.R=R; PROTO.e=e;
 var h='<div class="st-four">'+['sun','moon','rising','year'].map(function(k){return tile(k,R.L[k]);}).join('')+'</div>';
 h+='<button type="button" class="st-stack" data-st="stack" aria-pressed="'+(PROTO.cur==='stack')+'"'
  +' title="How the four stack, and where they shear">'
  +stackSVG(R,false)+'<span class="st-stack-t"><span class="st-k">Stack</span>'
  +'<span class="st-v">'+e_(R.rail)+'</span></span></button>';
 var lp=e.lp, hd=e.hd||{}, gk=e.gk||{};
 h+='<div class="st-four st-row2">'
  +small('lp','<span class="st-num">'+lp+'</span>','Path',String(lp),'Life path. '+(LP_RUNS[lp]||''))
  +(hd.profile?small('hd',ic(ST_IC.hd),'Profile',hd.profile,'Personality line over design line')
    :small('hd',ic(ST_IC.hd),'Profile','not read yet','Needs a time zone the instrument can read'))
  +(gk.gate!=null?small('gk',ic(ST_IC.gk),'Gene key',gk.gate+'.'+gk.line,'The gate the sun occupied')
    :small('gk',ic(ST_IC.gk),'Gene key','not read yet','Needs a time zone the instrument can read'))
  +'</div>';
 el.innerHTML=h+chrome();
 el.querySelectorAll('[data-st]').forEach(function(b){b.onclick=function(){press(b.getAttribute('data-st'));};});
 wireChrome(el);}
function wireChrome(el){
 el.querySelectorAll('[data-pn]').forEach(function(b){b.onclick=function(){
  PROTO.names=b.getAttribute('data-pn')==='1'; renderStates();};});
 el.querySelectorAll('[data-pt]').forEach(function(b){b.onclick=function(){
  PROTO.notime=b.getAttribute('data-pt')==='1'; renderStates();
  if(PROTO.cur)press(PROTO.cur,true);};});}
function mark(k){PROTO.cur=k;
 document.querySelectorAll('#spirit [data-st]').forEach(function(b){
  b.setAttribute('aria-pressed',b.getAttribute('data-st')===k?'true':'false');});}
function goIntake(){setTab(TAB.INTAKE);requestAnimationFrame(function(){var d=document.getElementById('wdate');if(d)d.focus();});}
function press(k,quiet){
 var R=PROTO.R, e=PROTO.e; mark(k);
 if(k==='stack')return openStack(R,e,false);
 if(k==='lp')return runSpDrill('lp',String(e.lp));
 if(k==='gk')return e.gk&&e.gk.gate!=null?runSpDrill('gk',e.gk.gate+'.'+e.gk.line):openRefuse('Gene key',e);
 if(k==='hd')return openProfile(e);
 openLayer(k,R);}

/* ---------------- the right hand side ----------------
   Every card goes through rdShell, so it has the product's own back control,
   its own close, its own escape, and it lands where every other drill does. */
function relRow(a,b){
 var kind=a.k==='year'||b.k==='year'
  ?((a.k==='year'?a:b).push===(a.k==='year'?b:a).push?'braced':'offset'):stJoint(a,b);
 var say=a.k==='year'||b.k==='year'
  ?stCap(ST_POL[a.k][a.push])+', and '+ST_POL[b.k][b.push]+'.':stPair(a,b);
 return '<button type="button" class="st-rel" data-go="'+b.k+'">'
  +'<span class="st-rel-g" style="--c:'+(b.k==='year'?'var(--ink)':elCol(b.el))+'">'+ic(layerIcon(b))+'</span>'
  +'<span class="st-rel-t"><span class="st-rel-h">'+ST_POS[b.k].nm+', '+e_(b.k==='year'?stLow(layerVal(b)):layerVal(b))
  +' <em class="j-'+kind+'">'+kind+'</em></span>'
  +'<span class="st-rel-p">'+e_(say)+'</span></span></button>';}
function openLayer(k,R){
 var l=R?R.L[k]:{k:k,open:true};
 if(l.open)return openRefuse(ST_POS[k].nm,PROTO.e,k);
 var h='<div class="pm-eye">'+ST_POS[k].nm+'</div>'
  +'<div class="ad-nm st-nm"><span class="st-nm-g" style="--c:'+(k==='year'?'var(--ink)':elCol(l.el))+'">'
  +ic(layerIcon(l))+'</span>'+e_(layerVal(l))+'</div>'
  +'<div class="ad-sub">'+(k==='year'?((l.yang?'yang ':'yin ')+l.el+', '+(l.push?'pushes':'holds'))
   :(l.el+', '+l.mode+', '+(l.push?'pushes':'holds')))+'</div>'
  +'<div class="pm-eye">What it is</div><p class="ad-p">'+ST_POS[k].def+'</p>'
  +'<div class="pm-eye">How it runs through you</div>'
  +(k==='year'?'<p class="ad-p">'+ST_ANIMAL[l.animal]+'</p><p class="ad-p">'+ST_CELEM[l.celem]+'</p>'
   :'<p class="ad-p">'+l.line+'</p>');
 var others=ST_ORDER.filter(function(q){return q!==k&&!R.L[q].open;});
 if(others.length)h+='<div class="pm-eye">Against the other three</div><div class="st-rels">'
  +others.map(function(q){return relRow(l,R.L[q]);}).join('')+'</div>';
 if(k==='sun'){var rootNow=(DOMAINS[S.doms[0]]||{}).r||'', maps=ELEM2ROOT[l.el];
  if(maps)h+='<div class="pm-eye">Against your field</div><p class="ad-p">This element maps to the <b>'
   +maps+'</b> root. You currently run <b>'+rootNow+'</b>. '+(maps===rootNow?'They agree.'
   :'They do not, which means something was installed on top of the blueprint.')+'</p>';}
 h+='<button class="btn st-open" type="button" id="stgo">Open the stack</button>';
 rdShell(h);
 wireCard();}
function openRefuse(nm,e,k){
 var why=!e?'No birth data is on file.'
  :(k==='moon'&&e.moonTwo)?'The moon moved from '+e.moonTwo[0]+' to '+e.moonTwo[1]+' on that day, and without a birth time there is no telling which.'
  :e.needsTime?'It needs a birth time.':e.needsZone?'It needs a birth time zone.'
  :'It needs a birthplace the instrument can locate.';
 rdShell('<div class="pm-eye">'+e_(nm)+'</div><div class="ad-nm">not read yet</div>'
  +(k&&ST_POS[k]?'<div class="pm-eye">What it is</div><p class="ad-p">'+ST_POS[k].def+'</p>':'')
  +'<p class="ad-p">'+e_(why)+' Date, time and place are asked on Energetics.</p>'
  +'<button class="btn" type="button" id="stin">Open Energetics</button>');
 var b=document.getElementById('stin'); if(b)b.onclick=goIntake;}
function openProfile(e){
 var hd=e.hd||{};
 if(!hd.profile)return openRefuse('Profile',e);
 rdShell('<div class="pm-eye">Profile</div><div class="ad-nm">'+e_(hd.profile)+'</div>'
  +'<div class="ad-sub">personality line over design line</div>'
  +'<div class="pm-eye">What it is</div><p class="ad-p">The line of the gate the sun sat in at birth, over '
  +'the line of the gate it sat in 88 degrees earlier. Personality gate <b>'+hd.personality.gate+'.'
  +hd.personality.line+'</b>, design gate <b>'+hd.design.gate+'.'+hd.design.line+'</b>.</p>'
  +'<p class="ad-p">The type is not read yet. It needs the full bodygraph, which the instrument does not build.</p>');}
function openStack(R,e,combo){
 var L=R.L, h='<div class="pm-eye">Stack</div>'
  +'<div class="st-glyphs">'+['year','moon','rising','sun'].map(function(k){var l=L[k];
   return '<span style="--c:'+(l.open?'var(--dim)':k==='year'?'var(--ink)':elCol(l.el))+'">'+ic(layerIcon(l))+'</span>';}).join('')+'</div>'
  +'<p class="st-head">'+e_(R.head)+'</p>'
  +stackSVG(R,true)
  +'<div class="pm-eye">How it runs through you</div>';
 ['year','moon','rising','sun'].forEach(function(k){var l=L[k];
  h+='<p class="ad-p st-line"><b>'+ST_POS[k].nm+', '+e_(k==='year'?stLow(l.nm||''):(l.sign||'not read yet'))+'.</b> '
   +(l.open?'':e_(l.line))+'</p>';});
 if(R.ground)h+='<div class="pm-eye">Ground</div><p class="ad-p">'+e_(R.ground)+'</p>';
 h+='<div class="pm-eye">Where it shears</div>'
  +(R.seams.length?R.seams.map(function(s){return '<p class="ad-p st-seam">'+e_(s.say)+'</p>';}).join('')
   :'<p class="ad-p">'+(R.limit?'Nothing that was read shears.':ST_CLEAN)+'</p>');
 if(R.weight)h+='<div class="pm-eye">Weight</div><p class="ad-p">'+e_(R.weight)+'</p>';
 /* against the field: the product's own convergence, where it can run */
 if(!combo&&typeof converge==='function'){
  var nm=(PEOPLE[S.who]||{}).nm, C=null; try{C=BIRTH[nm]?converge(nm,compute()):null;}catch(x){C=null;}
  if(C&&(C.agree.length||C.differ.length))h+='<div class="pm-eye">Against your field</div>'
   +C.agree.map(function(a){return '<div class="s-ag">'+e_(a)+'</div>';}).join('')
   +C.differ.map(function(d){return '<div class="s-dg">'+e_(d)+'</div>';}).join('');}
 if(R.limit)h+='<p class="ad-p st-limit">'+e_(R.limit)+'</p>';
 h+='<div class="pm-eye">How the stack is read</div><p class="ad-p st-def">'+ST_METHOD+'</p>'
  +'<div class="st-joints">'+['flush','braced','offset','shear'].map(function(k){
   return '<p class="st-def"><em class="j-'+k+'">'+k+'</em> '+ST_JOINT[k].replace(/^[A-Z][a-z]+\. /,'')+'</p>';}).join('')+'</div>';
 if(!combo&&e&&e.birth)h+='<p class="st-src">Read off '+e_(e.birth.d)+(e.birth.t?' at '+e_(e.birth.t):', no time')
  +(e.birth.p?', '+e_(e.birth.p):'')+'.</p>';
 h+=comboBox(R);
 rdShell(h);
 wireCard(); wireCombo();}

/* ---- prototype only: dial in any combination, his own included ---- */
var ANIMALS=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
var ELEMS=['Wood','Fire','Earth','Metal','Water'];
function sel(id,opts,v){return '<select class="st-sel" id="'+id+'">'+opts.map(function(o){
 return '<option'+(o===v?' selected':'')+'>'+o+'</option>';}).join('')+'</select>';}
function comboBox(R){
 var L=R.L;
 return '<div class="st-combo"><div class="st-proto-h">Prototype only. Read any combination</div>'
  +'<div class="st-combo-g">'
  +'<label>Sun'+sel('cb-sun',ST_WHEEL,L.sun.sign||'Aries')+'</label>'
  +'<label>Moon'+sel('cb-moon',ST_WHEEL,L.moon.sign||'Aries')+'</label>'
  +'<label>Rising'+sel('cb-rising',ST_WHEEL,L.rising.sign||'Aries')+'</label>'
  +'<label>Animal'+sel('cb-an',ANIMALS,L.year.animal||'Rat')+'</label>'
  +'<label>Element'+sel('cb-el',ELEMS,L.year.celem||'Water')+'</label>'
  +'</div>'
  +'<div class="st-combo-b"><button class="btn" type="button" id="cb-go">Read</button>'
  +'<button class="btn" type="button" data-pre="Water,Rat">Water rat</button>'
  +'<button class="btn" type="button" data-pre="Fire,Horse">Fire horse</button></div></div>';}
function wireCombo(){
 var go=document.getElementById('cb-go'); if(!go)return;
 function v(id){return document.getElementById(id).value;}
 function read(){
  var e={sun:v('cb-sun'),moon:v('cb-moon'),rising:v('cb-rising'),chinese:v('cb-an'),celem:v('cb-el'),
   /* the animal fixes yin or yang: rat, tiger, dragon, horse, monkey, dog are yang */
   cyear:ANIMALS.indexOf(v('cb-an'))%2};
  openStack(readStack(e,ZSIGN),e,true);}
 go.onclick=read;
 document.querySelectorAll('[data-pre]').forEach(function(b){b.onclick=function(){
  var p=b.getAttribute('data-pre').split(',');
  document.getElementById('cb-el').value=p[0]; document.getElementById('cb-an').value=p[1]; read();};});}
function wireCard(){
 var g=document.getElementById('stgo'); if(g)g.onclick=function(){press('stack');};
 document.querySelectorAll('#rdrill .st-rel[data-go]').forEach(function(b){
  b.onclick=function(){press(b.getAttribute('data-go'));};});}

/* the product calls renderSpirit by name, on every render and every change
   of profile, so this is the one seam */
window.renderSpirit=renderStates;
window.stReadOf=readOf;
})();
