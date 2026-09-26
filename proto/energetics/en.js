/* ============================================================
   ENERGETICS, FOUR WAYS. Prototype, round DM, 26 September.

   Laid over the committed build by proto/energetics/build.js. Nothing under
   atuned_src/ is touched. One seam: the product calls renderIntake by name,
   so this replaces it, and every reading it prints is read live off the
   engine by enRead() in read.js.

   His ask, in his words: on landing on Energetics he does not need the left
   rail as it stands. As the names and the birth time go in, the root meaning
   of the name, "a starting point a person naturally embodies". Myers Briggs
   read as data on determined patterns. The masculine and feminine slider as
   "two channels of one vehicle". The left rail activating as the questions
   are answered. A page summing up everything Energetics holds. Source AI on
   the right, updating live. And four treatments, from minimal to icon heavy
   to a staged unlock.

     a  Quiet     no rail. each field reads itself on the line under it.
     b  Tiles     the rail becomes tiles that light as the fields fill.
     c  Staged    one question at a time. each answer opens named tiles.
     d  Portrait  the form moves to the rail. the centre is the essence page.

   The 63 law questions are the product's own, untouched, behind one row in
   all four, so the four are compared on the part he asked about.
   ============================================================ */
(function(){
'use strict';
var ORIG=window.renderIntake;
var VN={a:'Quiet',b:'Tiles',c:'Staged',d:'Portrait'};
function e_(s){return esc(s==null?'':String(s));}
function ic(p){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';}
function narrow(){return window.matchMedia('(max-width:1180px)').matches;}
var IC={
 name:'<path d="M5 19V5h3l8 11V5h3v14h-3L8 8v11z"/>',
 root:'<path d="M12 3v9M12 12c-3 0-5 2-6 6M12 12c3 0 5 2 6 6M12 12v9"/>',
 sky:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="1.6"/>',
 pat:'<path d="M4 7h16M4 12h10M4 17h13"/>',
 chan:'<path d="M4 8h16M4 16h16M8 4v16M16 4v16"/>',
 arch:ARCH[0].ic, carry:'<path d="M12 20s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11z"/>',
 lock:'<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 016 0v3"/>',
 ai:'<circle cx="12" cy="12" r="8.5"/><path d="M8 12h8M12 8v8"/>',
 ess:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/>'};
var NUMK=['lifePath','expression','soul','personality','birthday','maturity'];
var NUML={lifePath:'Path',expression:'Expression',soul:'Soul',personality:'Persona',birthday:'Birthday',maturity:'Maturity'};
var NUMNEED={lifePath:'date of birth',birthday:'date of birth',maturity:'name and date of birth',
 expression:'name',soul:'name',personality:'name'};
var SKY=['sun','moon','rising','year'];
function elCol(el){var r=el&&ELEM2ROOT[el]; return r&&ROOTCOL[r]?ROOTCOL[r]:'var(--mid)';}

/* ================= the questions ================= */
/* the nine child emotion questions, the first funnel item per axis */
var ENQ=CHARGES.map(function(c){
 var q=(typeof EN_QQ!=='undefined'?EN_QQ:[]).filter(function(x){return x.c===c;})[0];
 return {c:c,q:q?q.q:''};});

/* ================= reading keys, and what each needs ================= */
function numVal(R,k){
 if(!R.num&&k!=='lifePath'&&k!=='birthday')return null;
 if(k==='lifePath')return R.born?R.born.lp:null;
 if(k==='birthday')return R.born?+R.born.date.split('-')[2]:null;
 var v=R.num?R.num[k]:null; return v==null?null:v;}
function skyL(R,k){return R.sky?R.sky.R.L[k]:null;}
function sigs(R){
 var s={};
 for(var i=0;i<3;i++){var n=R.names.filter(function(x){return x.role===['first','middle','last'][i];})[0];
  s['n'+i]=n?n.typed+'|'+n.v:'';}
 NUMK.forEach(function(k){var v=numVal(R,k);s[k]=v==null?'':String(v);});
 SKY.forEach(function(k){var l=skyL(R,k);s[k]=l&&!l.open?(l.sign||l.nm||''):'';});
 for(var j=0;j<4;j++)s['p'+j]=R.pattern?R.pattern.letters[j].l:'';
 s.out=R.channels.read?R.channels.out.toFixed(1):''; s['in']=R.channels.read?R.channels['in'].toFixed(1):'';
 s.a1=R.arch?R.arch.first.nm:''; s.a2=R.arch&&R.arch.second?R.arch.second.nm:'';
 CHARGES.forEach(function(c){s['c:'+c]=EN.ans[c]!=null?String(EN.ans[c]):'';});
 return s;}

/* ================= a tile ================= */
function tileOf(R,key){
 var o={key:key,open:true,lab:'',val:'not read yet',inner:'',c:'var(--mid)',title:''};
 if(/^n\d$/.test(key)){var role=['first','middle','last'][+key[1]];
  var n=R.names.filter(function(x){return x.role===role;})[0];
  o.lab=['First','Middle','Last'][+key[1]];
  if(n){o.open=false;o.inner='<span class="en-num">'+n.v+'</span>';o.val=n.root?n.root.root:n.typed;
   o.c='var(--accent)';o.title=n.typed+'. '+(n.root?'Root: '+n.root.root+'. ':'No root on file. ')+'Number '+n.v+'.';}
  else{o.inner=ic(IC.name);o.title=o.lab+' name. Not read yet.';}
  return o;}
 if(NUMK.indexOf(key)>=0){var v=numVal(R,key);o.lab=NUML[key];
  if(v!=null){o.open=false;o.inner='<span class="en-num">'+v+'</span>';o.val='';o.c='var(--gold)';
   o.title=NUM_LABEL[key]+' '+v+'. '+(NUM_CORE[v]||{}).n;}
  else{o.inner='<span class="en-num dim">–</span>';o.title=NUM_LABEL[key]+'. Needs your '+NUMNEED[key]+'.';}
  return o;}
 if(SKY.indexOf(key)>=0){var l=skyL(R,key);o.lab=ST_POS[key].nm;
  if(l&&!l.open){o.open=false;o.inner=ic(key==='year'?ST_IC.animal[l.animal]:ST_IC.sign[l.sign]);
   o.val=key==='year'?l.nm:l.sign;o.c=key==='year'?'var(--ink)':elCol(l.el);o.title=ST_POS[key].nm+', '+o.val+'.';}
  else{o.inner=ic(ST_IC.pos[key]);o.title=ST_POS[key].nm+'. Not read yet.';}
  return o;}
 if(/^p\d$/.test(key)){var j=+key[1], P=R.pattern;
  o.lab=['Discharge','Attention','Decision','Closure'][j];
  if(P){var L=P.letters[j];o.open=false;o.inner='<span class="en-num let">'+L.l+'</span>';o.val=EN_POLE_NM[L.l];
   o.c='var(--mid)';o.title=L.ax+'. '+L.say;}
  else{o.inner='<span class="en-num dim">–</span>';o.title=o.lab+'. Needs your four letter type.';}
  return o;}
 if(key==='out'||key==='in'){var C=R.channels, out=key==='out';
  o.lab=out?'Outward':'Inward';
  o.c=out?seatCol('Solar'):seatCol('Throat');
  if(C.read){o.open=false;var m=out?C.out:C['in'];
   o.inner=ic(out?GLYPH_M:GLYPH_F)+'<span class="en-bar"><i style="width:'+Math.min(100,m*10).toFixed(0)+'%"></i></span>';
   o.val=(C.dir===(out?'outward':'inward'))?'carries more':C.dir==='even'?'even':'carries less';
   o.title=(out?'Outward channel, masculine. ':'Inward channel, feminine. ')+o.val+'.';}
  else{o.inner=ic(out?GLYPH_M:GLYPH_F);o.title=o.lab+' channel. Not read yet.';}
  return o;}
 if(key==='a1'||key==='a2'){var A=R.arch, a=A?(key==='a1'?A.first:A.second):null;
  o.lab=key==='a1'?'First':'Second';
  if(a){o.open=false;o.inner=ic('<path d="'+a.ic+'"/>');o.val=a.nm;o.c=seatCol(a.b);o.title=a.nm+'. '+a.v+'.';}
  else{o.inner=ic('<path d="'+ARCH[0].ic+'"/>');o.title='Archetype. Not answered yet.';}
  return o;}
 if(key.indexOf('c:')===0){var c=key.slice(2), ch=CHILD.filter(function(x){return x.nm===c;})[0];
  o.lab=c;
  o.inner=ic('<path d="'+ch.ic+'"/>');o.c=seatCol(ch.seat);
  if(EN.ans[c]!=null){o.open=false;o.val=EN_SCALE[EN.ans[c]].toLowerCase();o.title=c+', '+o.val+'. Held at the '+ch.loc+'.';}
  else{o.val='';o.title=c+'. Not answered yet.';}
  return o;}
 return o;}
function tile(R,key,small){
 var o=tileOf(R,key), fresh=EN.fresh[key];
 return '<div class="en-cell'+(small?' sm':'')+'"><button type="button" class="ib en-ib'+(o.open?' open':'')+(fresh?' fresh':'')
  +'" data-en="'+key+'" style="--c:'+o.c+'" aria-label="'+e_(o.title)+'">'+o.inner+'</button>'
  +'<span class="en-k">'+e_(o.lab)+'</span>'+(small?'':'<span class="en-v">'+e_(o.val)+'</span>')+'</div>';}
var GROUPS=[
 {k:'name',nm:'Name',keys:['n0','n1','n2'],cols:3},
 {k:'num',nm:'Numbers',keys:NUMK,cols:3},
 {k:'sky',nm:'Sky',keys:SKY,cols:4},
 {k:'pat',nm:'Pattern',keys:['p0','p1','p2','p3'],cols:4},
 {k:'chan',nm:'Channels',keys:['out','in'],cols:2},
 {k:'arch',nm:'Archetype',keys:['a1','a2'],cols:2},
 {k:'carry',nm:'What you carry',keys:CHARGES.map(function(c){return 'c:'+c;}),cols:3,small:true}];
/* which staged step opens which group, for the locked rail */
var OPENS={name:0,num:2,sky:3,pat:6,chan:8,arch:7,carry:8};
function tilesHTML(R,locked){
 return GROUPS.map(function(g){
  var lit=g.keys.some(function(k){return !tileOf(R,k).open;});
  var lk=locked&&!lit&&EN.step<OPENS[g.k];
  return '<section class="en-grp'+(lk?' locked':'')+'" data-grp="'+g.k+'"><div class="en-gh">'
   +(lk?'<span class="en-lk">'+ic(IC.lock)+'</span>':'')+e_(g.nm)
   +(lk?'<span class="en-gn">opens at '+e_(STEPS[OPENS[g.k]].short)+'</span>':'')+'</div>'
   /* a locked group is its name and what opens it, and nothing to press:
      what has not been reached yet is fog, not thirty dead buttons */
   +(lk?'':'<div class="en-tg c'+g.cols+'">'+g.keys.map(function(k){return tile(R,k,g.small);}).join('')+'</div>')+'</section>';}).join('')
  +'<button type="button" class="btn en-essb" data-en="essence">'+ic(IC.ess)+'<span>Essence</span></button>';}

/* ================= the fields ================= */
function wv(k){var w=CURP.who||{}, bn=w.born||{};
 return ({first:w.first,middle:w.middle,last:w.last,sex:w.sex,date:bn.date,time:bn.time,place:bn.place,zone:bn.zone})[k]||'';}
function field(k,label,opts){
 opts=opts||{}; var id='en-'+k, v=wv(k);
 var inp;
 if(k==='sex')inp='<select id="'+id+'" data-f="sex">'+[['','not said'],['f','Female'],['m','Male'],['o','Other']].map(function(o){
  return '<option value="'+o[0]+'"'+(v===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select>';
 else if(k==='type')inp='<select id="'+id+'" data-f="type"><option value="">not said</option>'+TYPE16.map(function(t){
  return '<option'+(CURP.seed&&CURP.seed.type===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select>';
 else inp='<input id="'+id+'" data-f="'+k+'" type="'+(k==='date'?'date':k==='time'?'time':'text')+'"'
  +(k==='zone'?' list="wzones" placeholder="Region/City" autocomplete="off" spellcheck="false"':'')
  +(k==='place'?' placeholder="City, region"':'')
  +(k==='time'&&CURP.who.born.timeUnknown?' disabled':'')
  +' value="'+e_(v)+'" autocomplete="off">';
 return '<div class="en-f'+(opts.cls?' '+opts.cls:'')+'" data-fk="'+k+'"><label for="'+id+'">'+label+'</label>'+inp
  +(k==='time'?'<label class="en-ck"><input type="checkbox" id="en-tu"'+(CURP.who.born.timeUnknown?' checked':'')
   +'> I do not know it</label>':'')
  +(opts.under?'<div class="en-under" data-paint="u-'+k+'"></div>':'')+'</div>';}
function write(k,v){
 var w=CURP.who;
 if(k==='first'||k==='middle'||k==='last'||k==='sex')w[k]=v;
 else if(k==='zone')w.born.zone=String(v).trim();
 else w.born[k]=v;}
function applyType(v){
 if(v)seedApply(CURP,v); else seedClear(CURP);
 loadProfile(CURP); reApply();
 try{syncCh();syncSoul();}catch(x){}}
/* child answers and the archetype survive a reseed, because loadProfile
   reads the seed back over the axes */
function reApply(){
 Object.keys(EN.ans).forEach(function(c){var v=EN.ans[c]*2.5;S.charge[c]=v;
  CURP.axes[c]=CURP.axes[c]||{}; CURP.axes[c].held=v;});
 if(EN.arcPicked&&EN.arcs){S.arcs=EN.arcs.slice();CURP.soul.arcs=EN.arcs.slice();}}
function answer(c,a){EN.ans[c]=a; reApply(); try{syncCh();}catch(x){} save();}
function pickArch(i){
 var a=EN.arcs||[];
 if(!EN.arcPicked||a.length>=2||a[0]===i)a=[i]; else a=[a[0],i];
 EN.arcs=a; EN.arcPicked=true;
 var second=a[1]!=null?a[1]:(S.arcs.filter(function(x){return x!==a[0];})[0]);
 S.arcs=second!=null?[a[0],second]:[a[0]];
 CURP.soul.arcs=S.arcs.slice(); try{syncSoul();}catch(x){} save();}
function save(){try{pSave();}catch(x){}}
var T=null;
function wire(root){
 root.querySelectorAll('[data-f]').forEach(function(el){
  var k=el.getAttribute('data-f');
  if(k==='type'){el.onchange=function(){applyType(el.value);save();refresh();try{render();}catch(x){}};return;}
  el.oninput=function(){write(k,el.value);clearTimeout(T);T=setTimeout(refresh,260);};
  el.onchange=function(){write(k,el.value);save();refresh();};});
 var tu=root.querySelector('#en-tu');
 if(tu)tu.onchange=function(){CURP.who.born.timeUnknown=tu.checked;if(tu.checked)CURP.who.born.time='';
  var t=document.getElementById('en-time'); if(t){t.disabled=tu.checked; if(tu.checked)t.value='';}
  save();refresh();};
 root.querySelectorAll('[data-arc]').forEach(function(b){b.onclick=function(){pickArch(+b.getAttribute('data-arc'));
  if(EN.v==='c'&&!EN.all&&EN.arcs&&EN.arcs.length>1){EN.just=['a1','a2'];EN.step=8;mount();return;} refresh();paintArch();};});
 root.querySelectorAll('[data-ans]').forEach(function(b){b.onclick=function(){
  var p=b.getAttribute('data-ans').split(':'); answer(p[0],+p[1]);
  if(EN.v==='c'&&!EN.all&&EN.step>=8&&EN.step<17){EN.just=['c:'+p[0]];EN.step++;if(EN.step===17)EN.just=['out','in'];mount();return;}
  refresh();paintQs();};});
 root.querySelectorAll('[data-door]').forEach(function(b){b.onclick=function(){
  var k=b.getAttribute('data-door'); EN.doors[k]=!EN.doors[k];
  if(k==='laws')lawsPaint(); mount(true);};});}

/* ================= the questions, as blocks ================= */
function archHTML(){
 var a=EN.arcs||[];
 return '<div class="en-q"><p class="en-qt">Which of these runs first when it matters? Press one, then the one that comes second.</p>'
  +'<div class="en-arcs">'+ARCH.map(function(x,i){
   var on=a[0]===i?'true':'false', r2=a[1]===i;
   return '<div class="en-cell"><button type="button" class="ib" data-arc="'+i+'" aria-pressed="'+on+'"'+(r2?' data-r="2"':'')
    +' style="--c:'+seatCol(x.b)+'" aria-label="'+e_(x.nm+'. '+x.v)+'">'+ic('<path d="'+x.ic+'"/>')+'</button>'
    +'<span class="en-k">'+x.nm+'</span></div>';}).join('')+'</div></div>';}
function qHTML(i){
 var q=ENQ[i], v=EN.ans[q.c];
 return '<div class="en-qi"><p class="en-qt">'+e_(q.q)+'</p><div class="en-sc">'
  +EN_SCALE.map(function(l,a){return '<button type="button" class="en-scb" data-ans="'+q.c+':'+a+'" aria-pressed="'
   +(v===a?'true':'false')+'">'+l+'</button>';}).join('')+'</div></div>';}
function qsHTML(){return '<div class="en-qs">'+ENQ.map(function(q,i){return qHTML(i);}).join('')+'</div>';}
function door(k,label,val){
 return '<button type="button" class="en-door" data-door="'+k+'" aria-expanded="'+(!!EN.doors[k])+'">'
  +'<span class="en-dl">'+label+'</span><span class="en-dv">'+e_(val||'')+'</span><i></i></button>';}
function paintArch(){var h=document.querySelector('[data-paint=arch]'); if(h){h.innerHTML=archHTML();wire(h);}}
function paintQs(){var h=document.querySelector('[data-paint=qs]'); if(h){h.innerHTML=qsHTML();wire(h);}}

/* ================= the unders, variant a ================= */
function underOf(R,k){
 var n=function(role){return R.names.filter(function(x){return x.role===role;})[0];};
 if(k==='first'||k==='middle'||k==='last'){var x=n(k); if(!x)return '';
  return '<b>'+e_(x.typed)+'</b>. '+(x.root?'Root: '+e_(x.root.root)+(x.root.said?', heard as '+e_(x.root.said):'')+'. '
   :'No root on file. ')+'Number '+x.v+', '+e_(String(x.says||'').toLowerCase())+'.'
   +(k==='last'&&R.num?' <span class="en-dim">All three reduce to '+R.num.expression+'.</span>':'');}
 if(k==='date'&&R.born){var lp=R.born.lp, sun=skyL(R,'sun'), yr=skyL(R,'year');
  return 'Life path '+lp+', '+e_(String((NUM_CORE[lp]||{}).n||'').toLowerCase())+'.'
   +(sun&&!sun.open?' Sun in '+sun.sign+'.':'')+(yr&&!yr.open?' '+e_(yr.nm)+'.':'');}
 if(k==='time'&&R.born){var mo=skyL(R,'moon'), ri=skyL(R,'rising');
  if(!mo)return '';
  return (mo.open?'Moon not read yet.':'Moon in '+mo.sign+'.')+(ri&&!ri.open?' Rising '+ri.sign+'.':' Rising needs the place and zone.');}
 if(k==='zone'&&R.born){var r2=skyL(R,'rising'); return r2&&!r2.open?'Rising '+r2.sign+'. '+e_(R.sky.R.rail)+'.':'';}
 if(k==='type'&&R.pattern)return R.pattern.letters.map(function(L){return e_(L.say);}).join(' ');
 return '';}
function chanHTML(R){
 var C=R.channels;
 if(!C.read)return '<div class="en-chan"><div class="en-chr"><span>Outward</span><span class="en-bar"><i style="width:0"></i></span></div>'
  +'<div class="en-chr"><span>Inward</span><span class="en-bar"><i style="width:0"></i></span></div>'
  +'<p class="en-dim">Not read yet. A type or the nine questions would put charge on both channels.</p></div>';
 return '<div class="en-chan" role="button" tabindex="0" data-en="out" aria-label="Channels, open the reading">'
  +'<div class="en-chr"><span>'+ic(GLYPH_M)+'Outward</span><span class="en-bar" style="--c:'+seatCol('Solar')+'"><i style="width:'+Math.min(100,C.out*10).toFixed(0)+'%"></i></span></div>'
  +'<div class="en-chr"><span>'+ic(GLYPH_F)+'Inward</span><span class="en-bar" style="--c:'+seatCol('Throat')+'"><i style="width:'+Math.min(100,C['in']*10).toFixed(0)+'%"></i></span></div>'
  +'<p class="en-dim">'+(C.dir==='even'?'Both carry the same weight.':'The '+C.dir+' channel carries more.')+' Two channels of one vehicle.</p></div>';}

/* ================= the essence page ================= */
function row(key,label,val,line){
 var open=val==null||val==='';
 return '<button type="button" class="en-row'+(open?' open':'')+(EN.fresh[key]?' fresh':'')+'" data-en="'+key+'">'
  +'<span class="en-rl">'+e_(label)+'</span><span class="en-rv">'+(open?'not read yet':e_(val))+'</span>'
  +'<span class="en-rp">'+e_(line||'')+'</span></button>';}
function essenceHTML(R){
 var h='';
 var full=R.names.map(function(n){return n.typed;}).join(' ');
 h+='<div class="en-eh"><div class="pm-eye">Essence</div><div class="en-en">'+(full?e_(full):'Not named yet')+'</div>'
  +'<p class="en-dim">Everything Energetics holds, read so far. Press a line for the whole reading.</p></div>';
 h+='<section class="en-es"><h3>Given</h3>';
 ['first','middle','last'].forEach(function(role,i){var n=R.names.filter(function(x){return x.role===role;})[0];
  h+=row('n'+i,['First','Middle','Last'][i]+' name',n?n.typed:null,
   n?((n.root?'root '+n.root.root:'no root on file')+', number '+n.v):'needs your '+role+' name');});
 ['expression','soul','personality'].forEach(function(k){var v=numVal(R,k);
  h+=row(k,NUM_LABEL[k],v,v!=null?(k==='expression'?NUM_CORE[v].ex:k==='soul'?NUM_CORE[v].so:NUM_CORE[v].pe):'needs your name');});
 h+='</section><section class="en-es"><h3>Born</h3>';
 ['lifePath','birthday','maturity'].forEach(function(k){var v=numVal(R,k);
  h+=row(k,NUM_LABEL[k],v,v!=null?(NUM_CORE[k==='birthday'?numReduce(v):v]||{}).n:'needs your '+NUMNEED[k]);});
 SKY.forEach(function(k){var l=skyL(R,k);
  h+=row(k,ST_POS[k].nm,l&&!l.open?(k==='year'?l.nm:l.sign):null,
   l&&!l.open?(k==='year'?'':l.el+', '+l.mode):(R.born?'needs '+(k==='moon'?'your time of birth':k==='rising'?'time, place and zone':'your date'):'needs your date of birth'));});
 if(R.sky&&R.sky.R.head)h+='<p class="en-syn">'+e_(R.sky.R.head)+'</p>';
 h+='</section><section class="en-es"><h3>Pattern</h3>';
 if(R.pattern)R.pattern.letters.forEach(function(L,j){h+=row('p'+j,L.ax,L.l+', '+EN_POLE_NM[L.l],L.say);});
 else h+=row('p0','Four letter type',null,'needs your Myers-Briggs type, if you know it');
 h+='</section><section class="en-es"><h3>Channels</h3>'+chanHTML(R)+'</section>';
 h+='<section class="en-es"><h3>Drives</h3>';
 h+=row('a1','Runs first',R.arch?R.arch.first.nm:null,R.arch?R.arch.first.v:'needs the archetype question');
 h+=row('a2','Runs second',R.arch&&R.arch.second?R.arch.second.nm:null,R.arch&&R.arch.second?R.arch.second.v:'needs a second press');
 if(R.child)R.child.heavy.slice(0,3).forEach(function(x){
  h+=row('c:'+x.c,x.c,EN_SCALE[EN.ans[x.c]].toLowerCase(),'held at the '+x.ch.loc);});
 else h+=row('c:Fear','What you carry',null,'needs the nine questions');
 h+='</section>';
 return h;}

/* ================= Source AI, scripted ================= */
var AI_LAST=[], AI_AT={};
function aiHTML(R){
 var v=enVoice(R);
 var h='<div class="en-ai-h"><span class="en-ai-g">'+ic(IC.ai)+'</span><b>Source AI</b></div>'
  +'<div class="en-ai-tag">Illustrative. Scripted from what is on this page. No model is called.</div>'
  +'<div class="en-ai-b" aria-live="polite">'
  +v.lines.map(function(l){if(AI_LAST.indexOf(l)<0)AI_AT[l]=Date.now();
   return '<p class="'+(Date.now()-(AI_AT[l]||0)<1400?'fresh':'')+'">'+e_(l)+'</p>';}).join('')
  +'</div><p class="en-ai-t">'+e_(v.tail)+'</p>';
 AI_LAST=v.lines.slice();
 return h;}

/* ================= the staged path ================= */
var STEPS=[
 {id:'first',short:'your first name',q:'Your first name, the one on your birth certificate.',f:['first'],opens:['n0']},
 {id:'middle',short:'your middle name',q:'Your middle name, if you have one.',f:['middle'],opens:['n1']},
 {id:'last',short:'your last name',q:'Your last name.',f:['last'],opens:['n2','expression','soul','personality']},
 {id:'date',short:'your date of birth',q:'Your date of birth.',f:['date','sex'],opens:['lifePath','birthday','maturity','sun','year']},
 {id:'time',short:'your time of birth',q:'The time you were born. If you do not know it, say so. It is not guessed.',f:['time'],opens:['moon']},
 {id:'place',short:'your place of birth',q:'Where you were born, and its time zone.',f:['place','zone'],opens:['rising']},
 {id:'type',short:'your type',q:'Your four letter Myers-Briggs type, if you know it.',f:['type'],opens:['p0','p1','p2','p3']},
 {id:'arch',short:'the archetype question',q:'',f:[],opens:['a1','a2']},
 {id:'carry',short:'the nine questions',q:'',f:[],opens:[]}];
for(var qi=0;qi<9;qi++)STEPS.push({id:'q'+qi,short:'the nine questions',q:'',f:[],opens:['c:'+CHARGES[qi]]});
STEPS.splice(8,1);
/* steps 0 to 7 are fields and the archetype; 8 to 16 the nine; 17 is done */
function stepHTML(R){
 var i=EN.step, just=EN.just||[];
 var h='';
 if(just.length){
  h+='<div class="en-just"><div class="pm-eye">Just opened</div><div class="en-jt">'
   +just.map(function(k){return tile(R,k);}).join('')+'</div>'
   +(just.some(function(k){return !tileOf(R,k).open;})?'<p class="en-jl">'+e_(justLine(R,just))+'</p>':'<p class="en-jl en-dim">Skipped. It stays open until you answer.</p>')+'</div>';}
 if(i>=17){
  h+='<div class="en-card en-done"><div class="pm-eye">Done</div><p class="en-qt">Everything Energetics asks is in. The rest opens as you write.</p>'
   +'<button class="btn pri" type="button" data-en="essence">Open your essence</button></div>';
  return h;}
 var s=STEPS[i];
 h+='<div class="en-card"><div class="pm-eye">Opens '+e_(s.opens.map(function(k){return tileOf(R,k).lab;}).filter(uniq).join(', ')||'your field')+'</div>';
 if(s.id==='arch')h+=archHTML();
 else if(/^q\d$/.test(s.id))h+='<div class="en-qn">What you carry</div>'+qHTML(+s.id.slice(1));
 else{h+='<p class="en-qt">'+e_(s.q)+'</p><div class="en-stf">'+s.f.map(function(k){
   return field(k,{first:'First name',middle:'Middle name',last:'Last name',date:'Date of birth',sex:'Sex at birth, optional',
    time:'Time of birth',place:'Place of birth',zone:'Time zone of birth',type:'Myers-Briggs'}[k]);}).join('')+'</div>';}
 h+='<div class="en-stb">'
  +(s.f.length?'<button class="btn pri" type="button" id="en-next">Next</button>':'')
  +'<button class="btn" type="button" id="en-skip">Skip</button>'
  +(i>0?'<button class="btn en-back" type="button" id="en-prev">Back</button>':'')+'</div></div>';
 return h;}
function uniq(x,i,a){return a.indexOf(x)===i;}
function justLine(R,keys){
 var k=keys.filter(function(x){return !tileOf(R,x).open;});
 var n=R.names;
 if(k.indexOf('n0')>=0&&n[0])return underOf(R,'first').replace(/<[^>]+>/g,'');
 if(k.indexOf('n1')>=0)return underOf(R,'middle').replace(/<[^>]+>/g,'');
 if(k.indexOf('n2')>=0)return underOf(R,'last').replace(/<[^>]+>/g,'');
 if(k.indexOf('lifePath')>=0)return underOf(R,'date').replace(/<[^>]+>/g,'');
 if(k.indexOf('moon')>=0||k.indexOf('rising')>=0)return underOf(R,'time').replace(/<[^>]+>/g,'');
 if(k[0]==='p0')return underOf(R,'type');
 if(k[0]==='a1'||k[0]==='a2')return R.arch?R.arch.first.nm+' runs first: it '+R.arch.first.v+'.':'';
 if(k[0]&&k[0].indexOf('c:')===0){var c=k[0].slice(2),ch=CHILD.filter(function(x){return x.nm===c;})[0];
  return c+', '+EN_SCALE[EN.ans[c]].toLowerCase()+'. It sits at the '+ch.loc+'.';}
 return '';}
function stepNext(skip){
 var s=STEPS[EN.step];
 if(!skip)s.f.forEach(function(k){var el=document.getElementById('en-'+k); if(el&&k!=='type'){write(k,el.value);}});
 if(skip&&s.id!=='arch'&&!/^q/.test(s.id))s.f.forEach(function(k){if(k!=='type'&&k!=='sex')write(k,'');});
 save();
 EN.just=s.opens.slice(); EN.step++;
 if(EN.step===17)EN.just=['out','in'];
 mount();
 var f=document.querySelector('.en-card input,.en-card select'); if(f&&!narrow())f.focus();}

/* ================= laws, the product's own ================= */
function lawsPaint(){
 var outer=document.getElementById('iq'), inner=document.getElementById('en-laws');
 if(!outer||!inner||!ORIG)return;
 if(!EN.doors.laws){inner.innerHTML='';return;}
 outer.id='iq-outer'; inner.id='iq';
 try{ORIG();}catch(x){}
 finally{inner.id='en-laws'; outer.id='iq';}
 var w=inner.querySelector('.iq-who,.iq-sealed'); if(w)w.remove();}

/* ================= the chrome, prototype only ================= */
function chromeHTML(){
 return '<div class="en-proto" data-proto="1"><span class="en-ph">Prototype only</span>'
  +'<div class="en-seg" role="group" aria-label="Layout">'+['a','b','c','d'].map(function(k){
   return '<button type="button" data-v="'+k+'" aria-pressed="'+(EN.v===k)+'">'+VN[k]+'</button>';}).join('')+'</div>'
  +'<label class="en-fill">Fill as <select id="en-fillsel"><option value="">choose</option>'
  +Object.keys(EN_FILL).map(function(k){return '<option value="'+k+'">'+EN_FILL[k].label+'</option>';}).join('')
  +'</select></label><button type="button" class="en-clr" id="en-clear">Start blank</button></div>';}

/* ================= mounting ================= */
EN.doors=EN.doors||{};
function body(){
 var v=EN.v, h='';
 if(v==='a'||(v==='c'&&EN.all)){
  h+='<div class="en-a">'
   +'<p class="en-lede">Your name and your birth are the two things here nobody has to remember. The line under each field reads what it carries, as you type.</p>'
   +'<section class="en-sec"><h3>Name</h3>'+field('first','First name',{under:1})+field('middle','Middle name',{under:1})+field('last','Last name',{under:1})+'</section>'
   +'<section class="en-sec"><h3>Birth</h3>'+field('date','Date of birth',{under:1})+field('time','Time of birth',{under:1})
    +'<div class="en-two">'+field('place','Place of birth')+field('zone','Time zone of birth',{under:1})+'</div>'+field('sex','Sex at birth')+'</section>'
   +'<section class="en-sec"><h3>Pattern</h3>'+field('type','Myers-Briggs, if you know it',{under:1})+'</section>'
   +'<section class="en-sec"><h3>Channels</h3><div data-paint="chan"></div></section>'
   +'<div data-slot="ai"></div>'
   +door('arch','Archetype',EN.arcPicked?ARCH[EN.arcs[0]].nm+(EN.arcs[1]!=null?', then '+ARCH[EN.arcs[1]].nm:''):'not answered')
   +(EN.doors.arch?'<div data-paint="arch">'+archHTML()+'</div>':'')
   +door('qs','What you carry, nine questions',Object.keys(EN.ans).length?'answered '+Object.keys(EN.ans).length:'not answered')
   +(EN.doors.qs?'<div data-paint="qs">'+qsHTML()+'</div>':'')
   +door('ess','Essence','everything read so far')
   +(EN.doors.ess?'<div class="en-ess" data-paint="essence"></div>':'')
   +(v==='c'?'<button type="button" class="en-door" id="en-staged"><span class="en-dl">Back to one question at a time</span><i></i></button>':'')
   +'</div>';}
 else if(v==='b'){
  h+='<div class="en-b"><div data-slot="rail"></div><div data-slot="ai"></div>'
   +'<section class="en-sec"><h3>Who this is</h3><div class="en-grid">'
   +field('first','First name')+field('middle','Middle')+field('last','Last')+field('sex','Sex at birth')
   +field('date','Date of birth')+field('time','Time of birth')+field('place','Place of birth')+field('zone','Time zone of birth')
   +'</div>'+field('type','Myers-Briggs, if you know it',{cls:'en-one'})+'</section>'
   +'<section class="en-sec"><h3>Archetype</h3><div data-paint="arch">'+archHTML()+'</div></section>'
   +'<section class="en-sec"><h3>What you carry</h3><div data-paint="qs">'+qsHTML()+'</div></section></div>';}
 else if(v==='c'){
  h+='<div class="en-c"><div data-paint="step"></div><div data-slot="ai"></div><div data-slot="rail"></div>'
   +'<button type="button" class="en-door" id="en-all"><span class="en-dl">Show every question at once</span><i></i></button></div>';}
 else if(v==='d'){
  h+='<div class="en-d"><div data-slot="rail"></div><div data-slot="ai"></div><div class="en-ess big" data-paint="essence"></div></div>';}
 h+=door('laws','Moral integrity, 63 questions','about fifteen minutes')+'<div id="en-laws"></div>';
 return h;}
function railForm(){
 return '<div class="en-dform"><div class="en-gh">Who this is</div>'
  +field('first','First name')+field('middle','Middle name')+field('last','Last name')
  +field('date','Date of birth')+field('time','Time of birth')+field('place','Place of birth')+field('zone','Time zone of birth')
  +field('sex','Sex at birth')+field('type','Myers-Briggs, if you know it')
  +'<div class="en-gh">Archetype</div><div data-paint="arch">'+archHTML()+'</div>'
  +'<div class="en-gh">What you carry</div><div data-paint="qs">'+qsHTML()+'</div></div>';}
var HOME={};
function ensureHosts(){
 if(!document.getElementById('enrail')){
  var lp=document.querySelector('.mid>.col:first-child .panel'); HOME.rail=lp;
  var r=document.createElement('div'); r.id='enrail'; lp.insertBefore(r,lp.firstChild);}
 if(!document.getElementById('enai')){
  var rp=document.querySelector('.mid>.col:last-child .panel'); HOME.ai=rp;
  var a=document.createElement('div'); a.id='enai'; a.className='en-ai'; rp.insertBefore(a,rp.firstChild);}
 if(!HOME.drill)HOME.drill=document.getElementById('rdrill').parentNode;}
function goHome(){
 var rail=document.getElementById('enrail'), ai=document.getElementById('enai'), dr=document.getElementById('rdrill');
 if(rail&&rail.parentNode!==HOME.rail)HOME.rail.insertBefore(rail,HOME.rail.firstChild);
 if(ai&&ai.parentNode!==HOME.ai)HOME.ai.insertBefore(ai,HOME.ai.firstChild);
 if(dr&&dr.parentNode!==HOME.drill)HOME.drill.insertBefore(dr,HOME.drill.firstChild);}
function place(){
 var n=narrow(), rail=document.getElementById('enrail'), ai=document.getElementById('enai');
 var rs=document.querySelector('#iq [data-slot=rail]'), as=document.querySelector('#iq [data-slot=ai]');
 if(n&&rs&&EN.v!=='a'){if(rail.parentNode!==rs)rs.appendChild(rail);}
 else if(rail.parentNode!==HOME.rail)HOME.rail.insertBefore(rail,HOME.rail.firstChild);
 if(n&&as){if(ai.parentNode!==as)as.appendChild(ai);}
 else if(ai.parentNode!==HOME.ai)HOME.ai.insertBefore(ai,HOME.ai.firstChild);
 var dr=document.getElementById('rdrill');
 if(!n&&dr&&dr.parentNode!==HOME.drill)HOME.drill.insertBefore(dr,HOME.drill.firstChild);}
function mount(keepScroll){
 var host=document.getElementById('iq'); if(!host)return;
 ensureHosts(); goHome();
 document.body.classList.add('en-on');
 ['a','b','c','d'].forEach(function(k){document.body.classList.toggle('en-v'+k,EN.v===k);});
 document.body.classList.toggle('en-all',!!EN.all);
 var y=keepScroll?host.scrollTop:0;
 host.innerHTML='<div class="en-root">'+chromeHTML()+body()+'</div>';
 host.setAttribute('data-en-v',EN.v);
 var rail=document.getElementById('enrail');
 rail.innerHTML=EN.v==='d'?railForm():EN.v==='a'?'':'<div data-paint="tiles"></div>';
 rail.className='en-rail en-rail-'+EN.v;
 wireChrome(host); wire(host); wire(rail);
 lawsPaint(); iqZones&&iqZones();
 place(); refresh(true);
 host.scrollTop=y;}
function wireChrome(host){
 host.querySelectorAll('[data-v]').forEach(function(b){b.onclick=function(){EN.v=b.getAttribute('data-v');EN.all=false;
  try{history.replaceState(null,'','#'+EN.v);}catch(x){} mount();};});
 var fs=document.getElementById('en-fillsel'); if(fs)fs.onchange=function(){if(fs.value)enFill(fs.value);};
 var cl=document.getElementById('en-clear'); if(cl)cl.onclick=function(){enBlank();mount();};
 var al=document.getElementById('en-all'); if(al)al.onclick=function(){EN.all=true;mount();};
 var st=document.getElementById('en-staged'); if(st)st.onclick=function(){EN.all=false;mount();};}
function wireStep(){
 var nx=document.getElementById('en-next'), sk=document.getElementById('en-skip'), pv=document.getElementById('en-prev');
 if(nx)nx.onclick=function(){stepNext(false);};
 if(sk)sk.onclick=function(){stepNext(true);};
 if(pv)pv.onclick=function(){EN.step=Math.max(0,EN.step-1);EN.just=[];mount();};
 document.querySelectorAll('.en-card input').forEach(function(el){el.addEventListener('keydown',function(ev){
  if(ev.key==='Enter'){ev.preventDefault();stepNext(false);}});});}
/* ================= refresh: read, diff, paint ================= */
function refresh(first){
 var R=enRead(); EN.R=R;
 /* a reading counts as just read for 1.4 seconds after it changed, so a
    second repaint inside that window (typing, then leaving the field) does
    not cut the pulse short */
 var s=sigs(R), now=Date.now(); EN.at=EN.at||{};
 if(!first)Object.keys(s).forEach(function(k){if(s[k]&&EN.last[k]!==s[k])EN.at[k]=now;});
 else if(EN.v==='c'&&EN.just)EN.just.forEach(function(k){if(s[k])EN.at[k]=now;});
 EN.fresh={}; Object.keys(EN.at).forEach(function(k){if(now-EN.at[k]<1400&&s[k])EN.fresh[k]=1;});
 EN.last=s;
 var q=function(sel){return document.querySelectorAll('[data-paint="'+sel+'"]');};
 q('tiles').forEach(function(h){h.innerHTML=tilesHTML(R,EN.v==='c');});
 ['first','middle','last','date','time','zone','type'].forEach(function(k){
  q('u-'+k).forEach(function(h){var u=underOf(R,k); h.innerHTML=u; h.classList.toggle('fresh',!!u&&!!EN.fresh[k==='first'?'n0':k==='middle'?'n1':k==='last'?'n2':k==='date'?'lifePath':k==='type'?'p0':'moon']);});});
 q('chan').forEach(function(h){h.innerHTML=chanHTML(R);});
 q('essence').forEach(function(h){h.innerHTML=essenceHTML(R);});
 if(first===true)q('step').forEach(function(h){h.innerHTML=stepHTML(R);wire(h);wireStep();});
 var ai=document.getElementById('enai'); if(ai)ai.innerHTML=aiHTML(R);
 document.querySelectorAll('#iq [data-en],#enrail [data-en]').forEach(function(b){b.onclick=function(){enOpen(b.getAttribute('data-en'));};});
 clearTimeout(EN.ft); EN.ft=setTimeout(function(){document.querySelectorAll('.fresh').forEach(function(x){x.classList.remove('fresh');});},1450);}

/* ================= the cards ================= */
function show(h,from){
 rdShell(h); drillNear(from);}
/* on a phone the product's rail sits under the whole surface, so the card
   the person asked for would land thousands of pixels away. The product's
   own drill element is moved to just under what was pressed instead. */
function drillNear(from){
 var dr=document.getElementById('rdrill'); if(!dr||!narrow())return;
 var at=from&&from.closest?from.closest('.en-grp,.en-es,.en-sec,.en-card,.en-just,.en-dform'):null;
 if(!at)at=document.querySelector('#iq .en-root');
 var slot=document.getElementById('en-slot-drill');
 if(!slot){slot=document.createElement('div');slot.id='en-slot-drill';}
 at.parentNode.insertBefore(slot,at.nextSibling);
 slot.appendChild(dr); dr.style.display='block';
 dr.scrollIntoView({block:'nearest'});}
function refuse(label,need,field){
 return '<div class="pm-eye">'+e_(label)+'</div><div class="ad-nm">not read yet</div>'
  +'<p class="ad-p">'+e_(need)+'</p>';}
function enOpen(key){
 var R=EN.R||enRead(), from=document.activeElement;
 if(key==='essence')return show(essenceHTML(R),from);
 if(/^n\d$/.test(key)){var role=['first','middle','last'][+key[1]];
  var n=R.names.filter(function(x){return x.role===role;})[0];
  if(!n)return show(refuse(['First','Middle','Last'][+key[1]]+' name','Needs your '+role+' name. Type it on Energetics and this reads it.'),from);
  var h='<div class="pm-eye">'+['First','Middle','Last'][+key[1]]+' name</div><div class="ad-nm">'+e_(n.typed)+'</div>'
   +'<div class="ad-sub">number '+n.v+', '+e_(String(n.says).toLowerCase())+'</div>'
   +'<div class="pm-eye">Root</div>';
  if(n.root)h+='<p class="ad-p"><b>'+e_(n.root.root)+'</b>. '+e_(n.root.from)+'.</p>'
   +(n.root.said?'<p class="ad-p">Heard as <b>'+e_(n.root.said)+'</b>, from '+e_(n.root.saidFrom)+'.</p>':'')
   +(n.root.disputed?'<p class="ad-p en-dim">The references disagree on this root. Both readings are shown.</p>':'')
   +'<p class="en-src">'+e_(EN_ROOTS_SRC)+'</p>';
  else h+='<p class="ad-p">No root meaning on file for '+e_(n.typed)+'. The number below still reads, because it is computed from the letters.</p>'
   +'<p class="en-src">Prototype table: nine names, illustrative.</p>';
  h+='<div class="pm-eye">Number</div><p class="ad-p">The letters of '+e_(n.typed)+' add to '+(numSum(enRootKey(n.clean),'all'))
   +' and reduce to <b>'+n.v+'</b>. '+e_(n.says)+'.'+(n.debt?' Karmic debt '+n.debt+'.':'')+'</p>'
   +'<button class="btn" type="button" id="en-toexp">Open your expression</button>';
  show(h,from); var b=document.getElementById('en-toexp'); if(b)b.onclick=function(){enOpen('expression');}; return;}
 if(NUMK.indexOf(key)>=0){
  if(numVal(R,key)==null)return show(refuse(NUM_LABEL[key],'Needs your '+NUMNEED[key]+'.'),from);
  runNumDrill(key); drillNear(from); return;}
 if(SKY.indexOf(key)>=0){
  try{renderSpirit();}catch(x){}
  var t=document.querySelector('#spirit [data-st="'+key+'"]'); if(t)t.click(); drillNear(from); return;}
 if(/^p\d$/.test(key)){
  if(!R.pattern)return show(refuse('Pattern','Needs your four letter Myers-Briggs type. It is your own account of yourself, stated, never detected.'),from);
  var P=R.pattern, j=+key[1];
  var h2='<div class="pm-eye">Pattern</div><div class="ad-nm">'+e_(P.type)+'</div>'
   +'<div class="ad-sub">stated, so it is your own account and not a reading</div>'
   +'<div class="pm-eye">How it moves</div>'+P.letters.map(function(L,i){
    return '<p class="ad-p'+(i===j?' en-hi':'')+'"><b>'+L.ax+', '+L.l+'.</b> '+e_(L.say)+'</p>';}).join('')
   +'<div class="pm-eye">What it moved</div><p class="ad-p">It put the most charge on '+e_(P.up.join(' and ').toLowerCase())
   +'. '+Math.round(P.share*100)+' per cent of what the nine axes carry is still that seed. Your answers and your stories move it from there.</p>';
  return show(h2,from);}
 if(key==='out'||key==='in'){
  var C=R.channels;
  if(!C.read)return show(refuse('Channels','Neither channel carries enough to read. A type or the nine questions would put charge on both.'),from);
  var h3='<div class="pm-eye">Channels</div><div class="ad-nm">Two channels of one vehicle</div>'
   +'<div class="ad-sub">'+(C.dir==='even'?'even':'the '+C.dir+' channel carries more')+'</div>'
   +chanHTML(R)
   +'<p class="ad-p"><b>Outward</b>, the masculine channel. Structure and direction, expressed as force. Anger, disgust, anticipation and surprise run here. Right side, sympathetic.</p>'
   +'<p class="ad-p"><b>Inward</b>, the feminine channel. Energy and receptivity, held as force. Fear, shame, sadness, apathy and shock run here. Left side, parasympathetic.</p>'
   +'<p class="ad-p en-dim">Not men and not women: the codex is explicit about that. Everyone runs both.</p>'
   +(typeof runBalDrill==='function'?'<button class="btn" type="button" id="en-bal">Open the balance reading</button>':'');
  show(h3,from); var bb=document.getElementById('en-bal'); if(bb)bb.onclick=function(){runBalDrill();drillNear(from);}; return;}
 if(key==='a1'||key==='a2'){
  if(!R.arch)return show(refuse('Archetype','Needs the archetype question: which of twelve runs first when it matters.'),from);
  var A=R.arch, h4='<div class="pm-eye">Archetype</div><div class="ad-nm">'+A.first.nm+(A.second?', then '+A.second.nm:'')+'</div>'
   +'<div class="ad-sub">picked, so it is your own account</div>'
   +'<p class="ad-p"><b>'+A.first.nm+'</b> '+A.first.v+'. It seats at the '+A.first.b+'.</p>'
   +(A.second?'<p class="ad-p"><b>'+A.second.nm+'</b> '+A.second.v+'. It seats at the '+A.second.b+'.</p>':'')
   +(A.lpArch?'<p class="ad-p">Your life path reads <b>'+A.lpArch+'</b>. '+(A.lpArch===A.first.nm?'They agree.':'They do not, which is what you were given against what you run.')+'</p>':'');
  return show(h4,from);}
 if(key.indexOf('c:')===0){var c=key.slice(2), ch=CHILD.filter(function(x){return x.nm===c;})[0], q=ENQ.filter(function(x){return x.c===c;})[0];
  if(EN.ans[c]==null)return show(refuse(c,'Needs its question: "'+q.q+'"'),from);
  return show('<div class="pm-eye">What you carry</div><div class="ad-nm">'+c+'</div><div class="ad-sub">'+EN_SCALE[EN.ans[c]].toLowerCase()
   +', held at '+(EN.ans[c]*2.5)+' of the axis</div><p class="ad-p">"'+e_(q.q)+'"</p><p class="ad-p">It sits at the <b>'+ch.loc
   +'</b>, the '+e_(ch.addr.toLowerCase())+'. Its opposite is '+ch.opp.toLowerCase()+'.</p>',from);}}
window.enOpen=enOpen;

/* ================= fill, prototype only ================= */
function enBlank(){
 var w=CURP.who; w.first=w.middle=w.last=w.sex=''; w.born={date:'',time:'',place:'',zone:'',timeUnknown:false};
 seedClear(CURP); EN.ans={}; EN.arcPicked=false; EN.arcs=null; EN.step=0; EN.just=[]; EN.doors={}; EN.all=false;
 /* the product's own blank: loadP(0) sets every axis to 0. loadProfile would
    fill a missing axis with 3, which reads as a balanced field nobody entered */
 CHARGES.forEach(function(c){S.charge[c]=0;S.replace[c]=0;CURP.axes[c]={held:0,opp:0};});
 try{syncCh();syncSoul();}catch(x){} save();}
function enFill(k){
 var F=EN_FILL[k]; if(!F)return;
 enBlank();
 var w=CURP.who, nm=F.name.split(' ');
 w.first=nm[0]||''; w.middle=nm.length>2?nm.slice(1,-1).join(' '):''; w.last=nm.length>1?nm[nm.length-1]:'';
 if(F.d)w.born={date:F.d,time:F.t||'',place:F.p||'',zone:F.z||'',timeUnknown:false};
 if(F.type)applyType(F.type);
 if(F.arcs){EN.arcs=F.arcs.slice();EN.arcPicked=true;}
 if(F.ans)EN.ans=Object.assign({},F.ans);
 reApply(); try{syncCh();syncSoul();}catch(x){}
 EN.step=17; save(); mount();}
window.enFill=enFill; window.enBlank=enBlank;

/* ================= the seam ================= */
window.renderIntake=function(){
 var host=document.getElementById('iq'); if(!host)return;
 if(host.getAttribute('data-en-v')===EN.v&&host.querySelector('.en-root')){refresh();lawsPaint();return;}
 iqEnsure(); mount();};
window.enMount=mount; window.enRefresh=refresh;
var rt=null; addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(document.body.classList.contains('tab-intake'))place();},120);});
})();
