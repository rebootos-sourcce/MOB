
/* ============================================================
   SOURCE PROFILE SCHEMA v1 · the cross-compatibility contract.
   Every number in the app derives from this and nothing else.
   Versioned so a v2 can migrate rather than break.
   ============================================================ */
/* v2 adds gates. The VERP mix is a cost multiplier of 0.60 to 1.35 on every
   held pattern, and in v1 it was never written down, so a reload silently
   moved every CQ in the app. A v1 profile still loads: gates absent reads as
   zeroes, which is exactly what no story evidence means. Saving upgrades it.
   This touches the cross-compatibility contract with SOURCE, so the bump is
   flagged for his ruling in REVIEW-source.md. */
var SCHEMA_V=2, PKEY='source.profiles';
function blankProfile(name){
 var p={v:SCHEMA_V, id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  name:name||'New profile', created:new Date().toISOString(), updated:null,
  soul:{doms:[0], arcs:[0,1], roots:[]},            /* the invariant */
  axes:{},                                          /* nine poled child fetters */
  /* who. name, sex at birth, and the birth moment. Nothing derived is
     stored: the energetics are pure functions of these three strings, so a
     sixth system still costs nothing. timeUnknown is explicit, because an
     unknown birth time changes what can be read and must not be guessed. */
  who:{first:'', middle:'', last:'', sex:'', born:{date:'', time:'', place:'', timeUnknown:false}},
  /* what the person said their type is, and what it wrote. null until stated. */
  seed:null,
  /* THE METER. One pattern is one release line delivered: one channel over
     one address. A six channel sweep over one address is six.

     Lines counts every line ever spoken, repeats included, because a person
     may rerun anything as often as they like and that is free. Unique holds
     the keys of the lines run at least once, and that is what the tier
     ladder buys: a tier is not how much you may speak, it is how much new
     ground you may open. It lives on the record and is never derived,
     because a derived count moves when the model moves and then the tier
     gate disagrees with the app about what was run. */
  meter:{lines:0, unique:[], firsts:[], first:null, last:null},
  laws:{}, intake:{answers:{}, done:[], startedAt:null, completedAt:null},
  gates:{verp:{aware:0,detach:0,intent:0,ignore:0,attach:0,averse:0},
         lean:{benign:0,malignant:0}},   /* the cost multiplier, v2 */
  story:{entries:[]}, rituals:[], history:[]};
 /* held was 3 on every axis, and this is the profile a new person gets. The
    laws beside it are correctly null, meaning not yet measured, and the charge
    was not given the same honesty. Nobody entered a 3. Zero is the only value
    that is true of a person who has said nothing. */
 CHILD.forEach(function(c){p.axes[c.nm]={held:0,opp:0};});
 SI.forEach(function(l){p.laws[l.nm]=null;});        /* null = not yet measured */
 return p;}
function loadProfile(p){
 if(!p.who)p.who={first:'',middle:'',last:'',sex:'',born:{date:'',time:'',place:'',timeUnknown:false}};
 if(!p.who.born)p.who.born={date:'',time:'',place:'',timeUnknown:false};
 if(!p.meter)p.meter={lines:0,unique:[],first:null,last:null};
 if(!Array.isArray(p.meter.unique))p.meter.unique=[];
 S.doms=(p.soul.doms||[0]).slice(); S.arcs=(p.soul.arcs||[0,1]).slice();
 S.roots=(p.soul.roots||[]).slice(); buildSoul();
 CHILD.forEach(function(c){var a=p.axes[c.nm]||{};
  S.charge[c.nm]=a.held!=null?a.held:3; S.replace[c.nm]=a.opp||0;});
 /* Expression and Discernment were the twenty one until the owner ruled that
    Justice and Humility are. A law is keyed by name in every saved profile, so
    the old score is carried across rather than dropped back to the default a
    person never entered. Expression is a whole separate law axis in the codex
    and keeps its own name there. */
 var LAWWAS={Justice:'Expression', Humility:'Discernment'};
 SI.forEach(function(l){
  var v=p.laws[l.nm];
  if(v==null&&LAWWAS[l.nm]!=null&&p.laws[LAWWAS[l.nm]]!=null){
   v=p.laws[LAWWAS[l.nm]]; p.laws[l.nm]=v; delete p.laws[LAWWAS[l.nm]];}
  S.law[l.nm]=(v!=null)?v:6;});
 gatesLoad(p);   /* absent on a v1 profile, which reads as no story evidence */
 suscAll();      /* so a story applied before compute() lands on this profile */
 return p;}
function saveProfile(p){
 p.soul={doms:S.doms.slice(),arcs:S.arcs.slice(),roots:S.roots.slice()};
 CHILD.forEach(function(c){p.axes[c.nm]={held:S.charge[c.nm],opp:S.replace[c.nm]||0};});
 SI.forEach(function(l){if(S.law[l.nm]!=null)p.laws[l.nm]=S.law[l.nm];});
 gatesSave(p);
 p.updated=new Date().toISOString(); p.v=SCHEMA_V;
 return p;}
/* a snapshot is what Analytics plots. derived only, never inputs. */
function snapshot(p){
 var r=compute();
 return {t:new Date().toISOString(), cq:Math.round(r.CQ*10)/10, dq:Math.round(r.DQ*100)/100,
  sq:Math.round(r.SQm*100)/100, pole:Math.round(r.poleMean*100)/100,
  jq:Math.round(r.JQ*100)/100, rad:Math.round(r.radiance*1000)/1000,
  loaded:r.loaded.length, sab:r.sabs.length, cx:r.cxs.length, hy:r.hys.length, ch:r.sups.length,
  dark:r.darkB, tier:r.tier, arch:ARCH[r.pi].nm};}
var PROFILES=[], CURP=null;
/* The engine does not know what a browser is. The host binds a store. With none
   bound the profiles last as long as the process, which is what a headless run
   wants. ui/ui.js binds localStorage. */
/* The default store is a no-op whose set() never throws, so a browser that
   blocks storage left SAVE_OK true and the app reported "Saved." while nothing
   was written. That is the lie this file already forbids. A store has to be
   bound before a save can be claimed. */
var STORE={get:function(){return null;}, set:function(){}}, STORE_BOUND=false;
/* a host binds its own. exported, because module.exports captures the value of
   STORE and not the binding, so an outside caller cannot assign to it. */
function bindStore(get,set){ STORE={get:get,set:set}; STORE_BOUND=true; return STORE; }
function pStore(){ try{ return JSON.parse(STORE.get(PKEY)||'[]'); }catch(e){ return []; } }
/* The empty catch here meant a save that failed on quota or blocked storage
   told nobody, and the intake button said "Saved" regardless. The engine still
   does not render anything: it reports, and the UI decides what to show. */
var SAVE_OK=true, SAVE_ERR=null;
function pPersist(){
 if(!STORE_BOUND){ SAVE_OK=false; SAVE_ERR='NoStore'; return false; }
 try{ STORE.set(PKEY,JSON.stringify(PROFILES)); SAVE_OK=true; SAVE_ERR=null; }
 catch(e){ SAVE_OK=false; SAVE_ERR=(e&&e.name)||'error'; }
 return SAVE_OK; }
function saveState(){ return {ok:SAVE_OK, err:SAVE_ERR}; }
function pNew(name){ var p=blankProfile(name); PROFILES.push(p); CURP=p; pPersist(); return p; }
function pSave(){ if(!CURP)return null; saveProfile(CURP); pPersist(); return CURP; }
function pSnap(){ if(!CURP)return null; CURP.history.push(snapshot(CURP)); pPersist(); return CURP; }
function pExport(){ return JSON.stringify(CURP?saveProfile(CURP):null,null,1); }
/* ============================================================
   THE BOUNDARY. Everything above this line trusts its input
   because the app wrote it. Everything a person can paste in
   does not get that. loadProfile accepted a charge of 9999 and
   pImport pushed a malformed profile onto PROFILES and moved
   CURP onto it before loadProfile could throw, so a bad paste
   left the app holding it with no way back.

   A missing field is an older profile and is filled from the
   blank. A field of the wrong type or out of range is corruption
   or an attack, and it is refused by name. Nothing is silently
   clamped, because a clamped 9999 reads as a 10 a person never
   entered, and this file already forbids lying about what
   happened.
   ============================================================ */
var NUM=function(v){return typeof v==='number'&&isFinite(v);};
function vRange(errs,path,v,lo,hi){
 if(v===undefined||v===null)return null;
 if(!NUM(v)){errs.push(path+' is not a number');return null;}
 if(v<lo||v>hi){errs.push(path+' is '+v+', outside '+lo+' to '+hi);return null;}
 return v;}
function validateProfile(o){
 var errs=[];
 if(!o||typeof o!=='object'||Array.isArray(o))return {ok:false, errs:['not an object']};
 if(!NUM(o.v)||o.v<1||o.v>SCHEMA_V)errs.push('schema version '+o.v+' is not 1 to '+SCHEMA_V);
 var p=blankProfile(typeof o.name==='string'?o.name:'Imported');
 p.v=NUM(o.v)?o.v:SCHEMA_V;
 if(typeof o.id==='string')p.id=o.id;
 if(typeof o.created==='string')p.created=o.created;
 if(typeof o.updated==='string')p.updated=o.updated;
 /* the nine axes */
 if(o.axes&&typeof o.axes==='object')CHILD.forEach(function(c){
  var a=o.axes[c.nm]; if(!a||typeof a!=='object')return;
  var h=vRange(errs,'axes.'+c.nm+'.held',a.held,0,10);
  var q=vRange(errs,'axes.'+c.nm+'.opp',a.opp,0,10);
  if(h!==null)p.axes[c.nm].held=h;
  if(q!==null)p.axes[c.nm].opp=q;});
 /* the 21 laws. null is a law not yet measured and is not an error. */
 if(o.laws&&typeof o.laws==='object')SI.forEach(function(l){
  if(o.laws[l.nm]===undefined||o.laws[l.nm]===null)return;
  var v=vRange(errs,'laws.'+l.nm,o.laws[l.nm],0,10);
  if(v!==null)p.laws[l.nm]=v;});
 /* the soul. indexes into fixed tables, so an index outside them is refused. */
 if(o.soul&&typeof o.soul==='object'){
  if(Array.isArray(o.soul.doms))p.soul.doms=o.soul.doms.filter(function(d){
   var v=vRange(errs,'soul.doms',d,0,DOMAINS.length-1);return v!==null;});
  if(Array.isArray(o.soul.arcs))p.soul.arcs=o.soul.arcs.filter(function(a){
   var v=vRange(errs,'soul.arcs',a,0,ARCH.length-1);return v!==null;});
  if(Array.isArray(o.soul.roots))p.soul.roots=o.soul.roots.filter(function(r){return typeof r==='string';});
  if(!p.soul.doms.length)p.soul.doms=[0];
  if(!p.soul.arcs.length)p.soul.arcs=[0,1];}
 /* gate evidence. counts of sentences, so any non negative integer. */
 if(o.gates&&typeof o.gates==='object'){
  if(o.gates.verp&&typeof o.gates.verp==='object')Object.keys(p.gates.verp).forEach(function(k){
   var v=vRange(errs,'gates.verp.'+k,o.gates.verp[k],0,1e6); if(v!==null)p.gates.verp[k]=v;});
  if(o.gates.lean&&typeof o.gates.lean==='object')['benign','malignant'].forEach(function(k){
   var v=vRange(errs,'gates.lean.'+k,o.gates.lean[k],0,1e6); if(v!==null)p.gates.lean[k]=v;});}
 /* the 63 answers */
 if(o.intake&&typeof o.intake==='object'){
  if(o.intake.answers&&typeof o.intake.answers==='object')Object.keys(o.intake.answers).forEach(function(k){
   var i=+k; if(!NUM(i)||i<0||i>62||i%1!==0){errs.push('intake answer key '+k+' is not 0 to 62');return;}
   if(o.intake.answers[k]===null)return;
   var v=vRange(errs,'intake.answers.'+k,o.intake.answers[k],0,10);
   if(v!==null)p.intake.answers[i]=v;});
  if(Array.isArray(o.intake.done))p.intake.done=o.intake.done.slice();
  if(typeof o.intake.startedAt==='string')p.intake.startedAt=o.intake.startedAt;
  if(typeof o.intake.completedAt==='string')p.intake.completedAt=o.intake.completedAt;}
 /* who. strings only, and never trusted into the document by this file. */
 if(o.who&&typeof o.who==='object'){
  ['first','middle','last','sex'].forEach(function(k){
   if(typeof o.who[k]==='string')p.who[k]=o.who[k].slice(0,200);});
  if(o.who.born&&typeof o.who.born==='object'){
   ['date','time','place'].forEach(function(k){
    if(typeof o.who.born[k]==='string')p.who.born[k]=o.who.born[k].slice(0,200);});
   p.who.born.timeUnknown=!!o.who.born.timeUnknown;}}
 /* the seed is a stated type, so it is one of sixteen or it is nothing. */
 if(o.seed&&typeof o.seed==='object'){
  if(!seedValid(o.seed.type))errs.push('seed type '+o.seed.type+' is not one of the sixteen');
  else{p.seed={type:String(o.seed.type).toUpperCase(),
   at:typeof o.seed.at==='string'?o.seed.at:new Date().toISOString(), axes:{}};
   CHARGES.forEach(function(c){
    var v=vRange(errs,'seed.axes.'+c,o.seed.axes?o.seed.axes[c]:3,0,10);
    p.seed.axes[c]=v===null?3:v;});}}
 /* logs. shape checked, contents left alone: they are the person's own text. */
 if(o.story&&Array.isArray(o.story.entries))p.story.entries=o.story.entries.slice();
 if(o.meter&&typeof o.meter==='object'){
  var mp=vRange(errs,'meter.lines',o.meter.lines,0,1e9);
  if(mp!==null)p.meter.lines=Math.floor(mp);
  if(Array.isArray(o.meter.unique))
   p.meter.unique=o.meter.unique.filter(function(k){return typeof k==='string'&&k.length<64;});
  else if(o.meter.unique!==undefined)errs.push('meter.unique is not a list');
  if(typeof o.meter.first==='string')p.meter.first=o.meter.first;
  if(typeof o.meter.last==='string')p.meter.last=o.meter.last;
  /* The dated firsts were written by meterFirst, returned by meterRead, and
     dropped here, so every one of them was lost through an import. They are
     the only achievement shape this product allows, which made the boundary
     the one place that could quietly delete a person's whole record of it.
     Validated like everything else: typed, bounded, and refused by name. */
  if(Array.isArray(o.meter.firsts)){
   p.meter.firsts=o.meter.firsts.filter(function(f){
    return f&&typeof f==='object'
     &&typeof f.k==='string'&&f.k.length>0&&f.k.length<64
     &&typeof f.t==='string'&&!isNaN(new Date(f.t).getTime())
     &&(f.nm===undefined||(typeof f.nm==='string'&&f.nm.length<120));})
    .map(function(f){return {k:f.k,t:f.t,nm:typeof f.nm==='string'?f.nm:f.k};});
   if(p.meter.firsts.length!==o.meter.firsts.length)
    errs.push('meter.firsts held '+(o.meter.firsts.length-p.meter.firsts.length)
     +' entries that are not a dated first');}
  else if(o.meter.firsts!==undefined)errs.push('meter.firsts is not a list');}
 if(Array.isArray(o.rituals))p.rituals=o.rituals.filter(function(x){return x&&typeof x==='object';});
 /* A snapshot is strictly typed numbers and the record calls toFixed on them,
    so "the person's own text" does not apply here. An unchecked history
    crashed the record view on the first render after an import. */
 if(Array.isArray(o.history))p.history=o.history.map(function(x,i){
  if(!x||typeof x!=='object'){errs.push('history entry '+i+' is not an object');return null;}
  var q={t:typeof x.t==='string'?x.t:new Date().toISOString(),
   dark:typeof x.dark==='string'?x.dark:'Heart',
   tier:typeof x.tier==='string'?x.tier:'Collapsed',
   arch:typeof x.arch==='string'?x.arch:''};
  [['cq',0,100],['dq',0,1e4],['sq',0,10],['pole',0,10],['jq',0,10],['rad',0,10],
   ['loaded',0,1e4],['sab',0,1e4],['cx',0,1e4],['hy',0,1e4],['ch',0,1e4]].forEach(function(f){
   var v=vRange(errs,'history['+i+'].'+f[0],x[f[0]],f[1],f[2]);
   q[f[0]]=v===null?0:v;});
  return q;}).filter(Boolean);
 return errs.length?{ok:false, errs:errs}:{ok:true, profile:p};}

/* Atomic. Nothing is pushed and CURP is not moved until the profile has
   validated and loaded. A failure leaves the app exactly as it was, and
   says what was wrong rather than returning a bare null. */
/* Counting is an engine job because the tier gate will read it, and the tier
   gate must not be able to disagree with the app about what was run. */
function meterKey(nodeId,chan){return String(nodeId)+':'+String(chan);}
function meterRun(p,keys){
 if(!p)return null;
 if(!p.meter)p.meter={lines:0,unique:[],first:null,last:null};
 if(!Array.isArray(p.meter.unique))p.meter.unique=[];
 var list=(keys||[]).filter(function(k){return typeof k==='string'&&k;});
 if(!list.length)return {added:0,repeated:0};
 var have={},added=0,repeated=0;
 p.meter.unique.forEach(function(k){have[k]=1;});
 list.forEach(function(k){ if(have[k]){repeated++;} else {have[k]=1;p.meter.unique.push(k);added++;} });
 var now=new Date().toISOString();
 if(!p.meter.first)p.meter.first=now;
 p.meter.lines+=list.length; p.meter.last=now;
 return {added:added, repeated:repeated};}

/* ============================================================
   THE HORIZON, AND WHY THE LADDER IS NOT A FIXED COUNT.

   The owner's ruling, and it overturns what this file said before.
   A person does not have to clear a fixed number. They have to
   clear THEIR OWN, and their own is a function of how long they
   have been alive to accumulate it.

   The anchor is his: fifteen thousand by the age of fifty. That is
   three hundred a year, and three thousand a decade, not the two
   thousand a decade he estimated out loud. The arithmetic is stated
   here rather than rounded to the estimate, because every marker in
   the product derives from it.

   Three thresholds were named with distances attached: breaking
   duality around five hundred, the beginning of nirvana around ten
   thousand, ascension around fifteen thousand. Against a total of
   fifteen thousand those are exact thirtieths, one, twenty and
   thirty, and the three thresholds already in the book fall on
   thirtieths too, five, seven and nine. So the ladder is a fraction
   of a person's own load and always was. The absolute counts were
   one man's numbers at one man's age.

   A twenty year old does not reach ascension at fifteen thousand.
   They reach it at six. The distance is the same distance: all of
   what they are carrying.

   The swing is ten percent because how hard somebody identifies
   with a thing is not knowable from a birth date. PAT_COHORT is the
   place a generational rate goes, on the owner's observation that
   younger people are more identified, which is a real effect and
   not yet a number. It multiplies the yearly rate and is one until
   he sets it, so the model has the seam without inventing the
   figure.
   ============================================================ */
const PAT_PER_YEAR=300, PAT_SWING=0.10, PAT_COHORT=1;
/* The ladder, from SOURCE OS v27.3 Sprint J, which the owner had already
   designed. Six fixed distances on one ruler.

   Two things were reconciled against that document. It names 3,500
   Integration where the engine had Christ consciousness; the owner's own
   document wins. And its counts are of total releases, which include
   repeats, where the meter counts unique ground opened. Unique is the
   harder number and the one a tier sells, so the thresholds are held
   against it and the difference is stated rather than quietly rescaled.

   A marker is a distance, never a trophy and never a gate. Nothing in the
   product unlocks at one, because a marker that unlocks something is a
   marker for sale, and unique ground is exactly what money buys. */
const MARKERS=[
 {nm:'Entry',                at:1,     of:'the first address opened'},
 {nm:'Breaking duality',     frac:1/30,  of:'your own load'},
 {nm:'The Still Mind',       frac:5/30,  of:'your own load'},
 {nm:'The Open Heart',       frac:7/30,  of:'your own load'},
 {nm:'Clear Perception',     frac:9/30,  of:'your own load'},
 {nm:'Beginning of Nirvana', frac:20/30, of:'your own load'},
 {nm:'Ascension',            frac:1,     of:'your own load'}];
/* A marker resolves against the person in front of it. Entry is the one
   absolute, because a first address is a first address at any age. The rest
   are fractions and need a total, so a record with no birth date is read
   against the reference scale rather than refused: the owner's own, fifty
   years, fifteen thousand. The read says which of the two it used, because a
   distance computed from somebody else's age is a different claim and the
   surface has to be able to say so. */
const PAT_REF_AGE=50;
function markersFor(est){
 var total=est||Math.round(PAT_REF_AGE*PAT_PER_YEAR*PAT_COHORT);
 return MARKERS.map(function(k){
  return {nm:k.nm, of:k.of,
   at:(k.at!=null)?k.at:Math.max(1,Math.round(total*k.frac))};});}
function ageAt(dateStr,now){
 if(!dateStr)return null;
 var b=new Date(dateStr+'T00:00:00Z'); if(isNaN(b.getTime()))return null;
 var t=now?new Date(now):new Date();
 var a=(t-b)/(365.2425*24*3600*1000);
 return a>0&&a<130?a:null;}
function meterRead(p,now){
 var m=(p&&p.meter)||{lines:0,unique:[],first:null,last:null};
 var uniq=(m.unique||[]).length;
 var age=ageAt(p&&p.who&&p.who.born?p.who.born.date:null,now);
 var est=age===null?null:Math.round(age*PAT_PER_YEAR*PAT_COHORT);
 var mk=markersFor(est);
 return {lines:m.lines, unique:uniq, first:m.first, last:m.last,
  /* the gift is 100 of new ground, ruled. reruns never spend it. */
  giftLeft:Math.max(0,100-uniq), inGift:uniq<100,
  age:age===null?null:Math.round(age*10)/10,
  estimate:est,
  estimateLow:est===null?null:Math.round(est*(1-PAT_SWING)),
  estimateHigh:est===null?null:Math.round(est*(1+PAT_SWING)),
  cleared:est?Math.min(1,uniq/est):null,
  /* the ladder, resolved against this person rather than against a table */
  scaled:est!==null,
  markers:mk.map(function(k){return {nm:k.nm, at:k.at, of:k.of,
   reached:uniq>=k.at, left:Math.max(0,k.at-uniq)};}),
  /* the next one only, because six distances at once is a to do list and
     one distance is a direction. null when they are all behind you. */
  next:(function(){for(var i=0;i<mk.length;i++)
   if(uniq<mk[i].at)return {nm:mk[i].nm, at:mk[i].at,
    left:mk[i].at-uniq}; return null;})(),
  /* a dated first cannot be taken away and claims no causation, which is
     why it is the only achievement shape this product allows. */
  firsts:(p&&p.meter&&p.meter.firsts)||[]};}

/* Record a dated first. meterRun already knows the moment ground is new
   and nothing read it. These are facts about the work, never statements
   about the person: the ladder says an address was opened on a date, it
   does not say what that made someone. */
function meterFirst(p,key,label){
 if(!p||!key)return null;
 if(!p.meter)p.meter={lines:0,unique:[],first:null,last:null};
 if(!Array.isArray(p.meter.firsts))p.meter.firsts=[];
 for(var i=0;i<p.meter.firsts.length;i++)
  if(p.meter.firsts[i].k===key)return null;      /* a first happens once */
 var f={k:key, t:new Date().toISOString(), nm:label||key};
 p.meter.firsts.push(f);
 return f;}

var IMPORT_ERR=null;
function pImport(txt){
 IMPORT_ERR=null;
 var o; try{ o=JSON.parse(txt); }catch(e){ IMPORT_ERR=['not valid JSON']; return null; }
 var v=validateProfile(o);
 if(!v.ok){ IMPORT_ERR=v.errs; return null; }
 var keepP=PROFILES.slice(), keepC=CURP;
 /* with no current profile there is nothing to restore to, so the rollback
    loads a blank rather than leaving the engine holding the rejected one. */
 var back=function(){ PROFILES=keepP; CURP=keepC; loadProfile(keepC||blankProfile('unnamed')); };
 try{ loadProfile(v.profile); }
 catch(e){ back(); IMPORT_ERR=['could not load: '+((e&&e.message)||'error')]; return null; }
 PROFILES.push(v.profile); CURP=v.profile;
 if(!pPersist()){ back(); IMPORT_ERR=['could not save: '+(SAVE_ERR||'error')]; return null; }
 return v.profile;}
function importError(){ return IMPORT_ERR; }

