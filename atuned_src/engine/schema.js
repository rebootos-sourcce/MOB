
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
  laws:{}, intake:{answers:{}, done:[], startedAt:null, completedAt:null},
  gates:{verp:{aware:0,detach:0,intent:0,ignore:0,attach:0,averse:0},
         lean:{benign:0,malignant:0}},   /* the cost multiplier, v2 */
  story:{entries:[]}, rituals:[], history:[]};
 CHILD.forEach(function(c){p.axes[c.nm]={held:3,opp:0};});
 SI.forEach(function(l){p.laws[l.nm]=null;});        /* null = not yet measured */
 return p;}
function loadProfile(p){
 if(!p.who)p.who={first:'',middle:'',last:'',sex:'',born:{date:'',time:'',place:'',timeUnknown:false}};
 if(!p.who.born)p.who.born={date:'',time:'',place:'',timeUnknown:false};
 S.doms=(p.soul.doms||[0]).slice(); S.arcs=(p.soul.arcs||[0,1]).slice();
 S.roots=(p.soul.roots||[]).slice(); buildSoul();
 CHILD.forEach(function(c){var a=p.axes[c.nm]||{};
  S.charge[c.nm]=a.held!=null?a.held:3; S.replace[c.nm]=a.opp||0;});
 SI.forEach(function(l){S.law[l.nm]=(p.laws[l.nm]!=null)?p.laws[l.nm]:6;});
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
 if(Array.isArray(o.rituals))p.rituals=o.rituals.slice();
 if(Array.isArray(o.history))p.history=o.history.slice();
 return errs.length?{ok:false, errs:errs}:{ok:true, profile:p};}

/* Atomic. Nothing is pushed and CURP is not moved until the profile has
   validated and loaded. A failure leaves the app exactly as it was, and
   says what was wrong rather than returning a bare null. */
var IMPORT_ERR=null;
function pImport(txt){
 IMPORT_ERR=null;
 var o; try{ o=JSON.parse(txt); }catch(e){ IMPORT_ERR=['not valid JSON']; return null; }
 var v=validateProfile(o);
 if(!v.ok){ IMPORT_ERR=v.errs; return null; }
 var keepP=PROFILES.slice(), keepC=CURP;
 try{ loadProfile(v.profile); }
 catch(e){ PROFILES=keepP; CURP=keepC; if(keepC)loadProfile(keepC);
  IMPORT_ERR=['could not load: '+((e&&e.message)||'error')]; return null; }
 PROFILES.push(v.profile); CURP=v.profile;
 if(!pPersist()){ PROFILES=keepP; CURP=keepC; if(keepC)loadProfile(keepC);
  IMPORT_ERR=['could not save: '+(SAVE_ERR||'error')]; return null; }
 return v.profile;}
function importError(){ return IMPORT_ERR; }

