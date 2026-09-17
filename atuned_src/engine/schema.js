
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
  laws:{}, intake:{answers:{}, done:[], startedAt:null, completedAt:null},
  gates:{verp:{aware:0,detach:0,intent:0,ignore:0,attach:0,averse:0},
         lean:{benign:0,malignant:0}},   /* the cost multiplier, v2 */
  story:{entries:[]}, rituals:[], history:[]};
 CHILD.forEach(function(c){p.axes[c.nm]={held:3,opp:0};});
 SI.forEach(function(l){p.laws[l.nm]=null;});        /* null = not yet measured */
 return p;}
function loadProfile(p){
 S.doms=(p.soul.doms||[0]).slice(); S.arcs=(p.soul.arcs||[0,1]).slice();
 S.roots=(p.soul.roots||[]).slice(); buildSoul();
 CHILD.forEach(function(c){var a=p.axes[c.nm]||{};
  S.charge[c.nm]=a.held!=null?a.held:3; S.replace[c.nm]=a.opp||0;});
 SI.forEach(function(l){S.law[l.nm]=(p.laws[l.nm]!=null)?p.laws[l.nm]:6;});
 gatesLoad(p);   /* absent on a v1 profile, which reads as no story evidence */
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
function pImport(txt){ try{ var o=JSON.parse(txt); if(!o||!o.v)return null;
 PROFILES.push(o); CURP=o; loadProfile(o); pPersist(); return o; }catch(e){ return null; } }

